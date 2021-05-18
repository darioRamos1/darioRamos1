import { Controller, Post, Body , Get, Param, Patch, Delete} from "@nestjs/common";
import { StudentService,RegisterStudentRequest, UpdateStudentRequest, LoginRequest, } from "src/Services/student.service";

@Controller('students')
export class StudentsController{

    constructor(private studentService: StudentService){}
    @Post()
    async addStudent( @Body() request:RegisterStudentRequest) {
        return await this.studentService.insertStudent(request);   
    }

    @Post('login')
    async login( @Body() request:LoginRequest){
        return await this.studentService.loginStudent(request);
    }

    @Get('classgroup/:id')
    async getAllStudents(@Param('id') classgroup:string){
        return await this.studentService.getClassgroupStudents(classgroup);
    }

    @Get(':id')
    async getStudent(@Param('id') studentId:string){
        return await this.studentService.getStudent(studentId);
    }

    @Patch(':id')
    async updateStudent(@Param('id') studentId:string, @Body() request:UpdateStudentRequest){
        
        return await this.studentService.updateStudent(studentId,request);;
    }
    @Delete(':id')
    async removeStudent(@Param('id') studentId:string){
        
        return await this.studentService.deleteStudent(studentId);
    }

  
}