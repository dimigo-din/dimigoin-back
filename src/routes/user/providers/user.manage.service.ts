import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, ObjectId } from "mongoose";
import XLSX from "xlsx";

import { Permissions } from "src/common/types";

import {
  Student,
  StudentDocument,
  Teacher,
  TeacherDocument,
  Group,
  GroupDocument,
} from "src/schemas";

@Injectable()
export class UserManageService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,

    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,

    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
  ) {}

  async getUserByObjectId(
    id: ObjectId,
  ): Promise<StudentDocument | TeacherDocument> {
    const student = await this.studentModel.findOne({ _id: id }).lean();
    if (student) return student;

    const teacher = await this.teacherModel.findOne({ _id: id }).lean();
    if (teacher) return teacher;

    throw new HttpException("해당 계정이 없습니다.", 404);
  }

  async getUserByEmail(
    email: string,
  ): Promise<StudentDocument | TeacherDocument> {
    const student = await this.studentModel.findOne({ email: email }).lean();
    if (student) return student;

    const teacher = await this.teacherModel.findOne({ email: email }).lean();
    if (teacher) return teacher;

    throw new HttpException("해당 계정이 없습니다.", 404);
  }

  async getStudents(): Promise<StudentDocument[]> {
    const students = await this.studentModel
      .find()
      .sort({ grade: 1, class: 1, number: 1 });

    return students;
  }

  async getStudent(studentId: Types.ObjectId): Promise<StudentDocument> {
    const student = await this.studentModel.findById(studentId);
    if (!student)
      throw new HttpException("해당 학생이 존재하지 않습니다.", 404);

    return student;
  }

  async getTeachers(): Promise<Teacher[]> {
    const teachers = await this.teacherModel.find();

    return teachers;
  }

  async uploadStudent(file: Express.Multer.File): Promise<Student[]> {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetData = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    );

    const students = [];
    for (const student of sheetData) {
      const existingStudent = await this.studentModel.findOne({
        email: student["이메일 주소"],
      });
      if (existingStudent) continue;

      students.push({
        name: student["이름"],
        email: student["이메일 주소"],
        grade: parseInt(student["학년"].replace(/\D/g, "")),
        class: parseInt(student["반"].replace(/\D/g, "")),
        number: student["번호"],
        gender: student["성별"] === "남자" ? "M" : "F",
        permissions: [],
        groups: [],
      });
    }

    await this.studentModel.insertMany(students);
    return students;
  }

  async getTeacher(teacherId: Types.ObjectId): Promise<TeacherDocument> {
    const teacher = await this.teacherModel.findById(teacherId);
    if (!teacher)
      throw new HttpException("해당 선생님이 존재하지 않습니다.", 404);

    return teacher;
  }

  async uploadTeacher(file: Express.Multer.File): Promise<Teacher[]> {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetData = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    );

    const teachers = [];
    for (const teacher of sheetData) {
      const existingTeacher = await this.teacherModel.findOne({
        email: teacher["이메일 주소"],
      });
      if (existingTeacher) continue;

      teachers.push({
        name: teacher["이름"],
        email: teacher["이메일 주소"],
        gender: teacher["성별"] === "남자" ? "M" : "F",
        permissions: [],
        groups: [],
      });
    }

    await this.teacherModel.insertMany(teachers);
    return teachers;
  }

  async getGroupPermissions(groupId: Types.ObjectId): Promise<string[]> {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new HttpException("해당 그룹이 존재하지 않습니다.", 404);

    return group.permissions;
  }
}
