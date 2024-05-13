import { pool } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, route: any) {
  const id = Number(route.params.id);

  try {
    const query = `
      SELECT e.*, c.client_name,c.client_id
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
export async function PUT(req: NextRequest) {
  try {
    const employeeId = req.nextUrl.searchParams.get("employeeId");
    const clientId = req.nextUrl.searchParams.get("clientId");
    const { remove_date } = await req.json();

    // Validate inputs (e.g., ensure employeeId and clientId are valid)
    if (!employeeId || !clientId) {
      return NextResponse.json(
        { error: "Invalid employeeId or clientId provided" },
        { status: 400 }
      );
    }

    // Check if remove_date is provided and validate its format (if necessary)

    let query;
    let values;

    if (remove_date) {
      // If remove_date is provided, update the remove_date for the specified employee-client relationship
      query = `
        UPDATE employee_client
        SET remove_date = $1
        WHERE employee_id = $2 AND client_id = $3;
      `;
      values = [remove_date, employeeId, clientId];
    } else {
      // If remove_date is not provided, reset the remove_date for the specified employee-client relationship
      query = `
        UPDATE employee_client
        SET remove_date = NULL
        WHERE employee_id = $1 AND client_id = $2;
      `;
      values = [employeeId, clientId];
    }

    // Execute the query
    await pool.query(query, values);

    return NextResponse.json(
      { message: "Client updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log detailed error information for debugging purposes
    console.error("Error updating client:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
