import { pool } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("employee_image") as unknown as File;
  const employeeId = data.get("employee_id");

  if (!file) {
    return NextResponse.json({ message: "no image found", success: false });
  }

  const bytes = await file.arrayBuffer();
  const imageBuffer = Buffer.from(bytes);
  const value = [bytes, imageBuffer];
  try {
    await pool.query(
      "UPDATE employee SET employee_image = $1 WHERE employee_id = $2",
      value
    );

    return NextResponse.json({ message: "file upload", success: true });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { message: "Error uploading image" },
      { status: 400 }
    );
  }
}
