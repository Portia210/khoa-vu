import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { ZodFilter } from './auth/filters/zod.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.setGlobalPrefix('api', {
    exclude: ['tokenCallback'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [VERSION_NEUTRAL, '1'],
  });
  
  app.useGlobalFilters(new ZodFilter());
  await app.listen(process.env.PORT || 3003);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
