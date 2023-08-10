import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DIMINotFoundFilter, DIMIUnauthorizedFilter } from './common/filters';
import { setupSwagger } from './common/modules';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet({ contentSecurityPolicy: false }));

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new DIMINotFoundFilter());
  app.useGlobalFilters(new DIMIUnauthorizedFilter());

  await setupSwagger(app);

  const port = parseInt(process.env.WEB_PORT) || 3000;
  await app.listen(port);
}

bootstrap();
