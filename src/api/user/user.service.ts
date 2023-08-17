import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Group,
  GroupDocument,
  Student,
  StudentDocument,
  Teacher,
  TeacherDocument,
} from 'src/common/schemas';
import {
  CreateStudentDto,
  CreateTeacherDto,
  ManageTeacherGroupDto,
  ResponseDto,
} from 'src/common/dto';

import { LaundryService } from '../laundry/laundry.service';
import { StayService } from '../stay/stay.service';
import { FrigoService } from '../frigo/frigo.service';
import { Permissions } from 'src/common/types';
import { AuthService } from '../auth/auth.service';

import XLSX from 'xlsx';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,

    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,

    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    @Inject(forwardRef(() => StayService))
    private stayService: StayService,

    private laundryService: LaundryService,
    private frigoService: FrigoService,

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

  async getStudentById(_id: string): Promise<StudentDocument> {
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

  async getTeacherById(_id: string): Promise<Teacher> {
    if (!Types.ObjectId.isValid(_id))
      throw new HttpException('ObjectId 형식이 아닙니다.', 404);

    const teacher = await this.teacherModel.findById(_id);
    if (!teacher) throw new HttpException('선생님이 존재하지 않습니다.', 404);

    return teacher;
  }

  async createStudent(data: CreateStudentDto): Promise<Student> {
    const { email, hd } = await this.authService.verifyAccessToken(data.token);

    if (hd !== 'dimigo.hs.kr') throw new HttpException('dimigo.hs.kr 이메일을 사용해주세요.', 404);

    const existingStudent = await this.studentModel.findOne({
      email: email,
    });
    if (existingStudent) throw new HttpException('해당 이메일에 해당하는 계정이 이미 존재합니다.', 404)

    delete data['token'];

    const student = new this.studentModel({
      ...data,
      email: email,
      permissions: { view: [], edit: [] },
      groups: [],
    });

    await student.save();
    return student;
  }

  async uploadStudent(file: Express.Multer.File): Promise<ResponseDto> {
    const utf8Data = file.buffer.toString('utf-8');
    const workbook = XLSX.read(utf8Data, { type: 'string' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const students = [];
    for (const student of sheetData) {

      students.push({
        name: student['이름'],
        email: student['사용자 이름'],
        grade: parseInt(student['학년'].replace(/\D/g, "")),
        class: parseInt(student['반'].replace(/\D/g, "")),
        number: student['번호'],
        gender: student['성별'] === '남자' ? 'M' : 'F',
        permissions: { view: [], edit: [] },
        groups: [],
      })
    }

    console.log(students);
    await this.studentModel.insertMany(students);
    return { status: 200, message: 'success' };
  }



  async getMyInformation(user: StudentDocument): Promise<any> {
    let laundry = await this.laundryService.getMyLaundry(user);
    const stay = await this.stayService.getMyStay(user);
    const frigo = await this.frigoService.getMyFrigo(user);
    if (typeof laundry == 'number') laundry++;

    const isStay = await this.stayService.isStay(new Date());
    // replace null with Weekday Outgo ( TBA )
    const stayOutgo = await this.stayService.getMyStayOutgo(user);
    const outgo = isStay ? stayOutgo : null;

    return {
      laundry: laundry ? laundry : null,
      stay: stay ? stay : null,
      frigo: frigo ? frigo : null,
      outgo: outgo ? outgo : null,
    };
  }

  async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
    const { email } = await this.authService.verifyAccessToken(data.token);

    const existingTeacher = await this.teacherModel.findOne({
      email
    });

    if (existingTeacher) throw new HttpException('이메일이 중복됩니다.', 404);

    delete data['token'];

    const teacher = new this.teacherModel({
      ...data,
      email: email,
    });

    await teacher.save();

    return teacher;
  }

  async createTeacherByFile(file: Express.Multer.File): Promise<Teacher[]> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const result = [];
    for (const data of sheetData) {
      const existingTeacher = await this.teacherModel.findOne({ email: data['email'] });
      if (existingTeacher) continue;

      const positions = data['position'].split(',');

      const teacher = new this.teacherModel({
        name: data['name'],
        email: data['email'],
        gender: data['gender'],
        description: data['description'],
        positions: positions,
        groups: [],
        permissions: { view: [], edit: [] }
      })

      result.push(teacher);
    }

    await this.teacherModel.insertMany(result);
    return result;
  }

  async manageTeacherGroup(data: ManageTeacherGroupDto): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(data.teacher);
    if (!teacher)
      throw new HttpException('해당 선생님이 존재하지 않습니다.', 404);

    for (const groupId of data.groups) {
      const group = await this.groupModel.findById(groupId);
      if (!group) throw new HttpException('올바르지 않은 그룹이 포함되어있습니다.', 404);
    }

    teacher.groups = data.groups;

    await teacher.save();
    return teacher;
  }

  async createSuperuser(): Promise<ResponseDto> {
    const email = process.env.INIT_SUPERUSER;
    const existingUser = await this.teacherModel.findOne({ email: email });
    if (existingUser)
      throw new HttpException('SUPERUSER가 이미 존재합니다.', 404);

    const user = new this.teacherModel({
      name: 'SUPERUSER',
      email: email,
      description: 'super user',
      gender: 'M',
      groups: [],
      permissions: { view: ['*'], edit: ['*'] },
      positions: ['A', 'T', 'D'],
    });

    await user.save();

    return { status: 200, message: 'success' };
  }

  async getPermissionByGroup(groups: Types.ObjectId[]): Promise<Permissions> {
    const permission = { view: [], edit: [] };

    for (let i = 0; i < groups.length; i++) {
      const groupPerm = await this.groupModel.findById(groups[i]);
      permission.view.push(...groupPerm.permissions.view);
      permission.edit.push(...groupPerm.permissions.edit);
    }

    return permission;
  }

  async getPermissionByPosition(positions: string[]): Promise<Permissions> {
    const permission = { view: [], edit: [] };
    for (let i = 0; i < positions.length; i++) {
      const positionPerm = await this.groupModel.findOne({
        name: positions[i],
      });
      permission.view.push(...positionPerm.permissions.view);
      permission.edit.push(...positionPerm.permissions.edit);
    }

    return permission;
  }
}
