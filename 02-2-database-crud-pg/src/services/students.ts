import { and, eq, ne } from "drizzle-orm";
import db from "../db/index.js";
import { students, type NewStudent, type Student } from "../db/schema.js";

export type StudentInput = Omit<NewStudent, "id">;
export type StudentChanges = Partial<StudentInput>;

export async function getStudents(): Promise<Student[]> {
  return db.select().from(students);
}

export async function getStudentById(id: number): Promise<Student | undefined> {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return student;
}

export async function studentCodeExists(
  studentId: string,
  excludeId?: number,
): Promise<boolean> {
  const condition =
    excludeId !== undefined
      ? and(eq(students.studentId, studentId), ne(students.id, excludeId))
      : eq(students.studentId, studentId);

  const [existing] = await db
    .select({ id: students.id })
    .from(students)
    .where(condition)
    .limit(1);

  return existing !== undefined;
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const [student] = await db.insert(students).values(input).returning();

  if (!student) {
    throw new Error("Created student was not returned");
  }

  return student;
}

export async function updateStudent(
  id: number,
  changes: StudentChanges,
): Promise<Student | undefined> {
  const [student] = await db
    .update(students)
    .set(changes)
    .where(eq(students.id, id))
    .returning();
  return student;
}

export async function deleteStudent(id: number): Promise<boolean> {
  const [deleted] = await db
    .delete(students)
    .where(eq(students.id, id))
    .returning({ id: students.id });
  return deleted !== undefined;
}

