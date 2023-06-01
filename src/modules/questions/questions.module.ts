import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../tasks/schemas/task.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { File, FileSchema } from '../files/schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
