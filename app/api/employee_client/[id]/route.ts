import { pool } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, route: any) {
  const id = Number(route.params.id);

  try {
    const query = `
     SELECT
    ec.id,
    ec.employee_id,
    ec.client_id,
    ec.client_added_date,
    ec.removed_date,
    ec.isActive,
    e.employee_name,
    e.employee_phone,
    e.employee_designation,
    e.employee_email,
    c.client_name,
    c.client_email,
    c.client_phone
FROM
    employee_client ec
    INNER JOIN employee e ON ec.employee_id = e.employee_id
    INNER JOIN client c ON ec.client_id = c.client_id
WHERE
    ec.employee_id =$1;
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
