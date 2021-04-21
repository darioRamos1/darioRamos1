import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { ActivityResultsController } from "src/Controllers/activityResult.controller";
import { ActivityResultSchema } from "src/Models/activityResult.model";
import { ActivityResultService } from "src/Services/activityResult.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'ActivityResult',schema:ActivityResultSchema}])],
    controllers:[ActivityResultsController],
    providers:[ActivityResultService]
})
export class ActivityResultsModule{}