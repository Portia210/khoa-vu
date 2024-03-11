import { Body, Controller, Post } from "@nestjs/common";
import { CrawlerCommand } from "src/shared/types/CrawlerCommand";
import { TravelorService } from "./travelor.service";

/**
 * @deprecated This controller is not used anymore
 */
@Controller("travelor")
export class TravelorController {
  constructor(private readonly travelorService: TravelorService) {}

  /**
   * @deprecated This controller is not used anymore
   */
  @Post("import-hotels")
  async importHotels(@Body() command: CrawlerCommand) {
    this.travelorService.importHotels(command);
  }
}
