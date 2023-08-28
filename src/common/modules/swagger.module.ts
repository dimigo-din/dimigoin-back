import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppService } from "src/app/app.service";

export const DIMISwaggerSetup = async (app: INestApplication) => {
  const cluster = await new AppService().getBackendInfo();
  const config = new DocumentBuilder()
    .setTitle(cluster.name)
    .setDescription(cluster.description)
    .setVersion(cluster.version)
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" },
      "access-token",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);
};
