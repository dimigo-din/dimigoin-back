import { StudentDocument, TeacherDocument } from '../common/models';

declare module 'express' {
  interface Request {
    user?: StudentDocument | TeacherDocument;
  }
}
