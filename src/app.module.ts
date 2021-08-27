import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { StudentsModule } from './Modules/students.module';
import { TeachersModule } from './Modules/teachers.module';
import { ClassgroupsModule } from './Modules/classgroup.module';
import { SesionsModule } from './Modules/sesion.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ActivityResultsModule } from './Modules/activityResult.module';
import { AreaResultsModule } from './Modules/areaResult.module';
import { GeneralAreasModule } from './Modules/generalArea.module';

@Module({
  imports: [
    StudentsModule, 
    TeachersModule, 
    ClassgroupsModule, 
    SesionsModule, 
    ActivityResultsModule, 
    AreaResultsModule,
    GeneralAreasModule,
    PrometheusModule.register(),
    MongooseModule.forRoot(
      'mongodb+srv://user1:qweuio123789@cluster0.2wx5w.mongodb.net/disDB?retryWrites=true&w=majority'
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
