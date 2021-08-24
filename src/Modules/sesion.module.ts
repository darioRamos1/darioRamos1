import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose'

import { SesionsController } from "src/Controllers/sesion.controller";
import { ActivityResultSchema } from "src/Models/activityResult.model";
import { AreaResultSchema } from "src/Models/areaResult.model";
import { ClassgroupSchema } from "src/Models/classgroup.model";
import { GeneralAreaSchema } from "src/Models/generalArea.model";
import { SesionSchema } from "src/Models/sesion.model";
import { StudentSchema } from "src/Models/student.model";
import { ActivityResultService } from "src/Services/activityResult.service";
import { AreaResultService } from "src/Services/areaResult.service";
import { ClassgroupService } from "src/Services/classgroup.service";
import { GeneralAreaService } from "src/Services/generalArea.service";
import { SesionService } from "src/Services/sesion.service";
import { StudentService } from "src/Services/student.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Sesion', schema: SesionSchema }]),
        MongooseModule.forFeature([{ name: 'AreaResult', schema: AreaResultSchema }]),
        MongooseModule.forFeature([{ name: 'ActivityResult', schema: ActivityResultSchema }]),
        MongooseModule.forFeature([{ name: 'GeneralArea', schema: GeneralAreaSchema }]),
        MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
        MongooseModule.forFeature([{ name: 'Classgroup', schema: ClassgroupSchema }]),
    ],
    controllers: [SesionsController],
    providers: [
        SesionService, 
        AreaResultService, 
        ActivityResultService,
        GeneralAreaService, 
        StudentService,
        ClassgroupService]
})
export class SesionsModule { }