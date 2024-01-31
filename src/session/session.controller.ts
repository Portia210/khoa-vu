import { Body, Controller, Param, Post } from "@nestjs/common";
import { BookingService } from "src/booking/booking.service";
import {
  SessionInputDto,
  SessionInputZSchema,
} from "src/shared/types/SessionInput.dto";
import { TravelorService } from "src/travelor/travelor.service";
import { SessionService } from "./session.service";
import { ZodPipe } from "src/auth/pipe/zod.pipe";

@Controller({
  path: "session",
  version: "1",
})
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly bookingService: BookingService,
    private readonly travelorService: TravelorService
  ) {}

  @Post("/")
  async createSession(@Body(new ZodPipe(SessionInputZSchema)) payload: SessionInputDto) {
    const sessionInput = SessionInputZSchema.parse(payload);
    let id = await this.sessionService.checkIfSessionExist(sessionInput);
    if (!id) {
      console.log("Creating new session");
      const { _id, bookingCommand, travelorCommand } =
        await this.sessionService.createSession(sessionInput);
      await Promise.all([
        this.bookingService.importHotels(bookingCommand),
        this.travelorService.importHotels(travelorCommand),
      ]);
      id = _id;
    } else {
      console.log("Session existed returning...", id);
    }
    return id;
  }

  @Post("/compare/:id")
  async compareHotels(@Param("id") id: string) {
    return await this.sessionService.getSessionResult(id);
  }
}
