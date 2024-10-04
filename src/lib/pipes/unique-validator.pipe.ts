import { HttpException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class UniqueTypeValidator implements PipeTransform {
  constructor(private readonly allowedValues: readonly any[]) {}
  transform(value: unknown) {
    if (!this.allowedValues.includes(value))
      throw new HttpException(
        `${value}는 올바르지 않은 값입니다. 올바른 값은 ${this.allowedValues} 입니다.`,
        400,
      );

    return value;
  }
}
