import { Injectable, NotFoundException } from "@nestjs/common";
import {Classgroup} from "../Models/classgroup.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class ClassgroupService{

    constructor(@InjectModel('Classgroup') private readonly classgroupModel: Model<Classgroup>){}

    async insertClassgroup(request:RegisterClassgroupRequest): Promise<DefaultResponse>{

        const newClassgroup = new this.classgroupModel({
            name:request.name,
            code:request.code,
            teacher:request.teacher
        }
            );

        await newClassgroup.save();
        return new DefaultResponse('Clase registrada');
    }
    
    async getAllClassgroups(): Promise<SearchClassAllgroupResponse>{
        const classgroups = await this.classgroupModel.find().exec();
        return new SearchClassAllgroupResponse(classgroups);
    }  

    async getClassgroup(classgroupCode:string): Promise<SearchClassgroupResponse>{
        const classgroup = await this.findClassgroup(classgroupCode);

        if(classgroup!=undefined){
            return new SearchClassgroupResponse(classgroup,null);
        }else{
            return new SearchClassgroupResponse(null,'No se encontro la clase');
        }
    }

    private async findClassgroup(classgroupCode:string): Promise<Classgroup>{
        
        try {
            const classgroup =  await this.classgroupModel.findOne({code:classgroupCode});
            return classgroup;
        } catch (error) {
            return undefined;
        }
        
    }

    async updateClassgroup(classgroupCode:string, request:UpdateClassgroupRequest): Promise<DefaultResponse>{
        const updatedClassgroup = await this.findClassgroup(classgroupCode);
        
        if(updatedClassgroup!=undefined){
            if(request.name){
                updatedClassgroup.name = request.name;
            }
            if(request.teacher){
                updatedClassgroup.teacher = request.teacher
            }
           
        }else{
            return new DefaultResponse('No se encontro la clase');
        }

        updatedClassgroup.save();
        return new DefaultResponse('Clase modificada con exito');
    }

    async deleteClassgroup(classgroupCode:string):Promise<DefaultResponse>{
       const result = await this.classgroupModel.deleteOne({code:classgroupCode}).exec();
       
       if(result.n ===0){
           return new DefaultResponse('No se encontro la clase');
       }else{
           return new DefaultResponse('Eliminado con exito');
       }
    }
   
}


export class SearchClassgroupResponse{
    constructor(
        public classgroup:Classgroup,
        public message?:string,
    ){}
}

export class SearchClassAllgroupResponse{
    constructor(
        public classgroups:Classgroup[],
    ){}
}


export class RegisterClassgroupRequest{

    constructor(
        public name:string,
        public teacher:string,
        public code:string
    ){}
}

export class UpdateClassgroupRequest{

    constructor(
        public name:string,
        public teacher:string
    ){}
}

export class DefaultResponse{
    constructor(
        public message:string
    ){}
}


