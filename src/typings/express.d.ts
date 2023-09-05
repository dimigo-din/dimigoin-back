import { StudentDocument, TeacherDocument } from "src/schemas";

declare module "express" {
  interface Request {
    user?: StudentDocument | TeacherDocument;
  }
}
