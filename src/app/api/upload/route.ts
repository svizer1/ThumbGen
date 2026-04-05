import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB per file
const MAX_FILES = 10;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Too many files. Maximum is ${MAX_FILES}.` },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Invalid file object' }, { status: 400 });
      }

      if (!ALLOWED_MIME.has(file.type)) {
        return NextResponse.json(
          {
            error: `File type "${file.type}" is not allowed. Accepted: JPEG, PNG, WebP, GIF, AVIF.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: `"${file.name}" exceeds the 15 MB size limit.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase();
      const filename = `${uuidv4()}.${ext}`;
      await writeFile(join(uploadDir, filename), buffer);

      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error('[/api/upload] error:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}