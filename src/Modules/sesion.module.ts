import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose'

import { SesionsController } from "src/Controllers/sesion.controller";
import { ActivityResultSchema } from "src/Models/activityResult.model";
import { AreaResultSchema } from "src/Models/areaResult.model";
import { SesionSchema } from "src/Models/sesion.model";
import { ActivityResultService } from "src/Services/activityResult.service";
import { AreaResultService } from "src/Services/areaResult.service";
import { SesionService } from "src/Services/sesion.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Sesion', schema: SesionSchema }]),
        MongooseModule.forFeature([{ name: 'AreaResult', schema: AreaResultSchema }]),
        MongooseModule.forFeature([{ name: 'ActivityResult', schema: ActivityResultSchema }]),
    ],
    controllers: [SesionsController],
    providers: [SesionService, AreaResultService, ActivityResultService]
})
export class SesionsModule { }