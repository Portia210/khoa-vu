import { Controller, Post } from '@nestjs/common';
import { DATA_SOURCES } from 'src/shared/constants/dataSources';
import { CrawlerCommandService } from 'src/shared/utils/commandService';
import { TravelorService } from './travelor.service';

@Controller('travelor')
export class TravelorController {
  constructor(private readonly travelorService: TravelorService) {}

  @Post('import-hotels')
  async importHotels() {
    const commands = await CrawlerCommandService.fetchJobs(
      DATA_SOURCES.TRAVELOR,
    );
    await Promise.allSettled(
      commands.map((command) => this.travelorService.importHotels(command)),
    );
  }
}
