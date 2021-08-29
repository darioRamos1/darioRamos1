import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { GeneralAreasController } from "src/Controllers/generalArea.controller";
import { AreaResultSchema } from "src/Models/areaResult.model";
import { GeneralAreaSchema } from "src/Models/generalArea.model";
import { GeneralAreaService } from "src/Services/generalArea.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'GeneralArea',schema:GeneralAreaSchema}]),
    MongooseModule.forFeature([{name:'AreaResult',schema:AreaResultSchema}]),
    MongooseModule.forFeature([{name:'Student',schema:GeneralAreaSchema}]),
    MongooseModule.forFeature([{name:'Classgroup',schema:GeneralAreaSchema}])],
    controllers:[GeneralAreasController],
    providers:[GeneralAreaService]
})
export class GeneralAreasModule{}