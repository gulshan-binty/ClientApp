import { pool } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search")?.toLowerCase();
  const detailId = url.searchParams.get("detailId");

  let query = `
    SELECT
      ec.id,
      ec.employee_id,
      ec.client_id,
      ec.client_added_date,
      ec.removed_date,
      ec.isactive,
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
      INNER JOIN client c ON ec.client_id = c.client_id`;

  // Fetch employees supporting a specific client
  if (detailId && detailId.startsWith("client")) {
    const clientId = detailId.split("_")[1];
    query += ` WHERE ec.client_id = $1`;
    try {
      const { rows } = await pool.query(query, [clientId]);
      return new NextResponse(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

  // Fetch clients supported by a specific employee
  if (detailId && detailId.startsWith("employee")) {
    const employeeId = detailId.split("_")[1];
    query += ` WHERE ec.employee_id = $1`;
    try {
      const { rows } = await pool.query(query, [employeeId]);
      return new NextResponse(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

  // If there's a search query, filter by employee or client name
  if (searchParam) {
    query += ` WHERE LOWER(e.employee_name) LIKE $1 OR LOWER(c.client_name) LIKE $2`;
  }

  try {
    const { rows } = await pool.query(query, [
      `%${searchParam}%`,
      `%${searchParam}%`,
    ]);
    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
