import { Injectable, NotFoundException } from "@nestjs/common";
import {Teacher} from "../Models/teacher.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class TeacherService{

    constructor(@InjectModel('Teacher') private readonly seacherModel: Model<Teacher>){}

    async insertTeacher(request:RegisterTeacherRequest): Promise<DefaultResponse>{

        const newTeacher = new this.seacherModel({
            name:request.name,
            userId:request.userId,
            password:request.password
        }
            );

        await newTeacher.save();
        return new DefaultResponse('Estudiante registrado');
    }

    async loginTeacher(request:LoginRequest): Promise<LoginResponse> {
        
        const seacher = await this.findTeacher(request.userId);
        
        if(seacher != undefined){
            if (seacher.password == request.password){
                return new LoginResponse(seacher,null);
            }
            return new LoginResponse(undefined, 'Contraseña incorrecta');
        }else{
            return new LoginResponse(seacher,'Estudiante no se encuentra registrado');
        }
    }
    
    async getAllTeachers(){
        const seachers = await this.seacherModel.find().exec();
        return seachers as Teacher[];
    }  

    async getTeacher(seacherId:string): Promise<SearchTeacherResponse>{
        const seacher = await this.findTeacher(seacherId);

        if(seacher!=undefined){
            return new SearchTeacherResponse(seacher,null);
        }else{
            return new SearchTeacherResponse(null,'No se encontro al estudiante');
        }
    }

    private async findTeacher(userIdf:string): Promise<Teacher>{
        
        try {
            return await this.seacherModel.findOne({where: {userId: userIdf}});
        } catch (error) {
            return undefined;
        }
        
    }

    async updateTeacher(seacherId:string, request:UpdateTeacherRequest): Promise<DefaultResponse>{
        const updatedTeacher = await this.findTeacher(seacherId);
        
        if(updatedTeacher!=undefined){
            if(request.name){
                updatedTeacher.name = request.name;
            }
            if(request.password){
                updatedTeacher.password = request.password;
            }
            if(request.userId){
                updatedTeacher.userId = request.userId;
            }
        }else{
            return new DefaultResponse('No se encontro el estudiante');
        }

        updatedTeacher.save();
        return new DefaultResponse('Estudiante modificado con exito');
    }

    async deleteTeacher(seacherId:string){
       const result = await this.seacherModel.deleteOne({_id:seacherId}).exec();
       if(result.n ===0){
           throw new NotFoundException('No se encontro el estudiante');
       }
    }
   
}


export class LoginRequest{
    constructor(
        public userId:string,
        public password:string,
    ){}
}

export class LoginResponse{
    constructor(
        public seacher:Teacher,
        public message?:string,
    ){}
}

export class SearchTeacherResponse{
    constructor(
        public seacher:Teacher,
        public message?:string,
    ){}
}


export class RegisterTeacherRequest{

    constructor(
        public name:string,
        public userId:string,
        public password:string
    ){}
}

export class UpdateTeacherRequest{

    constructor(
        public name:string,
        public userId:string,
        public password:string
    ){}
}

export class DefaultResponse{
    constructor(
        public message:string
    ){}
}




