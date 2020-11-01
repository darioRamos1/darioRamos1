import { Controller, Post, Body , Get, Param, Patch, Delete} from "@nestjs/common";
import { StudentService,RegisterStudentRequest, UpdateStudentRequest, } from "src/Services/student.service";

@Controller('students')
export class StudentsController{

    constructor(private studentService: StudentService){}
    @Post()
    async addStudent( @Body() request:RegisterStudentRequest) {
        const generatedId = await this.studentService.insertStudent(request);
        return generatedId;     
    }

    @Get()
    async getAllStudents(){
        const result = await this.studentService.getAllStudents();
        return result.map((stud)=>({
            id: stud.id, 
            name:stud.name,
            age:stud.age}));
    }

    @Get(':id')
    async getStudent(@Param('id') studentId:string){
        return await this.studentService.getStudent(studentId);
    }

    @Patch(':id')
    async updateStudent(@Param('id') studentId:string, @Body() request:UpdateStudentRequest){
        await this.studentService.updateStudent(studentId,request);
        return null;
    }
    @Delete(':id')
    async removeStudent(@Param('id') studentId:string){
        await this.studentService.deleteStudent(studentId);
        return null
    }

  
}