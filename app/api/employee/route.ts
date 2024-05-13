import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/utils/db";
import fs from "fs";
import path from "path";
import { request } from "http";
export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM employee");
    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const employee_name = formData.get("employee_name")?.toString() || "";
    const employee_phone = formData.get("employee_phone")?.toString() || "";
    const employee_email = formData.get("employee_email")?.toString() || "";
    const employee_designation =
      formData.get("employee_designation")?.toString() || "";
    const employee_image = formData.get("employee_image");

    if (!employee_image || !(employee_image instanceof File)) {
      return new NextResponse("Invalid image file", { status: 400 });
    }

    const fileName = `employee_${Date.now()}.${employee_image.name
      .split(".")
      .pop()}`;
    const imagePath = path.join(
      process.cwd(),
      "public",
      "employee_image",
      fileName
    );
    const imageUrl = `/employee_image/${fileName}`;

    const imageBuffer = Buffer.from(await employee_image.arrayBuffer());
    await fs.promises.writeFile(imagePath, imageBuffer);

    const { rows } = await pool.query(
      "INSERT INTO employee (employee_name, employee_phone, employee_email, employee_designation, employee_image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        employee_name,
        employee_phone,
        employee_email,
        employee_designation,
        imageUrl,
      ]
    );

    return new NextResponse(JSON.stringify(rows[0]), { status: 201 });
  } catch (error) {
    console.error("Error saving employee:", error);
    return new NextResponse("Internal error", { status: 400 });
  }
}
