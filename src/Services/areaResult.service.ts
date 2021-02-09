import { Injectable } from "@nestjs/common";
import {AreaResult} from "../Models/areaResult.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class AreaResultService{

    constructor(@InjectModel('AreaResult') private readonly areaResultModel: Model<AreaResult>){}

    async insertAreaResult(request:RegisterAreaResultRequest): Promise<DefaultResponse>{

        const newAreaResult = new this.areaResultModel({
            sesionId: request.sesionId,
            area: request.area,
            aciertos: request.aciertos,
            preguntas: request.preguntas,
            tiempo: request.tiempo,

        }
            );

        await newAreaResult.save();
        return new DefaultResponse(0,'AreaResult registrada');
    }
    
    async getStudentAreaResults(sesionId:string): Promise<SearchClassAllgroupResponse>{
        let state=0;
        const areaResults = await this.areaResultModel.find({sesionId:sesionId},
            function(err,areaResultes){
                if(err){
                    state = 1;
                    return [];
                }
                return areaResultes;
            });
            
        return new SearchClassAllgroupResponse(state,areaResults);
    }  



    async deleteAreaResult(areaResultCode:string):Promise<DefaultResponse>{
       const result = await this.areaResultModel.deleteOne({code:areaResultCode}).exec();
       
       if(result.n ===0){
           return new DefaultResponse(1,'No se encontro la areaResult');
       }else{
           return new DefaultResponse(0,'Eliminado con exito');
       }
    }
   
}


export class SearchAreaResultResponse{
    constructor(
        public state:number,
        public areaResult:AreaResult,
        public message?:string,
        
    ){}
}

export class SearchClassAllgroupResponse{
    constructor(
        public state:number,
        public areaResults:AreaResult[],
    ){}
}


export class RegisterAreaResultRequest{

    constructor(
        public sesionId:string,
        public area:string,
        public aciertos:number,
        public preguntas:number,
        public tiempo:number
    ){}
}

export class DefaultResponse{
    constructor(
        public state:number,
        public message:string
    ){}
}


