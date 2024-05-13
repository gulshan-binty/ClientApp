import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/utils/db";
import fs from "fs";
import path from "path";
export async function GET(req: Request, route: any) {
  const id = Number(route.params.id);

  try {
    const { rows } = await pool.query(
      "SELECT * FROM client WHERE client_id = $1",
      [id]
    );

    if (rows.length === 0) {
      return new NextResponse(JSON.stringify("Client not found"), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function DELETE(req: Request, route: any) {
  const id = Number(route.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM client WHERE client_id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return new NextResponse(JSON.stringify("Client not found"), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(result.rows), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, route: any) {
  try {
    const id = Number(route.params.id);
    const body = await req.formData(); // Use formData() instead of json()

    const { client_name, client_phone, client_email } = Object.fromEntries(
      body.entries()
    );

    // Check if any required fields are missing
    if (!client_name || !client_phone || !client_email) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if the employee exists
    const { rowCount } = await pool.query(
      "SELECT * FROM client WHERE client_id = $1",
      [id]
    );
    if (rowCount === 0) {
      return new NextResponse("client not found", { status: 404 });
    }

    // Handle image upload if it exists in the form data
    let imageUrl = undefined;
    const client_image = body.get("client_image");
    if (client_image && client_image instanceof File) {
      const fileName = `client_${Date.now()}.${client_image.name
        .split(".")
        .pop()}`;
      const imagePath = path.join(
        process.cwd(),
        "public",
        "client_image",
        fileName
      );
      imageUrl = `/client_image/${fileName}`;
      const imageBuffer = Buffer.from(await client_image.arrayBuffer());
      await fs.promises.writeFile(imagePath, imageBuffer);
    } else {
      // If no new image is uploaded, retain the existing image URL
      const existingEmployee = await pool.query(
        "SELECT client_image FROM client WHERE client_id = $1",
        [id]
      );
      imageUrl = existingEmployee.rows[0].client_image;
    }

    // Update the employee
    await pool.query(
      "UPDATE client SET client_name = $1, client_phone = $2, client_email = $3, client_image = $4 WHERE client_id = $5",
      [
        client_name,
        client_phone,
        client_email,
        imageUrl, // Use the updated imageUrl
        id,
      ]
    );

    return new NextResponse("client updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating client:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
