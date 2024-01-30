import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TravelorModule } from 'src/travelor/travelor.module';
import { BookingModule } from 'src/booking/booking.module';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [TravelorModule, BookingModule, AnalyticsModule],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
