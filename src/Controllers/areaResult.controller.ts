import { Controller, Post, Body , Get, Param, Delete} from "@nestjs/common";
import { AreaResultService,RegisterAreaResultRequest,  } from "src/Services/areaResult.service";

@Controller('areaResults')
export class AreaResultsController{

    constructor(private areaResultService: AreaResultService){}
    @Post()
    async addAreaResult( @Body() request:RegisterAreaResultRequest) {
        return await this.areaResultService.insertAreaResult(request);   
    }

    @Get('sesion/:id')
    async getStudentAreaResults(@Param('id') sesionId:string){
        return await this.areaResultService.getStudentAreaResults(sesionId);
    }

    @Delete(':id')
    async removeAreaResult(@Param('id') areaResultId:string){
        
        return await this.areaResultService.deleteAreaResult(areaResultId);
    }

  
}