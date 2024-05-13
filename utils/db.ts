import { Client, Pool, QueryResult } from "pg";
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "yourdatabasename",
  password: "123456",
  port: 5432,
});
