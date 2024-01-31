import { Body, Controller, Post } from "@nestjs/common";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import { BookingService } from "./booking.service";

/**
 * @deprecated This controller is not used anymore
 */
@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post("import-hotels")
  async importHotels(@Body() command: CrawlerCommand) {
    this.bookingService.importHotels(command);
  }
}
