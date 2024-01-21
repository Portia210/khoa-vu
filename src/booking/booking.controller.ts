import { Controller, Post } from '@nestjs/common';
import { DATA_SOURCES } from 'src/shared/constants/dataSources';
import { CrawlerCommandService } from 'src/shared/utils/commandService';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('import-hotels')
  async importHotels() {
    const commands = await CrawlerCommandService.fetchJobs(
      DATA_SOURCES.BOOKING,
    );
    await Promise.allSettled(
      commands.map((command) => this.bookingService.importHotels(command)),
    );
  }
}
