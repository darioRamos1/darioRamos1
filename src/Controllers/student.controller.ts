import { Controller, Post, Body , Get} from "@nestjs/common";
import { StudentService,RegisterStudentRequest } from "src/Services/student.service";

@Controller('students')
export class StudentsController{

    constructor(private studentService: StudentService){}
    @Post()
    addProduct( @Body() request:RegisterStudentRequest) {
        const generatedId = this.studentService.InsertStudent(request);
        return generatedId;     
    }

    @Get()
    getAllProducts(){
        return this.studentService.getStudents();
    }
}