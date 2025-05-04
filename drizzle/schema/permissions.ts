import {pgTable, text, uuid} from "drizzle-orm/pg-core";

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(), // e.g. "create_course", "edit_user"
  description: text("description"),
});
