import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookingModule } from "./booking/booking.module";
import { TravelorModule } from "./travelor/travelor.module";
import { ConfigModule } from "@nestjs/config";
import { ProxyModule } from "./proxy/proxy.module";
import { SessionModule } from "./session/session.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CrawlerJobModule } from "./session/crawler.job.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local", ".env.test"],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    BookingModule,
    TravelorModule,
    ProxyModule,
    SessionModule,
    AnalyticsModule,
    CrawlerJobModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
