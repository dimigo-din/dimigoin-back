import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { FrigoService } from "src/routes/frigo/providers";
import { LaundryManageService } from "src/routes/laundry/providers";
import { StayManageService } from "src/routes/stay/providers";

import {
  Group,
  GroupDocument,
  Student,
  StudentDocument,
  Teacher,
  TeacherDocument,
  StayDocument,
  StayApplicationDocument,
  StayOutgoDocument,
} from "src/schemas";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,

    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,

    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,

    private stayManageService: StayManageService,
    private frigoService: FrigoService,
  ) {}

  async getApplication(student: StudentDocument): Promise<{
    laundry: any;
    frigo: any;
    stay: StayApplicationDocument | null;
    stayOutgo: StayOutgoDocument[] | null;
  }> {
    const laundry = false;
    const frigo = await this.frigoService.getMyFrigo(student);

    let currentStayStatus = false;
    let stayApplicationStatus = false;
    let stayOutgoStatus = false;

    let currentStay: StayDocument | null;
    let stayApplication: StayApplicationDocument | null;
    let stayOutgo: StayOutgoDocument[] | null;

    try {
      currentStay = await this.stayManageService.getCurrentStay();
      currentStayStatus = true;
    } catch {
      currentStayStatus = false;
    }

    if (currentStayStatus)
      try {
        stayApplication =
          await this.stayManageService.getStudentStayApplication(
            student._id,
            currentStay._id,
          );
        stayApplicationStatus = true;
      } catch {
        stayApplicationStatus = false;
      }

    if (stayApplicationStatus)
      try {
        stayOutgo = await this.stayManageService.getStudetnStayOutgo(
          student._id,
          currentStay._id,
        );
        stayOutgoStatus = true;
      } catch {
        stayOutgoStatus = false;
      }

    return {
      laundry: laundry ? laundry : null,
      frigo: frigo ? frigo : null,
      stay: stayApplicationStatus ? stayApplication : null,
      stayOutgo: stayOutgoStatus ? stayOutgo : null,
    };
  }
}
