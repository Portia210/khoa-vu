import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { TravelorController } from './travelor.controller';
import { TravelorService } from './travelor.service';

@Module({
  imports: [ProxyModule],
  controllers: [TravelorController],
  providers: [TravelorService],
})
export class TravelorModule {}
