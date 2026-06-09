import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../../db/schema";

export const db = drizzle("file:./local.db", {
  schema,
});
