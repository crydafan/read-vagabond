import { drizzle, type AnyD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export const createDb = (binding: AnyD1Database) =>
  drizzle(binding, { schema });

export type Db = ReturnType<typeof createDb>;
