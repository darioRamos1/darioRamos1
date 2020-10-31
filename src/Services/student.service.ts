import { Injectable } from "@nestjs/common";
import {Student} from "../Models/student.model";

@Injectable()
export class StudentService{

    private students: Student[] = [];

    InsertStudent(request:RegisterStudentRequest){

        const Id = new Date().toString();
        const newProduct = new Student(Id,request.Name,request.Age);
        this.students.push(newProduct);
        return Id;
    }
    
    getStudents(){
        return [...this.students];
    }  
}

export class RegisterStudentRequest{

    constructor(
        public Name:string,
        public Age:number
    ){}
    
}