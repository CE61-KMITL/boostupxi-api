import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const node_env = configService.get<string>('node_env');

  const allowedOrigins: string[] = configService
    .get<string>('allowed_origins')
    .split(',');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'"],
        },
      },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: node_env === 'production',
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    exposedHeaders: 'Authorization',
  });

  if (node_env !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('CE BOOSTUP XI Documentation')
      .setDescription('This is the documentation for CE BOOSTUP XI API.')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port);
}
bootstrap();
