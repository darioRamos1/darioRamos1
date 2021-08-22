import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { AreaResultSchema } from "src/Models/areaResult.model";
import { AreaResultService } from "src/Services/areaResult.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'AreaResult',schema:AreaResultSchema}])],
    providers:[AreaResultService]
})
export class AreaResultsModule{}