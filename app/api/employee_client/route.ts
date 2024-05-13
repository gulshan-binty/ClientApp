import { pool } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { rows } = await pool.query(`SELECT e.*, c.client_name,c.client_id
      FROM employee e
      INNER JOIN employee_client ec ON e.employee_id = ec.employee_id
      INNER JOIN client c ON ec.client_id = c.client_id`);
    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { employee_id, client_id } = await req.json();
    const values = [employee_id, client_id];
    // const;
    // const oldList = await pool.query(
    //   "SELECT client_id FROM employee_client WHERE employee_id=$1",
    //   [employee_id]
    // );
    // console.log(oldList);
    // const newid = await pool.query(
    //   "SELECT new.client_id FROM employee_client AS new LEFT JOIN employee_client AS old ON new.client_id = old.client_id WHERE new.employee_id = $1 AND old.employee_id <> $1 AND old.client_id IS NULL;",
    //   [employee_id]
    // );
    // console.log(newid);
    const { rows } = await pool.query(
      "INSERT INTO employee_client (employee_id, client_id) VALUES ($1, $2) RETURNING *",
      values
    );
    return NextResponse.json(JSON.stringify(rows[0]), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
