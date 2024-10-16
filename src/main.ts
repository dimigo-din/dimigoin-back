import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "./app";
import {
  DIMINotFoundFilter,
  DIMISwaggerModule,
  DIMIWrapperInterceptor,
  DIMIValidationPipe,
} from "./lib";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet({ contentSecurityPolicy: false }));

  app.useGlobalPipes(DIMIValidationPipe());
  app.useGlobalFilters(new DIMINotFoundFilter());
  app.useGlobalInterceptors(new DIMIWrapperInterceptor());

  const swagger = new DIMISwaggerModule(app);
  await swagger.setup();

  await app.listen(3000);
}

bootstrap();
