import { Module } from "@nestjs/common";
import { StudentsController } from "src/Controllers/student.controller";
import { StudentService } from "src/Services/student.service";

@Module({
    controllers:[StudentsController],
    providers:[StudentService]
})
export class StudentsModule{}