import { Injectable, NotFoundException } from "@nestjs/common";
import {Student} from "../Models/student.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class StudentService{

    private students: Student[] = [];

    constructor(@InjectModel('Student') private readonly studentModel: Model<Student>){}

    async insertStudent(request:RegisterStudentRequest){

        const newStudent = new this.studentModel({
            name:request.name,
            age:request.age}
            );

        const result = await newStudent.save();
        return result.id as string;
    }
    
    async getAllStudents(){
        const students = await this.studentModel.find().exec();
        return students as Student[];
    }  

    async getStudent(studentId:string){
        const student = await this.findStudent(studentId);
        return {
            id:student.id,
            name:student.name,
            age:student.age};
    }

    private async findStudent(studentId:string): Promise<Student>{

        let student;
        try {
            student = await this.studentModel.findById(studentId).exec();

            if(!student){
                throw new NotFoundException('No se encontro el estudiante');
            }

            return student;

        } catch (error) {
            throw new NotFoundException('No se encontro el estudiante');
        }
        
    }

    async updateStudent(studentId:string, request:UpdateStudentRequest){
        const updatedStudent = await this.findStudent(studentId);
        
        if(request.name){
            updatedStudent.name = request.name;
        }
        if(request.age){
            updatedStudent.age = request.age;
        }

        updatedStudent.save();
    }

    async deleteStudent(studentId:string){
       const result = await this.studentModel.deleteOne({_id:studentId}).exec();
       if(result.n ===0){
           throw new NotFoundException('No se encontro el estudiante');
       }
    }
   
}

export class RegisterStudentRequest{

    constructor(
        public name:string,
        public age:number
    ){}
}

export class UpdateStudentRequest{

    constructor(
        public name:string,
        public age:number
    ){}
}


