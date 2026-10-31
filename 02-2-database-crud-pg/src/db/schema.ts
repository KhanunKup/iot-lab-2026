import { date, index, integer, pgTable, text } from "drizzle-orm/pg-core";

export const authors = pgTable("authors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
});

export const books = pgTable(
  "books",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    publishedYear: integer("published_year"),
    authorId: integer("author_id")
      .notNull()
      .references(() => authors.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [index("books_author_id_idx").on(table.authorId)],
);

export const students = pgTable("students", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  studentId: text("student_id").notNull().unique(),
  birthDate: date("birth_date", { mode: "string" }).notNull(),
  gender: text("gender", { enum: ["male", "female", "other"] }).notNull(),
});

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
