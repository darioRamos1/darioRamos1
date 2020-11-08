import { Controller, Post, Body , Get, Param, Patch, Delete} from "@nestjs/common";
import { TeacherService,RegisterTeacherRequest, UpdateTeacherRequest, } from "src/Services/teacher.service";

@Controller('teachers')
export class TeachersController{

    constructor(private teacherService: TeacherService){}
    @Post()
    async addTeacher( @Body() request:RegisterTeacherRequest) {
        return await this.teacherService.insertTeacher(request);   
    }

    @Get()
    async getAllTeachers(){
        const result = await this.teacherService.getAllTeachers();
        return result.map((res)=>({
            id: res.id, 
            name:res.name,
            userId:res.userId,
            password:res.password
        }));
    }

    @Get(':id')
    async getTeacher(@Param('id') teacherId:string){
        return await this.teacherService.getTeacher(teacherId);
    }

    @Patch(':id')
    async updateTeacher(@Param('id') teacherId:string, @Body() request:UpdateTeacherRequest){
        
        return await this.teacherService.updateTeacher(teacherId,request);;
    }
    @Delete(':id')
    async removeTeacher(@Param('id') teacherId:string){
        
        return await this.teacherService.deleteTeacher(teacherId);
    }

  
}