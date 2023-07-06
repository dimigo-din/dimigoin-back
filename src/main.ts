import {
  Logger,
  NestFactory,
  setupNestjsTools,
} from '@danieluhm2004/nestjs-tools';

import { AppModule } from './app.module';
import { Opcode } from './common/opcode';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //await setupNestjsTools(app, { swagger: { opcode: Opcode } });
  if (process.env.IS_SCHEDULER === 'true') {
    Logger.log('스케줄러 모드로 실행되었습니다.');
    await app.init();
    return;
  }

  const port = parseInt(process.env.WEB_PORT) || 3000;
  await app.listen(port);
}

bootstrap();
