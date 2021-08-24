import { Controller, Post, Body , Get, Param, Delete} from "@nestjs/common";
import { AreaResultService,RegisterAreaResultRequest, } from "src/Services/areaResult.service";

@Controller('areaResult')
export class AreaResultsController{

    constructor(private areaResultService: AreaResultService){}
    @Post()
    async addAreaResult( @Body() request:RegisterAreaResultRequest) {
        return await this.areaResultService.insertAreaResult(request);   
    }

    @Get('sesion/:id')
    async getSesionAreaResults(@Param('id') sesionId:string){
        return await this.areaResultService.getSesionAreaResults(sesionId);
    }

    @Delete(':id')
    async removeAreaResult(@Param('id') areaResultId:string){
        
        return await this.areaResultService.deleteAreaResult(areaResultId);
    }

  
}