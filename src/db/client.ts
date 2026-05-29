import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const db = drizzle("file:./local.db", {
  schema,
});
