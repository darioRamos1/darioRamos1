import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { AreaResultsController } from "src/Controllers/areaResult.controller";
import { AreaResultSchema } from "src/Models/areaResult.model";
import { AreaResultService } from "src/Services/areaResult.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'AreaResult',schema:AreaResultSchema}])],
    controllers:[AreaResultsController],
    providers:[AreaResultService]
})
export class AreaResultsModule{}