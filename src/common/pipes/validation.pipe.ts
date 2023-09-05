import { ValidationPipe } from "@nestjs/common";

import { globalOpcode } from "../opcode";

export const DIMIValidationPipe = () => {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (details) => globalOpcode.ValidateFailed({ details }),
  });
};
