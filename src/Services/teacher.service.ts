import { Injectable, NotFoundException } from "@nestjs/common";
import {Teacher} from "../Models/teacher.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class TeacherService{

    private teachers: Teacher[] = [];

    constructor(@InjectModel('Teacher') private readonly teacherModel: Model<Teacher>){}

    async insertTeacher(request:RegisterTeacherRequest): Promise<DefaultResponse>{

        const newTeacher = new this.teacherModel({
            name:request.name,
            userId:request.userId,
            password:request.password
        }
            );

        await newTeacher.save();
        return new DefaultResponse('Docente registrado');
    }
    
    async getAllTeachers(){
        const teachers = await this.teacherModel.find().exec();
        return teachers as Teacher[];
    }  

    async getTeacher(teacherId:string){
        return await this.findTeacher(teacherId);
    }

    private async findTeacher(teacherId:string): Promise<SearchTeacherRespond>{

        try {
            const teacher:Teacher = await this.teacherModel.findById(teacherId).exec();

            if(!teacher){
                return new SearchTeacherRespond(null,'No se encontro el docente');
            }

            return new SearchTeacherRespond(teacher, 'Docente encontrado');

        } catch (error) {
            return new SearchTeacherRespond(null,'No se encontro el docente');
        }
        
    }

    async updateTeacher(teacherId:string, request:UpdateTeacherRequest): Promise<DefaultResponse>{
        const updatedTeacher = await this.findTeacher(teacherId);
        
        if(updatedTeacher.teacher!=null){
            if(request.name){
                updatedTeacher.teacher.name = request.name;
            }
            if(request.password){
                updatedTeacher.teacher.password = request.password;
            }
            if(request.userId){
                updatedTeacher.teacher.userId = request.userId;
            }
        }else{
            return new DefaultResponse('No se encontro el docente');
        }

        updatedTeacher.teacher.save();
        return new DefaultResponse('Estudiante modificado con exito');
    }

    async deleteTeacher(teacherId:string){
       const result = await this.teacherModel.deleteOne({_id:teacherId}).exec();
       if(result.n ===0){
           throw new NotFoundException('No se encontro el docente');
       }
    }
   
}

export class SearchTeacherRespond{
    constructor(
        public teacher:Teacher,
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


