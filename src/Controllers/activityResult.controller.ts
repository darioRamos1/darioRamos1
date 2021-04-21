import { Controller, Post, Body , Get, Param, Delete} from "@nestjs/common";
import { ActivityResultService,RegisterActivityResultRequest,  } from "src/Services/activityResult.service";

@Controller('ActivityResult')
export class ActivityResultsController{

    constructor(private activityResultService: ActivityResultService){}
    @Post()
    async addActivityResult( @Body() request:RegisterActivityResultRequest) {
        return await this.activityResultService.insertActivityResult(request);   
    }

    @Get('sesion/:id')
    async getStudentActivityResults(@Param('id') sesionId:string){
        return await this.activityResultService.getStudentActivityResults(sesionId);
    }

    @Delete(':id')
    async removeActivityResult(@Param('id') activityResultId:string){
        
        return await this.activityResultService.deleteActivityResult(activityResultId);
    }

  
}