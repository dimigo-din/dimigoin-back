export const GradeValues = [1, 2, 3] as const;

export const ClassValues = [1, 2, 3, 4, 5, 6] as const;

export const GenderValues = ["M", "F"] as const;

export const PositionValues = ["L", "M", "R", "-"] as const;

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

export const StatusValues = ["A", "R", "W"] as const;

export const AfterschoolTimeValues = [
  "AS1",
  "AS2",
  "WE1",
  "WE2",
  "NS1",
  "NS2",
] as const;

export const WasherValues = [
  "F1",
  "F2",
  "F3",
  "M2L",
  "M2M",
  "M2R",
  "M4L",
  "M4R",
  "M5",
] as const;

export interface refreshTokenVerified {
  refreshToken: string;
  userId: string;
}

export interface Permissions {
  view: string[];
  edit: string[];
}

export interface Seats {
  M1: string[];
  M2: string[];
  M3: string[];
  F1: string[];
  F2: string[];
  F3: string[];
}
