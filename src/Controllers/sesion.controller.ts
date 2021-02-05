import { Controller, Post, Body , Get, Param, Patch, Delete} from "@nestjs/common";
import { SesionService,RegisterSesionRequest, UpdateSesionRequest, } from "src/Services/sesion.service";

@Controller('sesions')
export class SesionsController{

    constructor(private sesionService: SesionService){}
    @Post()
    async addSesion( @Body() request:RegisterSesionRequest) {
        return await this.sesionService.insertSesion(request);   
    }

    @Get('student/:id')
    async getStudentSesions(@Param('id') studentId:string){
        return await this.sesionService.getStudentSesions(studentId);
    }

    @Get(':id')
    async getSesion(@Param('id') sesionId:string){
        return await this.sesionService.getSesion(sesionId);
    }

    @Patch(':id')
    async updateSesion(@Param('id') sesionId:string, @Body() request:UpdateSesionRequest){
        
        return await this.sesionService.updateSesion(sesionId,request);;
    }
    @Delete(':id')
    async removeSesion(@Param('id') sesionId:string){
        
        return await this.sesionService.deleteSesion(sesionId);
    }

  
}