import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export async function convertPdfAndUpload(supabaseUrl: string, serviceKey: string, bucket: string, filePath: string, format: 'png' | 'jpg' = 'png', outputBucket?: string) {
  const outDirName = Date.now().toString();
  const tmpDir = path.join(os.tmpdir(), 'pdf-images', outDirName);
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supa = createClient(supabaseUrl.replace(/\/$/, ''), serviceKey);

    // get signed URL for PDF
    const { data: signedData, error: signedErr } = await supa.storage.from(bucket).createSignedUrl(filePath, 60);
    if (signedErr || !signedData?.signedUrl) {
      return { error: 'file_not_found_in_bucket', uploaded: [] };
    }

    const pdfPath = path.join(tmpDir, 'input.pdf');
    const res = await fetch(signedData.signedUrl);
    if (!res.ok || !res.body) return { error: 'failed_to_download_file', uploaded: [] };
    await pipeline(res.body as any, createWriteStream(pdfPath));

    // attempt to import mupdf; if not available, skip conversion
    let mupdf: any = null;
    try {
      mupdf = (await import('mupdf')).default;
    } catch (e) {
      console.warn('mupdf not available, skipping PDF->image conversion', (e as any)?.message ?? e);
      return { error: 'mupdf_not_available', uploaded: [] };
    }

    const doc = mupdf.Document.openDocument(pdfPath);
    const pageCount = doc.countPages();
    const ext = format === 'png' ? 'png' : 'jpg';

    const uploadedUrls: string[] = [];
    const destBucket = outputBucket || bucket;

    for (let i = 0; i < pageCount; i++) {
      const page = doc.loadPage(i);
      const matrix = mupdf.Matrix.scale(2, 2);
      const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB);

      const outFile = path.join(tmpDir, `page-${String(i + 1).padStart(3, '0')}.${ext}`);

      if (ext === 'png') {
        const pngBytes = pixmap.asPNG();
        await fs.writeFile(outFile, Buffer.from(pngBytes));
      } else {
        pixmap.saveAsJPEG(outFile, 90);
      }

      pixmap.destroy();
      page.destroy();

      // upload
      const buffer = await fs.readFile(outFile);
      const baseName = path.basename(filePath, path.extname(filePath));
      const destPath = `${baseName}/${path.basename(outFile)}`;

      const { error: uploadErr } = await supa.storage.from(destBucket).upload(destPath, buffer, {
        contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
        upsert: true,
      });

      if (uploadErr) {
        console.error('uploadErr', uploadErr, destPath);
        continue;
      }

      const { data: publicData } = supa.storage.from(destBucket).getPublicUrl(destPath);
      const publicUrl = (publicData as any)?.publicUrl || null;
      if (publicUrl) uploadedUrls.push(publicUrl);
      else {
        const { data: signedImg } = await supa.storage.from(destBucket).createSignedUrl(destPath, 60 * 60);
        if (signedImg?.signedUrl) uploadedUrls.push(signedImg.signedUrl);
      }
    }

    doc.destroy();
    return { error: null, uploaded: uploadedUrls };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => { });
  }
}

export default convertPdfAndUpload;
