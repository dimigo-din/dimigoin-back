import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import expressBasicAuth from "express-basic-auth";

import { AppService } from "src/app/app.service";

export class DIMISwaggerModule {
  private readonly app: INestApplication;
  private readonly configService: ConfigService;

  constructor(app: INestApplication) {
    this.app = app;
    this.configService = app.get<ConfigService>(ConfigService);
  }

  async setup() {
    const clusterInfo = await new AppService().getBackendInfo();
    const apiPrefix = this.configService.get<string>("SWAGGER_PATH");
    const swaggerUser = this.configService.get<string>("SWAGGER_USER");
    const swaggerPassword = this.configService.get<string>("SWAGGER_PW");

    this.app.use(
      `${apiPrefix}*`,
      expressBasicAuth({
        challenge: true,
        users: { [swaggerUser]: swaggerPassword },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle(clusterInfo.name)
      .setDescription(clusterInfo.description)
      .setVersion(clusterInfo.version)
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          in: "header",
        },
        "access-token",
      )
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    const options = {
      explorer: false,
      customSiteTitle: clusterInfo.name,
    };
    SwaggerModule.setup(apiPrefix, this.app, document, options);
  }
}
