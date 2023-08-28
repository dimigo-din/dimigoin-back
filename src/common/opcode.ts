import { HttpException, HttpStatus } from "@nestjs/common";

export type OpcodeNames =
  | "Success"
  | "InvalidError"
  | "NoPermission"
  | "ValidateFailed"
  | "NotFound";

export type OpcodeItem = (details?: { [key: string]: any }) => HttpException;
export const globalOpcode: { [key in OpcodeNames]: OpcodeItem } = {
  Success: $(0, HttpStatus.OK, "요청에 성공하였습니다."),
  InvalidError: $(
    -999,
    HttpStatus.INTERNAL_SERVER_ERROR,
    "알 수 없는 내부 오류가 발생하였습니다.",
  ),
  NoPermission: $(
    -401,
    HttpStatus.UNAUTHORIZED,
    "인증되지 않았습니다. JWT 토큰을 넣어주세요.",
  ),
  ValidateFailed: $(
    -1,
    HttpStatus.BAD_REQUEST,
    "잘못된 형식입니다. 모든 정보를 올바르게 입력해주세요.",
  ),
  NotFound: $(
    -404,
    HttpStatus.NOT_FOUND,
    "잘못된 요청입니다. 해당 Route가 존재하는지 다시 한번 확인해주세요.",
  ),
};

export function $(
  opcode: number,
  statusCode: number,
  message?: string,
): OpcodeItem {
  return (details: { [key: string]: any } = {}) =>
    new HttpException({ opcode, message, ...details }, statusCode);
}
