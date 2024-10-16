import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from "@nestjs/common";

import { globalOpcode } from "../opcode";

@Catch(NotFoundException)
export class DIMINotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const body = globalOpcode.NotFound().getResponse();
    host.switchToHttp().getResponse().status(404).json(body);
  }
}
