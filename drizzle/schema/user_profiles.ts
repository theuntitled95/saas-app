import {date, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {users} from "./users";

export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id),

  firstName: text("first_name"),
  lastName: text("last_name"),
  gender: text("gender"),
  dateOfBirth: date("date_of_birth"),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),

  bio: text("bio"),
  language: text("language"),
  timezone: text("timezone"),

  createdAt: timestamp("created_at", {withTimezone: true}).defaultNow(),
  updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow(),

  createdBy: uuid("created_by").references(() => users.id),
  updatedBy: uuid("updated_by").references(() => users.id),
  deletedAt: timestamp("deleted_at", {withTimezone: true}),
  deletedBy: uuid("deleted_by").references(() => users.id),
});
