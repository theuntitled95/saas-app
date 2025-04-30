import {schema} from "@/drizzle/schema";
import "dotenv/config";
import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres({
  host: process.env.PGHOST!,
  user: process.env.PGUSER!,
  password: process.env.PGPASSWORD!,
  database: process.env.PGDATABASE!,
  ssl: "require",
});

export const db = drizzle(client, {schema});
