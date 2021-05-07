import { Injectable, NotFoundException } from '@nestjs/common';
import { Teacher } from '../Models/teacher.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel('Teacher') private readonly teacherModel: Model<Teacher>,
  ) {}

  async insertTeacher(
    request: RegisterTeacherRequest,
  ): Promise<DefaultResponse> {
    const teacher = await this.findTeacher(request.userId);
    if (teacher != undefined) {
      return new DefaultResponse(1, 'Nombre de usuario ya es encuentra en uso');
    } else {
      const newTeacher = new this.teacherModel({
        name: request.name,
        userId: request.userId,
        password: request.password,
      });

      await newTeacher.save();
      return new DefaultResponse(0, 'Tutor registrado');
    }
  }

  async loginTeacher(request: LoginRequest): Promise<LoginResponse> {
    const teacher = await this.findTeacher(request.userId);

    if (teacher != undefined) {
      if (teacher.password == request.password) {
        return new LoginResponse(0, teacher, null);
      }
      return new LoginResponse(1, undefined, 'Contraseña incorrecta');
    } else {
      return new LoginResponse(1, teacher, 'Tutor no se encuentra registrado');
    }
  }

  async getAllTeachers() {
    const teachers = await this.teacherModel.find().exec();
    return teachers as Teacher[];
  }

  async getTeacher(teacherId: string): Promise<SearchTeacherResponse> {
    const teacher = await this.findTeacher(teacherId);

    if (teacher != undefined) {
      return new SearchTeacherResponse(teacher, null);
    } else {
      return new SearchTeacherResponse(null, 'No se encontro al Tutor');
    }
  }

  private async findTeacher(userId: string): Promise<Teacher> {
    try {
       await this.teacherModel.findOne({ userId }, 
        (err,res)=>{
            if(err){
                return undefined;
            }
            return res;
        }
      );
    } catch (error) {
      return undefined;
    }
  }

  async updateTeacher(
    teacherId: string,
    request: UpdateTeacherRequest,
  ): Promise<DefaultResponse> {
    const updatedTeacher = await this.findTeacher(teacherId);

    if (updatedTeacher != undefined) {
      if (request.name) {
        updatedTeacher.name = request.name;
      }
      if (request.password) {
        updatedTeacher.password = request.password;
      }
      if (request.userId) {
        updatedTeacher.userId = request.userId;
      }
    } else {
      return new DefaultResponse(1, 'No se encontro el Tutor');
    }

    updatedTeacher.save();
    return new DefaultResponse(0, 'Tutor modificado con exito');
  }

  async deleteTeacher(teacherId: string) {
    const result = await this.teacherModel.deleteOne({ _id: teacherId }).exec();
    if (result.n === 0) {
      throw new NotFoundException(1, 'No se encontro el Tutor');
    }
  }
}

export class LoginRequest {
  constructor(public userId: string, public password: string) {}
}

export class LoginResponse {
  constructor(
    public state: number,
    public teacher: Teacher,
    public message?: string,
  ) {}
}

export class SearchTeacherResponse {
  constructor(public teacher: Teacher, public message?: string) {}
}

export class RegisterTeacherRequest {
  constructor(
    public name: string,
    public userId: string,
    public password: string,
  ) {}
}

export class UpdateTeacherRequest {
  constructor(
    public name: string,
    public userId: string,
    public password: string,
  ) {}
}

export class DefaultResponse {
  constructor(public state: number, public message: string) {}
}
