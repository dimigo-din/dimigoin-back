import { StudentDocument, TeacherDocument } from '../common/schemas';

declare module 'express' {
  interface Request {
    user?: StudentDocument | TeacherDocument;
  }
}
