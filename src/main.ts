declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerConfig from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
// import * as formData from 'express-form-data';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // set path api
  app.setGlobalPrefix(`api`);

  // set cors
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['*'],
    credentials: true,
  });
  // app.use(formData.parse());
  // config swagger
  swaggerConfig(app);

  //  use global pipes
  app.useGlobalPipes(new ValidationPipe());
  // use cookie
  app.use(cookieParser());
  // read img public
  app.useStaticAssets(path.join(__dirname, '../uploads'));

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
