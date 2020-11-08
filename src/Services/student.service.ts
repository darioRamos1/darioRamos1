import { Injectable, NotFoundException } from "@nestjs/common";
import {Student} from "../Models/student.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class StudentService{

    constructor(@InjectModel('Student') private readonly studentModel: Model<Student>){}

    async insertStudent(request:RegisterStudentRequest): Promise<DefaultResponse>{

        const newStudent = new this.studentModel({
            name:request.name,
            age:request.age,
            userId:request.userId,
            password:request.password
        }
            );

        await newStudent.save();
        return new DefaultResponse('Estudiante registrado');
    }

    async loginStudent(request:LoginRequest): Promise<LoginResponse> {
        
        const student = await this.findStudent(request.userId);
        
        if(student != undefined){
            if (student.password == request.password){
                return new LoginResponse(student,null);
            }
            return new LoginResponse(undefined, 'Contraseña incorrecta');
        }else{
            return new LoginResponse(student,'Estudiante no se encuentra registrado');
        }
    }
    
    async getAllStudents(){
        const students = await this.studentModel.find().exec();
        return students as Student[];
    }  

    async getStudent(studentId:string): Promise<SearchStudentResponse>{
        const student = await this.findStudent(studentId);

        if(student!=undefined){
            return new SearchStudentResponse(student,null);
        }else{
            return new SearchStudentResponse(null,'No se encontro al estudiante');
        }
    }

    private async findStudent(userId:string): Promise<Student>{
        
        try {
            const student =  await this.studentModel.findOne({userId});
            return student;
        } catch (error) {
            return undefined;
        }
        
    }

    async updateStudent(studentId:string, request:UpdateStudentRequest): Promise<DefaultResponse>{
        const updatedStudent = await this.findStudent(studentId);
        
        if(updatedStudent!=undefined){
            if(request.name){
                updatedStudent.name = request.name;
            }
            if(request.age){
                updatedStudent.age = request.age;
            }
            if(request.password){
                updatedStudent.password = request.password;
            }
            if(request.userId){
                updatedStudent.userId = request.userId;
            }
        }else{
            return new DefaultResponse('No se encontro el estudiante');
        }

        updatedStudent.save();
        return new DefaultResponse('Estudiante modificado con exito');
    }

    async deleteStudent(studentId:string){
       const result = await this.studentModel.deleteOne({_id:studentId}).exec();
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
        public student:Student,
        public message?:string,
    ){}
}

export class SearchStudentResponse{
    constructor(
        public student:Student,
        public message?:string,
    ){}
}


export class RegisterStudentRequest{

    constructor(
        public name:string,
        public age:number,
        public userId:string,
        public password:string
    ){}
}

export class UpdateStudentRequest{

    constructor(
        public name:string,
        public age:number,
        public userId:string,
        public password:string
    ){}
}

export class DefaultResponse{
    constructor(
        public message:string
    ){}
}


