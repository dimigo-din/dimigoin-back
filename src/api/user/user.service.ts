import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateStudentDto } from 'src/common/dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Student, StudentDocument } from 'src/common/schemas/student.schema';
import { Teacher, TeacherDocument } from 'src/common/schemas/teacher.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,
    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,
  ) {}

  async getUserByObjectId(
    id: string,
  ): Promise<StudentDocument | TeacherDocument> {
    const student = await this.studentModel.findOne({ _id: id }).lean();
    if (student) return student;

    const teacher = await this.teacherModel.findOne({ _id: id }).lean();
    if (teacher) return teacher;

    throw new HttpException('해당 계정이 없습니다.', 404);
  }

  async getAllStudent(): Promise<Student[]> {
    const students = await this.studentModel.find();
    return students;
  }

  async getStudent(_id: string): Promise<Student> {
    if (!Types.ObjectId.isValid(_id))
      throw new HttpException('ObjectId 형식이 아닙니다.', 404);

    const student = await this.studentModel.findById(_id);
    if (!student) throw new HttpException('학생이 존재하지 않습니다.', 404);

    return student;
  }

  async getAllTeacher(): Promise<Teacher[]> {
    const teachers = await this.teacherModel.find();
    return teachers;
  }

  async createStudent(data: CreateStudentDto): Promise<Student> {
    const existingUser = await this.studentModel.findOne({
      id: data.id,
    });

    if (existingUser) throw new HttpException('아이디가 중복됩니다.', 404);

    const salt = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await bcrypt.hash(data.password + salt, 10);
    delete data['password'];

    const student = new this.studentModel({
      ...data,
      password_hash: hashedPassword,
      password_salt: salt,
    });

    await student.save();

    return student;
  }
}
