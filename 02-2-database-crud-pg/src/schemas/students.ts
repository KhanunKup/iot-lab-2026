import { z } from "zod";
import { positiveIdSchema } from "./common.js";

export const studentIdParamsSchema = z.strictObject({
  studentId: positiveIdSchema,
});

export const studentCreateSchema = z.strictObject({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  studentId: z.string().trim().min(1).max(50),
  birthDate: z.iso.date("birthDate must be a valid YYYY-MM-DD date"),
  gender: z.enum(["male", "female", "other"]),
});

export const studentUpdateSchema = studentCreateSchema.partial().refine(
  (student) => Object.keys(student).length > 0,
  { message: "At least one student field is required" },
);

