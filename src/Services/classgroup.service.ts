import { Injectable } from "@nestjs/common";
import {Classgroup} from "../Models/classgroup.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class ClassgroupService{

    constructor(@InjectModel('Classgroup') private readonly classgroupModel: Model<Classgroup>){}

    async insertClassgroup(request:RegisterClassgroupRequest): Promise<DefaultResponse>{

        const codigo = await this.generateCode();
        const clase = await this.classgroupModel.findOne({name:request.name});

        if(clase!=undefined){
            return new DefaultResponse(1,'Nombre de clase ya existe');
        }
        const newClassgroup = new this.classgroupModel({
            name:request.name,
            code:codigo,
            grade:request.grade,
            teacher:request.teacher
        }
        );

        await newClassgroup.save();
        return new DefaultResponse(0,'Clase registrada');
    }
    
    async generateCode(): Promise<string>{
        try {
            let codigodisponible = false;
            let codigo = '';
            do{
                codigo = Math.random().toString(36).substr(4, 4).toUpperCase();
                const classgroup = await this.classgroupModel.findOne({code:codigo});
                if(classgroup == undefined){
                    codigodisponible = true;
                    return codigo;
                }
            }while(codigodisponible==false);
        } catch (error) {
            return '!!!!!!';
        }
    }
    async getTeacherClassgroups(teacherId:string): Promise<SearchClassAllgroupResponse>{
        let state=0;
        const classgroups = await this.classgroupModel.find({teacher:teacherId},
            function(err,clases){
                if(err){
                    state = 1;
                    return [];
                }
                return clases;
            });
            
        return new SearchClassAllgroupResponse(state,classgroups);
    }  

    async getClassgroup(classgroupCode:string): Promise<SearchClassgroupResponse>{
        const classgroup = await this.findClassgroup(classgroupCode);

        if(classgroup!=undefined){
            return new SearchClassgroupResponse(0,classgroup,null);
        }else{
            return new SearchClassgroupResponse(1,null,'No se encontro la clase');
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
                updatedClassgroup.teacher = request.teacher;
            }
            if(request.grade){
                updatedClassgroup.grade = request.grade;
            }
           
        }else{
            return new DefaultResponse(1,'No se encontro la clase');
        }

        updatedClassgroup.save();
        return new DefaultResponse(0,'Clase modificada con exito');
    }

    async deleteClassgroup(classgroupCode:string):Promise<DefaultResponse>{
       const result = await this.classgroupModel.deleteOne({code:classgroupCode}).exec();
       
       if(result.n ===0){
           return new DefaultResponse(1,'No se encontro la clase');
       }else{
           return new DefaultResponse(0,'Eliminado con exito');
       }
    }
   
}


export class SearchClassgroupResponse{
    constructor(
        public state:number,
        public classgroup:Classgroup,
        public message?:string,
        
    ){}
}

export class SearchClassAllgroupResponse{
    constructor(
        public state:number,
        public classgroups:Classgroup[],
    ){}
}


export class RegisterClassgroupRequest{

    constructor(
        public name:string,
        public teacher:string,
        public grade:number,
    ){}
}

export class UpdateClassgroupRequest{

    constructor(
        public name:string,
        public teacher:string,
        public grade:number
    ){}
}

export class DefaultResponse{
    constructor(
        public state:number,
        public message:string
    ){}
}


