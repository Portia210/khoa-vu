import { Body, Controller, Post } from "@nestjs/common";
import {
  SessionInputDto,
  SessionInputZSchema,
} from "src/shared/types/SessionInput.dto";
import { SessionService } from "./session.service";

@Controller("session")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post("")
  async createSession(@Body() payload: SessionInputDto) {
    const sessionInput = SessionInputZSchema.parse(payload);
    let id = await this.sessionService.checkIfSessionExist(sessionInput);
    if (!id) {
      console.log("Creating new session");
      const { _id, bookingCommand, travelorCommand } =
        await this.sessionService.createSession(sessionInput);
      // execute(bookingCommand, travelorCommand);
      // id = _id;
    } else {
      console.log("Session existed returning...", id);
    }
  }
}
