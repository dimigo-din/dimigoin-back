import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePlaceDto, CreatePlaceGroupDto } from "../dto/place.dto";
import {
  Place,
  PlaceDocument,
  PlaceGroup,
  PlaceGroupDocument,
} from "src/schemas";

@Injectable()
export class PlaceService {
  constructor(
    @InjectModel(Place.name)
    private placeModel: Model<PlaceDocument>,

    @InjectModel(PlaceGroup.name)
    private placeGroupModel: Model<PlaceGroupDocument>,
  ) {}

  async getAllPlace(): Promise<any> {
    const placeGroups = await this.placeGroupModel.find();

    // Place
    const result = {};
    for (const group of placeGroups) {
      const places = await this.placeModel.find({ group: group._id });
      result[group.name] = places;
    }

    return result;
  }

  async createPlace(data: CreatePlaceDto): Promise<PlaceDocument> {
    const placeGroup = await this.placeGroupModel.findById(data.group);
    if (!placeGroup)
      throw new HttpException("해당 위치가 존재하지 않습니다.", 404);

    const existingPlace = await this.placeModel.findOne({ name: data.name });
    if (existingPlace)
      throw new HttpException("해당 위치가 이미 존재합니다.", 404);

    const place = new this.placeModel({
      name: data.name,
      group: placeGroup._id,
    });

    await place.save();

    return place;
  }

  // PlaceGroup
  async getPlacesByGroup(groupId: string): Promise<PlaceDocument[]> {
    const placeGroup = await this.placeGroupModel.findById(groupId);

    const places = await this.placeModel.find({ group: placeGroup._id });

    return places;
  }

  async managePlaceGroup(
    groupId: string,
    data: CreatePlaceGroupDto,
  ): Promise<PlaceGroupDocument> {
    const placeGroup = await this.placeGroupModel.findById(groupId);

    placeGroup.name = data.name;

    await placeGroup.save();

    return placeGroup;
  }

  async createPlaceGroup(
    data: CreatePlaceGroupDto,
  ): Promise<PlaceGroupDocument> {
    const existingGroup = await this.placeGroupModel.findOne({
      name: data.name,
    });
    if (existingGroup)
      throw new HttpException("추가하려는 위치가 이미 존재합니다.", 404);

    const group = new this.placeGroupModel({
      name: data.name,
    });

    await group.save();

    return group;
  }
}
