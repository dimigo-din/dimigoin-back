import { Injectable, Inject, forwardRef } from "@nestjs/common";

import { FrigoManageService } from "src/routes/frigo/providers";
import { LaundryManageService } from "src/routes/laundry/providers";
import { StayManageService } from "src/routes/stay/providers";

import {
  StudentDocument,
  StayApplicationDocument,
  StayOutgoDocument,
  FrigoApplicationDocument,
  LaundryTimetableSequence,
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
    laundry: LaundryTimetableSequence[] | null;
    frigo: FrigoApplicationDocument | null;
    stay: StayApplicationDocument | null;
    stayOutgos: StayOutgoDocument[] | null;
  }> {
    const currentStay = await this.stayManageService
      .getCurrentStay()
      .catch(() => null);

    const stayApplication = currentStay
      ? await this.stayManageService.getStudentStayApplication(
          student._id,
          currentStay._id,
        )
      : null;

    const stayOutgoApplication = stayApplication
      ? await this.stayManageService.getStudentStayOutgos(
          student._id,
          currentStay._id,
        )
      : null;

    const currentFrigo = await this.frigoManageService
      .getCurrentFrigo()
      .catch(() => null);

    const frigoApplication = currentFrigo
      ? await this.frigoManageService.getStudentFrigoApplication(
          student._id,
          currentFrigo._id,
        )
      : null;

    const laundryApplication =
      await this.laundryManageService.getStudentLaundryApplication(student._id);

    return {
      stay: stayApplication,
      stayOutgos: stayOutgoApplication,
      frigo: frigoApplication,
      laundry: laundryApplication ? laundryApplication : null,
    };
  }
}
