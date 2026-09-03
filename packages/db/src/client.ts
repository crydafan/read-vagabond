import "dotenv/config";

import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzleD1, type AnyD1Database } from "drizzle-orm/d1";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import * as schema from "./schema";

export type Schema = typeof schema;
export type Database = BaseSQLiteDatabase<"async", unknown, Schema>;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzleLibsql(databaseUrl, {
  schema,
});

export const createDb = (binding: AnyD1Database) =>
  drizzleD1(binding, { schema });

export type Db = ReturnType<typeof createDb>;
