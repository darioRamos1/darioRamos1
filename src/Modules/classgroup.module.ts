import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { ClassgroupsController } from "src/Controllers/classgroup.controller";
import { ClassgroupSchema } from "src/Models/classgroup.model";
import { ClassgroupService } from "src/Services/classgroup.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'Classgroup',schema:ClassgroupSchema}])],
    controllers:[ClassgroupsController],
    providers:[ClassgroupService]
})
export class ClassgroupsModule{}