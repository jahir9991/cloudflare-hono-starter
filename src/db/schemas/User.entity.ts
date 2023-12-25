import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// export const UserD1 = sqliteTable("user", {
//   id: integer("id", { mode: "number" }).primaryKey(),
//   name: text("name").notNull(),
//   createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
// });

export const UserD1 = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique(),
  email: text('email').unique().default(null),
  phoneNumber: text('phoneNumber').unique().default(null),
  password: text('password'),
  role: text('role').notNull().default('USER'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
});
  