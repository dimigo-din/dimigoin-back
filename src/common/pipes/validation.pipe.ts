import { ValidationPipe } from '@nestjs/common';

export const DIMIValidationPipe = () => {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      groups: ['flag:request'],
    },
  });
};
