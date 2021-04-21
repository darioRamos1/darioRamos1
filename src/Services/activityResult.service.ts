import { Injectable } from "@nestjs/common";
import {ActivityResult} from "../Models/activityResult.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class ActivityResultService{

    constructor(@InjectModel('ActivityResult') private readonly activityResultModel: Model<ActivityResult>){}

    async insertActivityResult(request:RegisterActivityResultRequest): Promise<DefaultResponse>{

        const newActivityResult = new this.activityResultModel({
            sesionId: request.sesionId,
            area: request.area,
            indice: request.indice,
            resultado: request.resultado,
            tiempo: request.tiempo,
        }
            );

        await newActivityResult.save();
        return new DefaultResponse(0,'ActivityResult registrada');
    }
    
    async getStudentActivityResults(sesionId:string): Promise<SearchAllActivityResponse>{
        let state=0;
        const activityResults = await this.activityResultModel.find({sesionId:sesionId},
            function(err,activityResultes){
                if(err){
                    state = 1;
                    return [];
                }
                return activityResultes;
            });
            
        return new SearchAllActivityResponse(state,activityResults);
    }  



    async deleteActivityResult(activityResultCode:string):Promise<DefaultResponse>{
       const result = await this.activityResultModel.deleteOne({code:activityResultCode}).exec();
       
       if(result.n ===0){
           return new DefaultResponse(1,'No se encontro la activityResult');
       }else{
           return new DefaultResponse(0,'Eliminado con exito');
       }
    }
   
}


export class SearchActivityResultResponse{
    constructor(
        public state:number,
        public activityResult:ActivityResult,
        public message?:string,
    ){}
}

export class SearchAllActivityResponse{
    constructor(
        public state:number,
        public activityResults:ActivityResult[],
    ){}
}


export class RegisterActivityResultRequest{

    constructor(
        public sesionId:string,
        public area:string,
        public indice:number,
        public resultado:boolean,
        public tiempo:number
    ){}
}

export class DefaultResponse{
    constructor(
        public state:number,
        public message:string
    ){}
}


