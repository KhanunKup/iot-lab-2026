import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  studentCreateSchema,
  studentIdParamsSchema,
  studentUpdateSchema,
} from "../schemas/students.js";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  studentCodeExists,
  updateStudent,
} from "../services/students.js";

export const studentsController = new Hono();

studentsController.get("/", async (c) => c.json(await getStudents()));

studentsController.get(
  "/:studentId",
  zValidator("param", studentIdParamsSchema),
  async (c) => {
    const { studentId } = c.req.valid("param");
    const student = await getStudentById(studentId);

    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json(student);
  },
);

studentsController.post(
  "/",
  zValidator("json", studentCreateSchema),
  async (c) => {
    const input = c.req.valid("json");

    if (await studentCodeExists(input.studentId)) {
      return c.json({ error: "studentId already exists" }, 409);
    }

    const student = await createStudent(input);
    c.header("Location", `/api/v1/students/${student.id}`);
    return c.json(student, 201);
  },
);

const handleUpdateStudent = [
  zValidator("param", studentIdParamsSchema),
  zValidator("json", studentUpdateSchema),
  async (c: any) => {
    const { studentId } = c.req.valid("param");
    const changes = c.req.valid("json");

    if (
      changes.studentId !== undefined &&
      (await studentCodeExists(changes.studentId, studentId))
    ) {
      return c.json({ error: "studentId already exists" }, 409);
    }

    const student = await updateStudent(studentId, changes);

    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json(student);
  },
] as const;

studentsController.patch("/:studentId", ...handleUpdateStudent);
studentsController.put("/:studentId", ...handleUpdateStudent);

studentsController.delete(
  "/:studentId",
  zValidator("param", studentIdParamsSchema),
  async (c) => {
    const { studentId } = c.req.valid("param");

    if (!(await deleteStudent(studentId))) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.body(null, 204);
  },
);

