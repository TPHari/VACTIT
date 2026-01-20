"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRoutes = testRoutes;
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const promises_2 = require("stream/promises");
const supabase_js_1 = require("@supabase/supabase-js");
async function testRoutes(server) {
    const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_API, process.env.SUPABASE_SERVICE_ROLE_KEY);
    server.get('/api/tests', async (request, reply) => {
        try {
            const { query, type, category = 'all', status = 'all', sort = 'newest', page = '1', limit = '12', userId } = request.query;
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const skip = (pageInt - 1) * limitInt;
            // --- LOGIC LẤY USER ID ---
            // Ưu tiên lấy từ Query Param do Frontend gửi xuống
            const currentUserId = userId;
            const searchUserId = currentUserId;
            // --- Debug Log ---
            console.log(`[API] Fetching tests. UserID provided: ${currentUserId || 'Guest'}`);
            // --- B. Mốc thời gian ---
            const now = new Date();
            const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            // --- C. Bộ lọc (WHERE) ---
            const where = {};
            if (query)
                where.title = { contains: query, mode: 'insensitive' };
            // Filter theo Category
            switch (category) {
                case 'upcoming':
                    where.type = 'exam';
                    where.start_time = { gt: oneDayLater };
                    break;
                case 'countdown':
                    where.type = 'exam';
                    where.start_time = { gt: now, lte: oneDayLater };
                    break;
                case 'in_progress':
                    where.type = 'exam';
                    where.start_time = { lte: now };
                    where.due_time = { gte: now };
                    break;
                case 'locked':
                    where.type = 'exam';
                    where.due_time = { lt: now };
                    break;
                case 'practice':
                    where.type = 'practice';
                    break;
                case 'all':
                default:
                    if (type && type !== 'all')
                        where.type = type;
                    break;
            }
            // Filter theo Status (Dựa trên searchUserId)
            if (status === 'completed') {
                where.trials = { some: { student_id: searchUserId } };
            }
            else if (status === 'not_started') {
                where.trials = { none: { student_id: searchUserId } };
            }
            // --- D. Sắp xếp (ORDER BY) ---
            let orderBy = [];
            if (['upcoming', 'countdown', 'in_progress'].includes(category)) {
                orderBy = [{ start_time: 'asc' }, { test_id: 'asc' }];
            }
            else {
                if (sort === 'oldest') {
                    orderBy = [{ start_time: 'asc' }, { test_id: 'asc' }];
                }
                else {
                    orderBy = [{ start_time: 'desc' }, { test_id: 'desc' }];
                }
            }
            // --- E. Truy vấn ---
            const [tests, total] = await Promise.all([
                server.prisma.test.findMany({
                    where,
                    skip: skip,
                    take: limitInt,
                    orderBy: orderBy,
                    include: {
                        author: { select: { user_id: true, name: true, email: true } },
                        // Lấy danh sách lần thi của User này để Frontend đếm
                        trials: {
                            where: { student_id: searchUserId },
                            select: { trial_id: true }
                        },
                        _count: { select: { trials: true } }
                    }
                }),
                server.prisma.test.count({ where })
            ]);
            return {
                data: tests,
                pagination: {
                    total, page: pageInt, limit: limitInt, totalPages: Math.ceil(total / limitInt)
                }
            };
        }
        catch (error) {
            server.log.error(error);
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'Failed to fetch tests'
            };
        }
    });
    server.get('/api/tests/:id', async (request, reply) => {
        try {
            const test = await server.prisma.test.findUnique({
                where: { test_id: request.params.id },
                include: { author: true, trials: true }
            });
            if (!test)
                return reply.status(404).send({ error: 'Test not found' });
            return { data: test };
        }
        catch (error) {
            server.log.error(error);
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'Failed to fetch test'
            };
        }
    });
    server.post('/api/tests', async (request, reply) => {
        try {
            const test = await server.prisma.test.create({ data: request.body });
            reply.status(201);
            return { data: test };
        }
        catch (error) {
            server.log.error(error);
            reply.status(400);
            return {
                error: error instanceof Error ? error.message : 'Failed to create test'
            };
        }
    });
    // Trigger IRT Calculation -> /api/tests/:id/calculate-irt
    server.post('/api/tests/:id/calculate-irt', async (request, reply) => {
        try {
            const { id } = request.params;
            // Instantiate queue locally (lightweight for producing)
            const { Queue } = await Promise.resolve().then(() => __importStar(require('bullmq')));
            const irtQueue = new Queue('irt-queue', {
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                }
            });
            await irtQueue.add('calculate', { testId: id });
            reply.status(202);
            return { message: 'IRT calculation job queued', testId: id };
        }
        catch (error) {
            server.log.error(error);
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'Failed to queue IRT job'
            };
        }
    });
    server.get('/api/exam/:trial_id/pages', async (request, reply) => {
        try {
            const { trial_id } = request.params;
            if (!trial_id) {
                reply.status(400);
                return { error: 'Missing trial_id' };
            }
            const BUCKET = 'test_images';
            const EXTS = ['jpg', 'png', 'webp'];
            const CACHE_TTL = 300; // 5 minutes (matches signed URL validity)
            // 0️⃣ Lấy test_id từ trial_id
            const trial = await server.prisma.trial.findUnique({
                where: { trial_id },
                select: { test_id: true }
            });
            console.log('Fetching for trial_id:', trial_id);
            if (!trial) {
                reply.status(404);
                return { error: 'trial_not_found' };
            }
            const cacheKey = `exam-pages:${trial.test_id}`;
            // 🔍 Check Redis cache first
            if (server.redis) {
                try {
                    const cached = await server.redis.get(cacheKey);
                    if (cached) {
                        console.log(`Cache HIT for ${cacheKey}`);
                        return JSON.parse(cached);
                    }
                    console.log(`Cache MISS for ${cacheKey}`);
                }
                catch (cacheErr) {
                    console.error('Cache read error:', cacheErr);
                    // Continue without cache on error
                }
            }
            const folderPath = `${trial.test_id}`;
            // 1️⃣ Read files from Supabase Storage
            const { data: files, error } = await supabase.storage
                .from(BUCKET)
                .list(folderPath, { limit: 200 });
            if (error) {
                reply.status(500);
                return { error: 'failed_to_read_storage' };
            }
            if (!files || files.length === 0) {
                reply.status(404);
                return { error: `Folder not found: ${folderPath}` };
            }
            // 2️⃣ Same page-detection logic
            let pages = [];
            for (const ext of EXTS) {
                const matched = files
                    .filter((f) => f.name.match(new RegExp(`^page-\\d+\\.${ext}$`)))
                    .sort((a, b) => {
                    const ai = Number(a.name.match(/\d+/)?.[0] || 0);
                    const bi = Number(b.name.match(/\d+/)?.[0] || 0);
                    return ai - bi;
                });
                if (matched.length > 0) {
                    pages = (await Promise.all(matched.map(async (file) => {
                        const fullPath = `${folderPath}/${file.name}`;
                        const { data } = await supabase.storage
                            .from(BUCKET)
                            .createSignedUrl(fullPath, 60 * 5);
                        return data?.signedUrl || null;
                    }))).filter(Boolean);
                    break;
                }
            }
            if (pages.length === 0) {
                reply.status(204);
                return { error: 'No pages found' };
            }
            const result = { pages, totalPages: pages.length };
            // 💾 Store in Redis cache
            if (server.redis) {
                try {
                    await server.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
                    console.log(`💾 Cached ${cacheKey} for ${CACHE_TTL}s`);
                }
                catch (cacheErr) {
                    console.error('Cache write error:', cacheErr);
                    // Continue without caching on error
                }
            }
            console.log('Found pages:', pages.length);
            return result;
        }
        catch (err) {
            server.log.error(err);
            reply.status(500);
            return { error: err instanceof Error ? err.message : 'internal_error' };
        }
    });
    server.post('/api/pdf/convert-from-bucket', async (request, reply) => {
        try {
            const { bucket, filePath, format = 'png', outputBucket, // optional: where to store generated images (defaults to same bucket)
             } = request.body;
            if (!bucket || !filePath) {
                reply.status(400);
                return { error: 'missing_bucket_or_path' };
            }
            if (!['png', 'jpg', 'jpeg'].includes(format)) {
                reply.status(400);
                return { error: 'invalid_format' };
            }
            // temp local dir for rendering
            const outDirName = Date.now().toString();
            const tmpDir = path_1.default.join(os_1.default.tmpdir(), 'pdf-images', outDirName);
            await promises_1.default.mkdir(tmpDir, { recursive: true });
            // get signed URL for PDF
            const { data: signedData, error: signedErr } = await supabase.storage.from(bucket).createSignedUrl(filePath, 60);
            if (signedErr || !signedData?.signedUrl) {
                await promises_1.default.rm(tmpDir, { recursive: true, force: true }).catch(() => { });
                reply.status(404);
                return { error: 'file_not_found_in_bucket' };
            }
            // download PDF to tmp
            const pdfPath = path_1.default.join(tmpDir, 'input.pdf');
            const res = await fetch(signedData.signedUrl);
            if (!res.ok || !res.body) {
                await promises_1.default.rm(tmpDir, { recursive: true, force: true }).catch(() => { });
                reply.status(502);
                return { error: 'failed_to_download_file' };
            }
            // Cast to any to avoid "ReadableStream not assignable to PipelineSource"
            await (0, promises_2.pipeline)(res.body, (0, fs_1.createWriteStream)(pdfPath));
            // render with mupdf (already in repo)
            // @ts-ignore
            const mupdf = (await Promise.resolve().then(() => __importStar(require('mupdf')))).default;
            const doc = mupdf.Document.openDocument(pdfPath);
            const pageCount = doc.countPages();
            const ext = format === 'png' ? 'png' : 'jpg';
            for (let i = 0; i < pageCount; i++) {
                const page = doc.loadPage(i);
                const matrix = mupdf.Matrix.scale(2, 2);
                const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB);
                const outFile = path_1.default.join(tmpDir, `page-${String(i + 1).padStart(3, '0')}.${ext}`);
                if (ext === 'png') {
                    const pngBytes = pixmap.asPNG();
                    await promises_1.default.writeFile(outFile, Buffer.from(pngBytes));
                }
                else {
                    pixmap.saveAsJPEG(outFile, 90);
                }
                pixmap.destroy();
                page.destroy();
            }
            doc.destroy();
            // upload images to supabase storage
            const destBucket = outputBucket || bucket;
            console.log('Uploading rendered images to bucket:', destBucket);
            const files = (await promises_1.default.readdir(tmpDir))
                .filter(f => f.endsWith(`.${ext}`))
                .sort();
            const uploadedUrls = [];
            for (const fname of files) {
                const localPath = path_1.default.join(tmpDir, fname);
                const buffer = await promises_1.default.readFile(localPath);
                const destPath = `${path_1.default.basename(filePath, path_1.default.extname(filePath))}/${fname}`;
                // upload (upsert true to avoid conflicts)
                const { error: uploadErr } = await supabase.storage
                    .from(destBucket)
                    .upload(destPath, buffer, {
                    contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
                    upsert: true,
                });
                if (uploadErr) {
                    // continue but log
                    server.log.error({ uploadErr, file: destPath });
                    continue;
                }
                // get public URL (works for public buckets)
                const { data: publicData } = supabase.storage.from(destBucket).getPublicUrl(destPath);
                const publicUrl = publicData?.publicUrl || null;
                // if bucket is private, createSignedUrl instead (short lived)
                if (!publicUrl) {
                    const { data: signedImg, error: signedImgErr } = await supabase.storage
                        .from(destBucket)
                        .createSignedUrl(destPath, 60 * 60); // 1 hour
                    if (signedImgErr) {
                        server.log.error({ signedImgErr, file: destPath });
                        continue;
                    }
                    uploadedUrls.push(signedImg.signedUrl);
                }
                else {
                    uploadedUrls.push(publicUrl);
                }
            }
            // cleanup local tmp
            await promises_1.default.rm(tmpDir, { recursive: true, force: true }).catch(() => { });
            return { data: uploadedUrls };
        }
        catch (err) {
            server.log.error(err);
            reply.status(500);
            return {
                error: err instanceof Error ? err.message : 'internal_error',
            };
        }
    });
}
