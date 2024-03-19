import { Controller, Logger, Param, Post } from "@nestjs/common";
import { SessionServiceV2 } from "./session.service";

@Controller({
  path: "session",
  version: "2",
})
export class SessionControllerV2 {
  private readonly logger = new Logger(SessionControllerV2.name);

  constructor(
    private readonly sessionServiceV2: SessionServiceV2
  ) {}

  @Post("/compare/:id")
  compareHotels(@Param("id") id: string) {
    this.logger.log(`Comparing hotels for session ${id}`);
    return this.sessionServiceV2.getSessionResult(id);
  }
}
