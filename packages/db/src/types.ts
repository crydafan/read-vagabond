import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import * as schema from "./schema";

export type Schema = typeof schema;
export type Database = BaseSQLiteDatabase<"async", unknown, Schema>;
