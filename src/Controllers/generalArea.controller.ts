import { Controller, Post, Body } from "@nestjs/common";
import { CompareGeneralAreaResultRequest, GeneralAreaService, } from "src/Services/generalArea.service";

@Controller('generalArea')
export class GeneralAreasController{

    constructor(private generalAreaService: GeneralAreaService){}
    @Post()
    async compareGeneralArea( @Body() request:CompareGeneralAreaResultRequest) {
        return await this.generalAreaService.compareGeneralArea(request);   
    }

  
}