
import { pgTable , serial, text, timestamp , uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  username : text("username").notNull().unique(),
  createdAt : timestamp("created_at").defaultNow(),
  updatedAt : timestamp("updated_at").defaultNow(),
});


export type User = typeof users.$inferInsert;

export const usersInfo = pgTable("usersinfo", { 
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow()
});
