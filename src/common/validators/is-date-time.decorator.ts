import { registerDecorator, ValidationOptions } from "class-validator";
import moment from "moment";

export function IsCustomDateTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isCustomDateTime",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return moment(value, "YYYY-MM-DD HH:mm:ss", true).isValid();
        },
        defaultMessage() {
          return "Invalid date time format for YYYY-MM-DD HH:mm:ss";
        },
      },
    });
  };
}
