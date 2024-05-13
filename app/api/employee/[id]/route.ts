import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
// Corrected import statement
import { pool } from "@/utils/db";
import fs from "fs";
import path from "path";
export async function GET(req: Request, route: any) {
  const id = Number(route.params.id);

  try {
    const { rows } = await pool.query(
      "SELECT * FROM employee WHERE employee_id = $1",
      [id]
    );

    if (rows.length === 0) {
      return new NextResponse(JSON.stringify("employee not found"), {
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
      "DELETE FROM employee WHERE employee_id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return new NextResponse(JSON.stringify("employee not found"), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(result.rows), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, route: any) {
  try {
    const id = Number(route.params.id);
    const body = await req.formData(); // Use formData() instead of json()

    const {
      employee_name,
      employee_phone,
      employee_email,
      employee_designation,
    } = Object.fromEntries(body.entries());

    // Check if any required fields are missing
    if (
      !employee_name ||
      !employee_phone ||
      !employee_email ||
      !employee_designation
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if the employee exists
    const { rowCount } = await pool.query(
      "SELECT * FROM employee WHERE employee_id = $1",
      [id]
    );
    if (rowCount === 0) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    // Handle image upload if it exists in the form data
    let imageUrl = undefined;
    const employee_image = body.get("employee_image");
    if (employee_image && employee_image instanceof File) {
      const fileName = `employee_${Date.now()}.${employee_image.name
        .split(".")
        .pop()}`;
      const imagePath = path.join(
        process.cwd(),
        "public",
        "employee_image",
        fileName
      );
      imageUrl = `/employee_image/${fileName}`;
      const imageBuffer = Buffer.from(await employee_image.arrayBuffer());
      await fs.promises.writeFile(imagePath, imageBuffer);
    } else {
      // If no new image is uploaded, retain the existing image URL
      const existingEmployee = await pool.query(
        "SELECT employee_image FROM employee WHERE employee_id = $1",
        [id]
      );
      imageUrl = existingEmployee.rows[0].employee_image;
    }

    // Update the employee
    await pool.query(
      "UPDATE employee SET employee_name = $1, employee_phone = $2, employee_email = $3, employee_designation = $4, employee_image = $5 WHERE employee_id = $6",
      [
        employee_name,
        employee_phone,
        employee_email,
        employee_designation,
        imageUrl, // Use the updated imageUrl
        id,
      ]
    );

    return new NextResponse("Employee updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating employee:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
