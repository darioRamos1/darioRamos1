import { Injectable } from "@nestjs/common";
import { AreaResult } from "../Models/areaResult.model";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { ActivityResult } from "src/Models/activityResult.model";

@Injectable()
export class AreaResultService {

    constructor(@InjectModel('AreaResult') private readonly areaResultModel: Model<AreaResult>) { }

    async insertAreaResult(request: RegisterAreaResultRequest): Promise<DefaultResponse> {

        const newAreaResult = new this.areaResultModel({
            sesionId: request.sesionId,
            area: request.area,
            resultado: request.resultado,
            tiempo: request.tiempo,
            preguntas: request.preguntas
        }
        );

        await newAreaResult.save();
        return new DefaultResponse(0, 'AreaResult registrada');
    }

    async createAreaResult(activities: ActivityResult[], sesionID: string): Promise<CreateAreaResultsResponse> {

        const areasResults: AreaResult[] = [];
        this.areas.forEach(element => {
            areasResults.push(new this.areaResultModel({
                sesionId: sesionID,
                area: element,
                resultado: 0,
                tiempo: 0,
                preguntas: 0
            }
            ));
        });
        activities.forEach(activity => {
            areasResults.forEach(areaResult => {
                if (areaResult.area == activity.area) {
                    areaResult.preguntas++;
                    areaResult.resultado += activity.resultado;
                    areaResult.tiempo += activity.tiempo;
                }
            });
        });

        areasResults.forEach(async areaResult => {
            if (!(areaResult.preguntas == 0))
                await areaResult.save();
        });

        return new CreateAreaResultsResponse(0, areasResults);
    }


    areas = [
        "Suma",
        "Resta",
        "Multiplicacion",
        "Escritura",
        "Comparacion",
        "Conteo",
        "Recta numérica",
        "Secuencia",
        "Puntos",
        "Lineas",
        "Número Mayor"
    ];

    async getSesionAreaResults(sesionID: string): Promise<SearchAllAreaResponse> {
        let state = 0;
        const areaResults = await this.areaResultModel.find({ sesionId: sesionID },
            function (err, areaResultes) {
                if (err) {
                    console.log("Error" + err);
                    state = 1;
                    return [];
                }
                return areaResultes;
            });
        console.log("areas::::");
        console.log(areaResults);
        return new SearchAllAreaResponse(state, areaResults);
    }



    async deleteAreaResult(activityResultCode: string): Promise<DefaultResponse> {
        const result = await this.areaResultModel.deleteOne({ code: activityResultCode }).exec();

        if (result.n === 0) {
            return new DefaultResponse(1, 'No se encontro la activityResult');
        } else {
            return new DefaultResponse(0, 'Eliminado con exito');
        }
    }

}

export class SearchAllAreaResponse {
    constructor(
        public state: number,
        public areaResults: AreaResult[],
    ) { }
}

export class RegisterAreaResultRequest {

    constructor(
        public sesionId: string,
        public area: string,
        public resultado: number,
        public tiempo: number,
        public preguntas: number
    ) { }
}

export class CreateAreaResultsResponse {

    constructor(
        public state:number,
        public areaResults: AreaResult[]
    ) { }
}

export class DefaultResponse {
    constructor(
        public state: number,
        public message: string
    ) { }
}


