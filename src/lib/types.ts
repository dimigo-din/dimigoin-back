export const GradeValues = [1, 2, 3] as const;
export const ClassValues = [1, 2, 3, 4, 5, 6] as const;
export const GenderValues = ["M", "F"] as const; // 남자, 여자
export const PositionValues = ["L", "M", "R", "-"] as const; // Left, Right, Middle
export const StatusValues = ["A", "R", "W"] as const; // Approved, Rejected, Waiting
export const AfterschoolTimeValues = [
  "AS1", // 방과후 1타임
  "AS2", // 방과후 2타임
  "NS1", // 야자 1타임
  "NS2", // 야자 2타임
  "WE1", // 주말 1타임
  "WE2", // 주말 2타임
] as const;

export const ScheduleTypeValues = [
  // 밴드 iCal 기준
  "exam", // 각종시험
  "event", // 각종행사
  "home", // 전체귀가
  "stay", // 전체잔류
  "vacation", // 방학
] as const;

export const LaundryValues = ["washer", "dryer"] as const; // washer는 세탁기, dryer는 건조기

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

export const CurfewValues = ["RIGHT_NOW", "AS1", "AS2", "DINNER", "NS1", "NS2"]; // 종례 후, 방과후 1타임, 방과후 2타임, 저녁시간, 야자 1타임, 야자 2타임

export type GradeType = (typeof GradeValues)[number];
export type ClassType = (typeof ClassValues)[number];
export type GenderType = (typeof GenderValues)[number];
export type PositionType = (typeof PositionValues)[number];
export type StatusType = (typeof StatusValues)[number];
export type AfterschooltimeType = (typeof AfterschoolTimeValues)[number];
export type ScheduleType = (typeof ScheduleTypeValues)[number];
export type SeatType = (typeof SeatValues)[number];
export type RateLimitType = (typeof RateLimitTypeValues)[number];
export type LaundryType = (typeof LaundryValues)[number];
export type CurfewType = (typeof CurfewValues)[number];
