import { Body, Controller, Post } from "@nestjs/common";
import { DATA_SOURCES } from "src/shared/constants/dataSources";
import { CrawlerCommandService } from "src/shared/utils/commandService";
import { BookingService } from "./booking.service";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post("import-hotels")
  async importHotels(@Body() command: CrawlerCommand) {
    this.bookingService.importHotels(command);
  }
}
