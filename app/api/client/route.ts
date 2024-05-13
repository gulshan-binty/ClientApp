import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
// Corrected import statement
import fs from "fs";
import path from "path";
import { pool } from "@/utils/db";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM client");
    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const client_name = formData.get("client_name")?.toString() || "";
    const client_phone = formData.get("client_phone")?.toString() || "";
    const client_email = formData.get("client_email")?.toString() || "";

    const client_image = formData.get("client_image");

    if (!client_image || !(client_image instanceof File)) {
      return new NextResponse("Invalid image file", { status: 400 });
    }

    const fileName = `client_${Date.now()}.${client_image.name
      .split(".")
      .pop()}`;
    const imagePath = path.join(
      process.cwd(),
      "public",
      "client_image",
      fileName
    );
    const imageUrl = `/client_image/${fileName}`;

    const imageBuffer = Buffer.from(await client_image.arrayBuffer());
    await fs.promises.writeFile(imagePath, imageBuffer);

    const { rows } = await pool.query(
      "INSERT INTO client (client_name, client_phone, client_email,client_image) VALUES ($1, $2, $3, $4) RETURNING *",
      [client_name, client_phone, client_email, imageUrl]
    );

    return new NextResponse(JSON.stringify(rows[0]), { status: 201 });
  } catch (error) {
    console.error("Error saving employee:", error);
    return new NextResponse("Internal error", { status: 400 });
  }
}
