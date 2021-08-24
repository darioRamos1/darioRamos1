import { Injectable } from "@nestjs/common";
import { GeneralArea } from "../Models/generalArea.model";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { AreaResult } from "src/Models/areaResult.model";

@Injectable()
export class GeneralAreaService {

    constructor(@InjectModel('GeneralArea') private readonly generalAreaModel: Model<GeneralArea>,) { }

    async insertGeneralArea(request: RegisterGeneralAreaRequest): Promise<DefaultResponse> {

        const newGeneralArea = new this.generalAreaModel({
            area: request.area,
            total: request.total,
            media: request.media,
            dt: request.dt,
            grado: request.grado,
            genero: request.genero,
            tiempo: request.tiempo,
            numero: request.numero,
        }
        );

        await newGeneralArea.save();
        return new DefaultResponse(0, 'GeneralArea registrada');
    }

    async updateGeneralAreas(request: UpdateGeneralAreaRequest): Promise<DefaultResponse> {
        const areasGenerales: GeneralAreaTemp[] = [];

        areasGenerales[0].area = 'Suma';
        areasGenerales[1].area = 'Resta';
        areasGenerales[2].area = 'Multiplicacion';
        areasGenerales[3].area = 'Puntos';
        areasGenerales[4].area = 'Lineas';
        areasGenerales[5].area = 'Recta numérica';
        areasGenerales[6].area = 'Número Mayor';

        //hallar la media de cada area
        request.areaResults.forEach(areaObj => {
            areasGenerales.forEach(areaGen => {
                if (areaObj.area == areaGen.area) {
                    areaGen.total += areaObj.resultado;
                    areaGen.numero++;
                    areaGen.tiempoTotal += areaObj.tiempo;
                }
            });
        });

        //desviacion tipica
        request.areaResults.forEach(areaObj => {
            areasGenerales.forEach(areaGen => {
                if (areaObj.area == areaGen.area) {
                    areaGen.sumaDt += Math.pow(areaObj.resultado - areaGen.media, 2);
                }
            });
        });

        areasGenerales.forEach(areaGen => {
            areaGen.genero = request.genero;
            areaGen.grado = request.grado;
            areaGen.media = areaGen.total / areaGen.numero;
            areaGen.tiempo = areaGen.tiempoTotal / areaGen.numero;
            areaGen.dt = Math.sqrt(areaGen.sumaDt / areaGen.numero);
        });

        //registrar el area general
        areasGenerales.forEach(async areaGen => {
            const generalArea = await this.generalAreaModel.findOne({ area: areaGen.area, grado: request.grado, genero: request.genero },
                function (err, generalArea) {
                    if (err) {
                        return null;
                    }
                    return generalArea;
                });

            if (generalArea == null) {
                const newGeneralArea = new this.generalAreaModel({
                    area: areaGen.area,
                    media: areaGen.media,
                    dt: areaGen.dt,
                    grado: areaGen.grado,
                    genero: areaGen.genero,
                    tiempo: areaGen.tiempo,
                    numero: areaGen.numero,
                });
                await newGeneralArea.save();
            } else {
                generalArea.area = areaGen.area;
                generalArea.media = areaGen.media;
                generalArea.dt = areaGen.dt;
                generalArea.grado = areaGen.grado;
                generalArea.genero = areaGen.genero;
                generalArea.tiempo = areaGen.tiempo;
                generalArea.numero = areaGen.numero;
                await generalArea.save();
            }
        });

        return new DefaultResponse(0, "Areas generales actualizadas");
    }


    async getGeneralArea(area: string): Promise<SearchGeneralAreaResponse> {
        let state = 0;
        const generalArea = await this.generalAreaModel.findOne({ area: area },
            function (err, generalArea) {
                if (err) {
                    state = 1;
                    return null;
                }
                return generalArea;
            });

        return new SearchGeneralAreaResponse(state, generalArea);
    }

    async deleteGeneralArea(generalAreaCode: string): Promise<DefaultResponse> {
        const result = await this.generalAreaModel.deleteOne({ code: generalAreaCode }).exec();

        if (result.n === 0) {
            return new DefaultResponse(1, 'No se encontro la generalArea');
        } else {
            return new DefaultResponse(0, 'Eliminado con exito');
        }
    }

}
export interface GeneralAreaTemp {
    area: string,
    total: number,
    tiempoTotal: number,
    sumaDt: number,
    media: number,
    dt: number,
    grado: number,
    genero: string,
    tiempo: number,
    numero: number,
}

export class SearchGeneralAreaResponse {
    constructor(
        public state: number,
        public generalArea: GeneralArea,
    ) { }
}

export class UpdateGeneralAreaRequest {

    constructor(
        public areaResults: AreaResult[],
        public grado: number,
        public genero: string
    ) { }
}

export class RegisterGeneralAreaRequest {

    constructor(
        public area: string,
        public media: number,
        public total: number,
        public dt: number,
        public grado: number,
        public genero: string,
        public tiempo: number,
        public numero: number
    ) { }
}

export class DefaultResponse {
    constructor(
        public state: number,
        public message: string
    ) { }
}


