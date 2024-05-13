import { Client, Pool, QueryResult } from "pg";
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "yourdatabasename",
  password: "bin123",
  port: 5432,
});
