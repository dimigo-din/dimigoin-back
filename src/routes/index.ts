import { AfterschoolModule } from "./afterschool";
import { EventModule } from "./event";
import { FrigoModule } from "./frigo";
import { GroupModule } from "./group";
import { JournalModule } from "./journal";
import { LaundryModule } from "./laundry";
import { LocationModule } from "./location";
import { MealModule } from "./meal";
import { PlaceModule } from "./place";
import { StayModule } from "./stay";
import { TimetableModule } from "./timetable";
import { UserModule } from "./user";

export const StaticModules = [
  UserModule,
  GroupModule,
  LaundryModule,
  FrigoModule,
  EventModule,
  StayModule,
  MealModule,
  TimetableModule,
  JournalModule,
  AfterschoolModule,
  PlaceModule,
  LocationModule,
];
