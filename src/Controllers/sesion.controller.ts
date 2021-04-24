import { Controller, Post, Body , Get, Param, Delete, Patch} from "@nestjs/common";
import { SesionService,RegisterSesionRequest, UpdateSesionRequest,  } from "src/Services/sesion.service";

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

    @Delete(':id')
    async removeSesion(@Param('id') sesionId:string){
        
        return await this.sesionService.deleteSesion(sesionId);
    }

    @Patch()
    async updateSesion(@Body() request:UpdateSesionRequest){
        
        return await this.sesionService.updateSesion(request);
    }
}