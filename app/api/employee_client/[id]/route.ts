import { pool } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, route: any) {
  const id = Number(route.params.id);

  try {
    const query = `
      SELECT e.*, c.client_name,c.client_id,ec.isactive
      FROM employee e
      INNER JOIN employee_client ec ON e.employee_id = ec.employee_id
      INNER JOIN client c ON ec.client_id = c.client_id
      WHERE e.employee_id = $1
    `;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return new NextResponse(JSON.stringify("Employee not found"), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, route: any) {
  const id = Number(route.params.id);

  try {
    // Delete the record from the employee_client table
    const query = `
      DELETE FROM employee_client
      WHERE employee_id = $1
    `;
    const { rowCount } = await pool.query(query, [id]);

    if (rowCount === 0) {
      return new NextResponse(
        JSON.stringify("Employee client relationship not found"),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify("Employee client relationship deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee client relationship:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
