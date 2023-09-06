import { Injectable, Inject, forwardRef } from "@nestjs/common";

import { FrigoService } from "src/routes/frigo/providers";
import { LaundryManageService } from "src/routes/laundry/providers";
import { StayManageService } from "src/routes/stay/providers";

import {
  StudentDocument,
  StayDocument,
  StayApplicationDocument,
  StayOutgoDocument,
  LaundryApplicationDocument,
} from "src/schemas";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => LaundryManageService))
    private laundryManageService: LaundryManageService,

    private frigoService: FrigoService,
    private stayManageService: StayManageService,
  ) {}

  async getApplication(student: StudentDocument): Promise<{
    laundry: LaundryApplicationDocument | null;
    frigo: any;
    stay: StayApplicationDocument | null;
    stayOutgo: StayOutgoDocument[] | null;
  }> {
    const laundry =
      await this.laundryManageService.getStudentLaundryApplication(student._id);
    const frigo = false;

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
