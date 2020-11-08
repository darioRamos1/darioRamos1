import { Injectable, NotFoundException } from "@nestjs/common";
import {Student} from "../Models/student.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class StudentService{

    private students: Student[] = [];

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
    
    async getAllStudents(){
        const students = await this.studentModel.find().exec();
        return students as Student[];
    }  

    async getStudent(studentId:string){
        return await this.findStudent(studentId);
    }

    private async findStudent(studentId:string): Promise<SearchStudentRespond>{

        try {
            const student:Student = await this.studentModel.findById(studentId).exec();

            if(!student){
                return new SearchStudentRespond(null,'No se encontro el estudiante');
            }

            return new SearchStudentRespond(student, 'Estudiante encontrado');

        } catch (error) {
            return new SearchStudentRespond(null,'No se encontro el estudiante');
        }
        
    }

    async updateStudent(studentId:string, request:UpdateStudentRequest): Promise<DefaultResponse>{
        const updatedStudent = await this.findStudent(studentId);
        
        if(updatedStudent.student!=null){
            if(request.name){
                updatedStudent.student.name = request.name;
            }
            if(request.age){
                updatedStudent.student.age = request.age;
            }
            if(request.password){
                updatedStudent.student.password = request.password;
            }
            if(request.userId){
                updatedStudent.student.userId = request.userId;
            }
        }else{
            return new DefaultResponse('No se encontro el estudiante');
        }

        updatedStudent.student.save();
        return new DefaultResponse('Estudiante modificado con exito');
    }

    async deleteStudent(studentId:string){
       const result = await this.studentModel.deleteOne({_id:studentId}).exec();
       if(result.n ===0){
           throw new NotFoundException('No se encontro el estudiante');
       }
    }
   
}

export class SearchStudentRespond{
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


