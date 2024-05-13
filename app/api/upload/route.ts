import { readFile, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ message: "no image found", success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  //   const path = join("/", "tmp", file.name);

  const path = `./public/image/${file.name}`;
  await writeFile(path, buffer);
  //   console.log(`open ${path} to see the upload file`);
  return NextResponse.json({ message: "file upload", success: true });
}

export async function GET(req: NextRequest) {
  const imageName = req.formData();
  if (typeof imageName !== "string") {
    return NextResponse.json({ message: "Invalid image name", success: false });
  }

  try {
    const path = join(process.cwd(), "public", "image", imageName);
    const imageData = await readFile(path);
    return new NextResponse(imageData, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ message: "Image not found", success: false });
  }
}
