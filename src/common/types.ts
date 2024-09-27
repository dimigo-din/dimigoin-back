export const GradeValues = [1, 2, 3] as const;
export const ClassValues = [1, 2, 3, 4, 5, 6] as const;
export const GenderValues = ["M", "F"] as const;
export const PositionValues = ["L", "M", "R", "-"] as const; //
export const StatusValues = ["A", "R", "W"] as const; // Approved, Rejected, Waiting
export const AfterschoolTimeValues = [
  "AS1", // 방과후 1타임
  "AS2", // 방과후 2타임
  "NS1", // 야자 1타임
  "NS2", // 야자 2타임
  "WE1", // 주말 1타임
  "WE2", // 주말 2타임
] as const;
export const TypeValues = [0, 1] as const;
export const ScheduleTypeValues = [
  "exam",
  "event",
  "home",
  "stay",
  "vacation",
] as const;

export const LaundryValues = ["washer", "dryer"] as const;

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

export type GradeType = (typeof GradeValues)[number];
export type ClassType = (typeof ClassValues)[number];
export type GenderType = (typeof GenderValues)[number];
export type PositionType = (typeof PositionValues)[number];
export type StatusType = (typeof StatusValues)[number];
export type AfterschooltimeType = (typeof AfterschoolTimeValues)[number];
export type Type = (typeof TypeValues)[number];
export type ScheduleType = (typeof ScheduleTypeValues)[number];
export type SeatType = (typeof SeatValues)[number];
export type RateLimitType = (typeof RateLimitTypeValues)[number];
export type LaundryType = (typeof LaundryValues)[number];
