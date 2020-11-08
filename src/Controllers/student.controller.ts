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

    @Get()
    async getAllStudents(){
        const result = await this.studentService.getAllStudents();
        return result.map((stud)=>({
            id: stud.id, 
            name:stud.name,
            userId:stud.userId,
            password:stud.password,
            age:stud.age}));
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