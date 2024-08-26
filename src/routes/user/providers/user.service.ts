import { Injectable, Inject, forwardRef } from "@nestjs/common";

import { FrigoManageService } from "src/routes/frigo/providers";
import { LaundryManageService } from "src/routes/laundry/providers";
import { StayManageService } from "src/routes/stay/providers";

import {
  StudentDocument,
  StayDocument,
  StayApplicationDocument,
  StayOutgoDocument,
  FrigoDocument,
  FrigoApplicationDocument,
  LaundryApplicationDocument,
} from "src/schemas";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => StayManageService))
    private stayManageService: StayManageService,

    @Inject(forwardRef(() => FrigoManageService))
    private frigoManageService: FrigoManageService,

    @Inject(forwardRef(() => LaundryManageService))
    private laundryManageService: LaundryManageService,
  ) {}

  async getApplication(student: StudentDocument): Promise<{
    laundry: LaundryApplicationDocument | null;
    frigo: FrigoApplicationDocument | null;
    stay: StayApplicationDocument | null;
    stayOutgos: StayOutgoDocument[] | null;
  }> {
    let currentStayStatus = false;
    let stayApplicationStatus = false;
    let stayOutgosStatus = false;

    let currentStay: StayDocument | null;
    let stayApplication: StayApplicationDocument | null;
    let stayOutgos: StayOutgoDocument[] | null;

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
        stayOutgos = await this.stayManageService.getStudentStayOutgos(
          student._id,
          currentStay._id,
        );
        stayOutgosStatus = true;
      } catch {
        stayOutgosStatus = false;
      }

    let currentFrigoStatus = false;
    let frigoApplicationStatus = false;

    let currentFrigo: FrigoDocument | null;
    let frigoApplication: FrigoApplicationDocument | null;

    try {
      currentFrigo = await this.frigoManageService.getCurrentFrigo();
      currentFrigoStatus = true;
    } catch {
      currentFrigoStatus = false;
    }

    if (currentFrigoStatus)
      try {
        frigoApplication =
          await this.frigoManageService.getStudentFrigoApplication(
            student._id,
            currentFrigo._id,
          );
        frigoApplicationStatus = true;
      } catch {
        frigoApplicationStatus = false;
      }

    const laundry =
      await this.laundryManageService.getStudentLaundryApplication(student._id);

    return {
      stay: stayApplicationStatus ? stayApplication : null,
      stayOutgos: stayOutgosStatus
        ? stayOutgos.length
          ? stayOutgos
          : null
        : null,
      frigo: frigoApplicationStatus ? frigoApplication : null,
      laundry: laundry ? laundry : null,
    };
  }
}
