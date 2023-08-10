import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDto } from 'src/common/dto';
import { Location, LocationDocument, Place, PlaceDocument, StudentDocument } from 'src/common/schemas';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Place.name)
    private placeModel: Model<PlaceDocument>,

    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
  ) {}

  async getAllLocation(): Promise<Location[]> {
    const locations = await this.locationModel.find();

    return locations;
  }

  async getLocationByGC(_grade: number, _class: number): Promise<Location[]> {
    const locations = await this.locationModel.find({ grade: _grade, class: _class });

    return locations;
  }

  async changeLocation(user: StudentDocument, placeId: string): Promise<Location> {
    const place = await this.placeModel.findById(placeId);
    if (!place) throw new HttpException('해당 장소가 존재하지 않습니다.', 404);

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

    return { status: 200, message: 'success' };
  }

}
