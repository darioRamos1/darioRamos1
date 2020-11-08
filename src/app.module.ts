import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { MongooseModule} from '@nestjs/mongoose';
import { AppService } from './app.service';
import { StudentsModule } from './Modules/students.module';
import { TeachersModule } from './Modules/teachers.module';

@Module({
  imports: [StudentsModule,TeachersModule, MongooseModule.forRoot(
    'mongodb+srv://user1:qweuio123789@cluster0.2wx5w.mongodb.net/disDB?retryWrites=true&w=majority'
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
