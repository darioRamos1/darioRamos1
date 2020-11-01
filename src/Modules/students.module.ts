import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { StudentsController } from "src/Controllers/student.controller";
import { StudentSchema } from "src/Models/student.model";
import { StudentService } from "src/Services/student.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'Student',schema:StudentSchema}])],
    controllers:[StudentsController],
    providers:[StudentService]
})
export class StudentsModule{}