import { NextResponse } from "next/server";

import { hash } from "bcrypt";
import { pool } from "@/utils/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const hashedpassword = await hash(password, 10);

    const rows = await pool.query(
      "INSERT INTO users (email,password) VALUES ($1, $2) RETURNING *",
      [email, hashedpassword]
    );
  } catch (error) {
    console.log({ error });
  }
  return NextResponse.json({ message: "success" });
}
