/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Document APIs')
        .setDescription('Test API description')
        .setVersion('1.0.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs/api', app, document);
};

export default swaggerConfig;
