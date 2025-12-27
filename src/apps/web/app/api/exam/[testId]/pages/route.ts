import { NextResponse as Response } from "next/server";
import { supabaseStorage } from "@/lib/supabase-storage";

const BUCKET = "test_images";
const EXTS = ["jpg", "png", "webp"];

export async function GET(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  if (!testId) {
    return Response.json(
      { error: "Missing testId parameter" },
      { status: 400 }
    );
  }

  const folderPath = `exam-${testId}`;
  // 1️⃣ Read files from Supabase Storage
  const { data: files, error } = await supabaseStorage.storage
    .from(BUCKET)
    .list(folderPath, { limit: 200 });

  if (error) {
    return Response.json(
      { error: "Failed to read storage folder" },
      { status: 500 }
    );
  }

  if (!files || files.length === 0) {
    console.log("Listing folder:", folderPath);
console.log("Files:", files);
    return Response.json(
      { error: `Folder not found: ${folderPath}` },
      { status: 404 }
    );
  }

  // 2️⃣ Same page-detection logic
  let pages: string[] = [];

  for (const ext of EXTS) {
    const matched = files
      .filter((f) => f.name.match(new RegExp(`^page-\\d+\\.${ext}$`)))
      .sort((a, b) => {
        const ai = Number(a.name.match(/\d+/)?.[0]);
        const bi = Number(b.name.match(/\d+/)?.[0]);
        return ai - bi;
      });

    if (matched.length > 0) {
      pages = await Promise.all(
        matched.map(async (file) => {
          const fullPath = `${folderPath}/${file.name}`;

          const { data } = await supabaseStorage.storage
            .from(BUCKET)
            .createSignedUrl(fullPath, 60 * 5);

          return data!.signedUrl;
        })
      );
      break;
    }
  }

  if (pages.length === 0) {
    return Response.json(
      { error: "No pages found" },
      { status: 204 }
    );
  }

  return Response.json(
    { pages, totalPages: pages.length },
    { status: 200 }
  );
}
