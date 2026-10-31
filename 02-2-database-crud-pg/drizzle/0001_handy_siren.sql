CREATE TABLE "students" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "students_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"student_id" text NOT NULL,
	"birth_date" date NOT NULL,
	"gender" text NOT NULL,
	CONSTRAINT "students_student_id_unique" UNIQUE("student_id")
);
