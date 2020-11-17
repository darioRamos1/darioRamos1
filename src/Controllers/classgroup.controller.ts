import { Controller, Post, Body , Get, Param, Patch, Delete} from "@nestjs/common";
import { ClassgroupService,RegisterClassgroupRequest, UpdateClassgroupRequest, } from "src/Services/classgroup.service";

@Controller('classgroups')
export class ClassgroupsController{

    constructor(private classgroupService: ClassgroupService){}
    @Post()
    async addClassgroup( @Body() request:RegisterClassgroupRequest) {
        return await this.classgroupService.insertClassgroup(request);   
    }

    @Get('teacher/:id')
    async getTeacherClassgroups(@Param('id') teacherId:string){
        return await this.classgroupService.getTeacherClassgroups(teacherId);
    }

    @Get(':id')
    async getClassgroup(@Param('id') classgroupId:string){
        return await this.classgroupService.getClassgroup(classgroupId);
    }

    @Patch(':id')
    async updateClassgroup(@Param('id') classgroupId:string, @Body() request:UpdateClassgroupRequest){
        
        return await this.classgroupService.updateClassgroup(classgroupId,request);;
    }
    @Delete(':id')
    async removeClassgroup(@Param('id') classgroupId:string){
        
        return await this.classgroupService.deleteClassgroup(classgroupId);
    }

  
}