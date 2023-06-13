import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { LoggerMiddleware } from '@/common/middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/modules/users/users.module';
import { TasksModule } from '@/modules/tasks/tasks.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { FilesModule } from '@/modules/files/files.module';
import { LeaderboardModule } from '@/modules/leaderboard/leaderboard.module';
import { QuestionsModule } from './questions/questions.module';
import { DiscordModule } from './discord/discord.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    FilesModule,
    LeaderboardModule,
    QuestionsModule,
    DiscordModule,
    SubmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
