import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { AppModule } from './app.module';
import { SentryFilter } from './auth/filters/sentry.filter';
import { ZodFilter } from './auth/filters/zod.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

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

  app.useGlobalFilters(new SentryFilter(httpAdapter));

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });


  await app.listen(process.env.PORT || 3003);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
