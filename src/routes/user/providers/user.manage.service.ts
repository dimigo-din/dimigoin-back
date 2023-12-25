import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import bcrypt from "bcrypt";
import { Model, Types } from "mongoose";
import XLSX from "xlsx";

import {
  Student,
  StudentDocument,
  Teacher,
  TeacherDocument,
  Group,
  GroupDocument,
  StudentPassword,
  StudentPasswordDocument,
  TeacherPassword,
  TeacherPasswordDocument,
} from "src/schemas";

import { CreatePasswordDto, PasswordLoginDto } from "../dto";

@Injectable()
export class UserManageService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,

    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,

    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,

    @InjectModel(StudentPassword.name)
    private studentPasswordModel: Model<StudentPasswordDocument>,

    @InjectModel(TeacherPassword.name)
    private teacherPasswordModel: Model<TeacherPasswordDocument>,
  ) {}

  async createStudentPassword(
    studentId: Types.ObjectId,
    data: CreatePasswordDto,
  ): Promise<StudentPasswordDocument> {
    const student = await this.getStudent(studentId);

    const existingPassword = await this.studentPasswordModel.findOne({
      student: student._id,
    });
    if (existingPassword) {
      throw new HttpException("이미 비밀번호가 존재합니다.", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const studentPassword = new this.studentPasswordModel({
      student: student._id,
      password: hashedPassword,
    });
    await studentPassword.save();

    return studentPassword;
  }

  async createTeacherPassword(
    teacherId: Types.ObjectId,
    data: CreatePasswordDto,
  ): Promise<TeacherPasswordDocument> {
    const teacher = await this.getTeacher(teacherId);

    const existingPassword = await this.teacherPasswordModel.findOne({
      teacher: teacher._id,
    });
    if (existingPassword) {
      throw new HttpException("이미 비밀번호가 존재합니다.", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const teacherPassword = new this.teacherPasswordModel({
      teacher: teacherId,
      password: hashedPassword,
    });
    await teacherPassword.save();

    return teacherPassword;
  }

  async passwordLogin(
    data: PasswordLoginDto,
  ): Promise<StudentDocument | TeacherDocument> {
    const student = await this.studentModel.findOne({
      email: data.id + "@dimigo.hs.kr",
    });
    const teacher = await this.teacherModel.findOne({
      email: data.id + "@dimigo.hs.kr",
    });

    if (student) {
      const studentPassword = await this.studentPasswordModel.findOne({
        student: student._id,
      });
      if (!studentPassword) {
        throw new HttpException("비밀번호가 존재하지 않습니다.", 404);
      }

      const isMatch = await bcrypt.compare(
        data.password,
        studentPassword.password,
      );
      if (!isMatch) {
        throw new HttpException("비밀번호가 일치하지 않습니다.", 403);
      }

      return student;
    }

    if (teacher) {
      const teacherPassword = await this.teacherPasswordModel.findOne({
        teacher: teacher._id,
      });
      if (!teacherPassword) {
        throw new HttpException("비밀번호가 존재하지 않습니다.", 404);
      }

      const isMatch = await bcrypt.compare(
        data.password,
        teacherPassword.password,
      );
      if (!isMatch) {
        throw new HttpException("비밀번호가 일치하지 않습니다.", 403);
      }

      return teacher;
    }

    throw new HttpException("해당 계정이 존재하지 않습니다.", 404);
  }

  async getUserByObjectId(id: Types.ObjectId): Promise<{
    info: StudentDocument | TeacherDocument;
    type: "student" | "teacher";
  }> {
    const student = await this.studentModel
      .findById(id)
      .populate("groups")
      .lean();
    if (student)
      return {
        info: student,
        type: "student",
      };

    const teacher = await this.teacherModel.findById(id).lean();
    if (teacher)
      return {
        info: teacher,
        type: "teacher",
      };

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
