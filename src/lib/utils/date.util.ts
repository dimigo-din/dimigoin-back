import moment from "moment";

export const stringDateToMoment = (value: string): moment.Moment => {
  return moment(value, "YYYY-MM-DD", true);
};

export const stringDateTimeToMoment = (value: string): moment.Moment => {
  return moment(value, "YYYY-MM-DD HH:mm:ss", true);
};

export const momentToStringDate = (value: moment.Moment): string => {
  return value.format("YYYY-MM-DD");
};

export const momentToStringDateTime = (value: moment.Moment): string => {
  return value.format("YYYY-MM-DD HH:mm:ss");
};
