import { Body, Controller, Post } from "@nestjs/common";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import { BookingService } from "./booking.service";

/**
 * @deprecated This controller is not used anymore
 */
@Controller({
  path: "booking",
  version: "1",
})
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * @deprecated This controller is not used anymore
   */
  @Post("import-hotels")
  async importHotels(@Body() command: CrawlerCommand) {
    this.bookingService.importHotels(command);
  }
}
