import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model } from "mongoose";

import { ResponseDto } from "src/common/dto";
import { StayService } from "src/routes/stay/providers";

import {
  Location,
  LocationDocument,
  Place,
  PlaceDocument,
  StudentDocument,
} from "src/schemas";

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Place.name)
    private placeModel: Model<PlaceDocument>,

    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,

    private stayService: StayService,
  ) {}

  async getAllLocation(): Promise<LocationDocument[]> {
    const locations = await this.locationModel.find();

    return locations;
  }

  async getLocationByGC(
    _grade: number,
    _class: number,
  ): Promise<LocationDocument[]> {
    const locations = await this.locationModel.find({
      grade: _grade,
      class: _class,
    });

    return locations;
  }

  async changeLocation(
    user: StudentDocument,
    placeId: string,
  ): Promise<LocationDocument> {
    const place = await this.placeModel.findById(placeId);
    if (!place) throw new HttpException("해당 장소가 존재하지 않습니다.", 404);

    const isStay = await this.stayService.isStay();
    if (isStay) {
      const stay = await this.stayService.getCurrent();
      const appliers = await this.stayService.getStayApplication(stay._id);

      const isStayApplier = appliers.some((v) => v.user === user._id);

      if (!isStayApplier)
        throw new HttpException("잔류 신청자가 아닙니다.", 404);
    }

    await this.locationModel.findOneAndDelete({ user: user._id });

    const location = new this.locationModel({
      user: user._id,
      grade: user.grade,
      class: user.class,
      name: user.name,
      placeName: place.name,
      place: place._id,
    });

    await location.save();

    return location;
  }

  async resetLocation(user: StudentDocument): Promise<ResponseDto> {
    await this.locationModel.findOneAndDelete({ user: user._id });

    return { statusCode: 200, message: "success" };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetAllLocation() {
    await this.locationModel.deleteMany();
  }
}
