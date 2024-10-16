export const GradeValues = [1, 2, 3] as const;
export const ClassValues = [1, 2, 3, 4, 5, 6] as const;
export const GenderValues = ["M", "F"] as const;
export const PositionValues = ["L", "M", "R", "-"] as const;
export const StatusValues = ["A", "R", "W"] as const;
export const AfterschoolTimeValues = [
  "AS1",
  "AS2",
  "NS1",
  "NS2",
  "WE1",
  "WE2",
] as const;
export const TypeValues = [0, 1] as const;
export const ScheduleTypeValues = [
  "exam",
  "event",
  "home",
  "stay",
  "vacation",
] as const;

const SeatNameValues = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
];
export const SeatValues = ["NONE"];
for (let i = 0; i < SeatNameValues.length; i++) {
  for (let j = 0; j < 18; j++) {
    SeatValues.push(SeatNameValues[i] + (j + 1));
  }
}
export const KorWeekDayValues = ["일", "월", "화", "수", "목", "금", "토"];
export const RateLimitTypeValues = ["YoutubeSearch"] as const;

export type Grade = (typeof GradeValues)[number];
export type Class = (typeof ClassValues)[number];
export type Gender = (typeof GenderValues)[number];
export type Position = (typeof PositionValues)[number];
export type Status = (typeof StatusValues)[number];
export type AfterschoolTime = (typeof AfterschoolTimeValues)[number];
export type Type = (typeof TypeValues)[number];
export type ScheduleType = (typeof ScheduleTypeValues)[number];
export type Seat = (typeof SeatValues)[number];
export type RateLimitType = (typeof RateLimitTypeValues)[number];

export type AuthUser = {
  gender: Gender;
  _id: string;
};
