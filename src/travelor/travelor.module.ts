import { Module } from '@nestjs/common';
import { TravelorService } from './travelor.service';
import { TravelorController } from './travelor.controller';

@Module({
  controllers: [TravelorController],
  providers: [TravelorService],
})
export class TravelorModule {}
