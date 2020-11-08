import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { TeachersController } from "src/Controllers/teacher.controller";
import { TeacherSchema } from "src/Models/teacher.model";
import { TeacherService } from "src/Services/teacher.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'Teacher',schema:TeacherSchema}])],
    controllers:[TeachersController],
    providers:[TeacherService]
})
export class TeachersModule{}