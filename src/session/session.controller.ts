import { Body, Controller, Logger, Param, Post, Query } from "@nestjs/common";
import { ZodPipe } from "src/auth/pipe/zod.pipe";
import { BookingService } from "src/booking/booking.service";
import {
  SessionInputDto,
  SessionInputZSchema,
} from "src/shared/types/SessionInput.dto";
import { TravelorService } from "src/travelor/travelor.service";
import { SessionService } from "./session.service";

@Controller({
  path: "session",
  version: "1",
})
export class SessionController {
  private readonly logger = new Logger(SessionController.name);

  constructor(
    private readonly sessionService: SessionService,
    private readonly bookingService: BookingService,
    private readonly travelorService: TravelorService
  ) {}

  @Post("/")
  async createSession(
    @Body(new ZodPipe(SessionInputZSchema)) sessionInput: SessionInputDto,
    @Query("force") force = false
  ) {
    this.logger.log(
      `Creating new session payload ${JSON.stringify(
        sessionInput
      )} force: ${force}`
    );
    let id = await this.sessionService.checkIfSessionExist(sessionInput);
    if (id) this.logger.log("Session existed returning...", id);

    const newSession = async () => {
      const { _id, bookingCommand, travelorCommand } =
        await this.sessionService.createSession(sessionInput);
      this.bookingService.importHotels(bookingCommand);
      this.travelorService.importHotels(travelorCommand);
      id = _id;
    };
    if (!id) {
      this.logger.log("Creating new session");
      await newSession();
    } else if (String(force) === "true") {
      this.logger.log("Force creating new session");
      await newSession();
    } else {
      this.logger.log("Session existed returning...", id);
    }

    return id;
  }

  @Post("/compare/:id")
  compareHotels(@Param("id") id: string) {
    return this.sessionService.getSessionResult(id);
  }

  @Post("/travelor-results/:id")
  getFullTravelorResult(@Param("id") id: string) {
    return this.sessionService.getFullTravelorResult(id);
  }
}
