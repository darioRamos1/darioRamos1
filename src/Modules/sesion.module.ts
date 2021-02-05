import { Module } from "@nestjs/common";
import { MongooseModule }from '@nestjs/mongoose'

import { SesionsController } from "src/Controllers/sesion.controller";
import { SesionSchema } from "src/Models/sesion.model";
import { SesionService } from "src/Services/sesion.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'Sesion',schema:SesionSchema}])],
    controllers:[SesionsController],
    providers:[SesionService]
})
export class SesionsModule{}