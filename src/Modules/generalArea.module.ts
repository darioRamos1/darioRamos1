import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { GeneralAreasController } from "src/Controllers/generalArea.controller";
import { GeneralAreaSchema } from "src/Models/generalArea.model";
import { GeneralAreaService } from "src/Services/generalArea.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'GeneralArea',schema:GeneralAreaSchema}])],
    controllers:[GeneralAreasController],
    providers:[GeneralAreaService]
})
export class GeneralAreasModule{}