import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {


  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(new ValidationPipe());

   app.enableCors({
    origin:true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});

  const config = new DocumentBuilder()
    .setTitle('Books Api Example')
    .setDescription(' Books API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  app.listen(app.get(ConfigService).getInt('APP_PORT'), '0.0.0.0', () => {
    console.log('Listening to port:  ' + app.get(ConfigService).getInt('APP_PORT'));
  });

}
bootstrap();
