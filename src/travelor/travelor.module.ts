import { Module } from "@nestjs/common";
import { ProxyModule } from "src/proxy/proxy.module";
import { TravelorController } from "./travelor.controller";
import { TravelorService } from "./travelor.service";
import { TravelorCrawlerService } from "./travelor.crawler.service";

@Module({
  imports: [ProxyModule],
  controllers: [TravelorController],
  providers: [TravelorService, TravelorCrawlerService],
  exports: [TravelorCrawlerService],
})
export class TravelorModule {}
