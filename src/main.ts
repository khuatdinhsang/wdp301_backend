declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerConfig from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // set path api
  app.setGlobalPrefix(`api`);

  // set cors
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['*'],
    credentials: true,
  });

  // config swagger
  swaggerConfig(app);

  //  use global pipes
  app.useGlobalPipes(new ValidationPipe());

  // use cookie
  app.use(cookieParser());

  const PORT = process.env.SERVER_PORT;
  const HOST = process.env.SERVER_HOST;

  await app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
