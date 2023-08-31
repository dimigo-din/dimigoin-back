export const dateRegex = new RegExp(
  "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$",
);
export const dateRegexMessage = "올바른 날짜 형식이 아닙니다.";

export const dateTimeRegex = new RegExp(
  "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$",
);
export const dateTimeRegexMessage = "올바른 날짜 시간 형식이 아닙니다.";
