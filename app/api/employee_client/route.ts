import { pool } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { rows } = await pool.query(`SELECT
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
    INNER JOIN client c ON ec.client_id = c.client_id`);
    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { employee_id, client_ids } = await req.json();
  // Initialize an array to store the inserted rows
  const modifiedRows = [];

  const existingClientIdsResult = await pool.query(
    "SELECT client_id FROM employee_client WHERE employee_id = $1",
    [employee_id]
  );

  // Extract client IDs from the query result and convert them to integers
  const existingClientIds = existingClientIdsResult.rows.map((row) =>
    parseInt(row.client_id)
  );

  for (const client_id of client_ids) {
    if (existingClientIds.includes(client_id)) {
      continue;
    } else {
      const { rows } = await pool.query(
        "INSERT INTO employee_client (employee_id, client_id, client_added_date, removed_date, isactive) VALUES ($1, $2, NOW(), null, true) RETURNING *",
        [employee_id, client_id]
      );
      modifiedRows.push(rows[0]);
    }
  }
  for (const c of existingClientIds) {
    if (client_ids.includes(c)) {
      continue;
    } else {
      const { rows } = await pool.query(
        "UPDATE employee_client SET removed_date = NOW(), isactive= false WHERE employee_id = $1 AND client_id = $2 RETURNING *",
        [employee_id, c]
      );
      modifiedRows.push(rows[0]);
    }
  }

  // Return the inserted rows
  return NextResponse.json(modifiedRows, { status: 201 });
}
