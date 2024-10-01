import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';

(async function bootstrap() {
  const { PORT } = process.env;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 6000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(PORT);
})();
