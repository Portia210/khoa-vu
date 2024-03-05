import { Body, Controller, Param, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";
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
  constructor(
    private readonly sessionService: SessionService,
    private readonly bookingService: BookingService,
    private readonly travelorService: TravelorService
  ) {}

  @Post("/")
  async createSession(
    @Res({ passthrough: true }) res: Response,
    @Query("force") force = false,
    @Body(new ZodPipe(SessionInputZSchema)) payload: SessionInputDto
  ) {
    const sessionInput = SessionInputZSchema.parse(payload);
    let id = await this.sessionService.checkIfSessionExist(sessionInput);

    const createSession = async () => {
      const { _id, bookingCommand, travelorCommand } =
        await this.sessionService.createSession(sessionInput);
      this.bookingService.importHotels(bookingCommand);
      this.travelorService.importHotels(travelorCommand);
      id = _id;
    };
    if (!id) {
      console.log("Creating new session");
      await createSession();
    } else if (String(force) === "true") {
      console.log("Force creating new session");
      await createSession();
    } else {
      res.set("x-session-existed", "true");
      console.log("Session existed returning...", id);
    }

    return id;
  }

  @Post("/compare/:id")
  compareHotels(
    @Param("id") id: string
  ) {
    return this.sessionService.getSessionResult(id);
  }

  @Post("/travelor-results/:id")
  getFullTravelorResult(
    @Param("id") id: string
  ) {
    return this.sessionService.getFullTravelorResult(id);
  }
}
