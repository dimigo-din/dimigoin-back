import { registerDecorator, ValidationOptions } from "class-validator";
import moment from "moment";

export function IsCustomDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isCustomDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return moment(value, "YYYY-MM-DD", true).isValid();
        },
        defaultMessage() {
          return "Invalid date format for YYYY-MM-DD";
        },
      },
    });
  };
}
