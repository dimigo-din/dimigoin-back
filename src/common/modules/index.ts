export * from "./swagger.module";
export * from "./config.module";
export * from "./database.module";
export * from "./jwt.module";

import { DIMIConfigModule } from "./config.module";
import { DIMIDatabaseModule } from "./database.module";
import { DIMIJWTModule } from "./jwt.module";

export const DIMIEssentialModules = [
  DIMIConfigModule,
  DIMIDatabaseModule,
  DIMIJWTModule,
];
