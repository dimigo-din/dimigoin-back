export const GradeValues = [1, 2, 3] as const;
export type Grade = (typeof GradeValues)[number];

export const ClassValues = [1, 2, 3, 4, 5, 6] as const;
export type Class = (typeof ClassValues)[number];

export const GenderValues = ['M', 'F'] as const;

export interface refreshTokenVerified {
  refreshToken: string;
  userId: string;
}
