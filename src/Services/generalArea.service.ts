import { Injectable } from "@nestjs/common";
import { GeneralArea } from "../Models/generalArea.model";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { AreaResult } from "src/Models/areaResult.model";
import { Student } from "src/Models/student.model";
import { Classgroup } from "src/Models/classgroup.model";

@Injectable()
export class GeneralAreaService {

    constructor(
        @InjectModel('GeneralArea') private readonly generalAreaModel: Model<GeneralArea>,
        @InjectModel('AreaResult') private readonly areaResultModel: Model<AreaResult>,
        @InjectModel('Student') private readonly studentModel: Model<Student>,
        @InjectModel('Classgroup') private readonly classgroupModel: Model<Classgroup>,
    ) { }

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

        areasGenerales[0] = new GeneralAreaTemp('Suma', request.grado, request.genero, 0, 0, 0, 0, 0, 0, 0);
        areasGenerales[1] = new GeneralAreaTemp('Resta', request.grado, request.genero, 0, 0, 0, 0, 0, 0, 0);
        areasGenerales[2] = new GeneralAreaTemp('Multiplicación', request.grado, request.genero, 0, 0, 0, 0, 0, 0, 0);
        areasGenerales[3] = new GeneralAreaTemp('Puntos', request.grado, request.genero, 0, 0, 0, 0, 0, 0, 0);
        areasGenerales[4] = new GeneralAreaTemp('Lineas', request.grado, request.genero, 0, 0, 0, 0, 0, 0, 0);
        areasGenerales[5] = new GeneralAreaTemp('Recta numérica', request.grado, request.genero, 0, 0, 0, 0, 0, 0, 0);
        areasGenerales[6] = new GeneralAreaTemp('Número Mayor', request.grado, request.genero, 0, 0, 0, 0, 0, 0, 0);

        //hallar la media de cada area
        request.areaResults.forEach(areaObj => {
            areasGenerales.forEach(areaGen => {
                if (areaObj.area == areaGen.area) {
                    areaGen.total += areaObj.resultado;
                    areaGen.numero += 1;
                    areaGen.tiempoTotal += areaObj.tiempo;
                }
            });
        });

        areasGenerales.forEach(areaGen => {
            if (areaGen.numero > 0) {
                areaGen.media = areaGen.total / areaGen.numero;
                areaGen.tiempo = areaGen.tiempoTotal / areaGen.numero;
            }
        });

        //desviacion tipica
        request.areaResults.forEach(areaObj => {
            areasGenerales.forEach(areaGen => {
                if (areaGen.numero > 0) {
                    if (areaObj.area == areaGen.area) {
                        areaGen.sumaDt += Math.pow(areaObj.resultado - areaGen.media, 2);
                    }
                }
            });
        });

        areasGenerales.forEach(areaGen => {
            areaGen.dt = Math.sqrt(areaGen.sumaDt / areaGen.numero);
        });
        //registrar el area general
        areasGenerales.forEach(async areaGen => {
            if (areaGen.numero > 0) {
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
            }
        });

        return new DefaultResponse(0, "Areas generales actualizadas");
    }

    async compareGeneralArea(request: CompareGeneralAreaResultRequest): Promise<CompareGeneralAreaResultResponse> {

        let dt1 = 0;
        let dt2 = 0;

        const areaResults = await this.areaResultModel.find({ sesionId: request.sesionId },
            function (err, areaResultes) {
                if (err) {
                    return [];
                }
                return areaResultes;
            });

        if(request.inicial){
            const student = await this.studentModel.findOne({ _id: request.student },
                function (err, student) {
                    if (err) {
                        return undefined;
                    }
                    return student;
                });
    
            if (student != undefined) {
                const classgroup = await this.classgroupModel.findOne({ _id: student.classgroup },
                    function (err, classgroup) {
                        if (err) {
                            return undefined;
                        }
                        return classgroup;
                    });
                 //Si hay 3 areas por debajo de 1.5dt o si hay una por debajo de 2dt entonces hay riesgo
                if (classgroup != undefined) {
                    if (areaResults.length > 0) {
                        areaResults.forEach(async areaRes => {
                            const generalArea = await this.generalAreaModel.findOne({ area: areaRes.area, grado: classgroup.grade, genero: student.gender },
                                function (err, generalArea) {
                                    if (err) {
                                        return null;
                                    }
                                    return generalArea;
                                });
    
                            if (generalArea) {
                                const limite1 = generalArea.media - (generalArea.dt * 1.5);
                                const limite2 = generalArea.media - (generalArea.dt * 2);
                                if (areaRes.resultado < limite2) {
                                    dt2 += 1;
                                } else if (areaRes.resultado < limite1) {
                                    dt1 += 1;
                                }
                            } else {
                                return null;
                            }
                        });
    
                        if (dt1 >= 3 || dt2 > 0) {
                            return new CompareGeneralAreaResultResponse(0,'Alto',areaResults);
                        } else {
                            return new CompareGeneralAreaResultResponse(0,'Bajo',areaResults);
                        }
                    }
                }
            }
        }else{

            return new CompareGeneralAreaResultResponse(0,'',areaResults);
        }



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
export class CompareGeneralAreaResultRequest {
    constructor(
        public sesionId: string,
        public student: string,
        public inicial: boolean
    ) { }
}

export class CompareGeneralAreaResultResponse {
    constructor(
        public state: number,
        public test: string,
        public areaResults: AreaResult[],
    ) { }
}
export class GeneralAreaTemp {

    constructor(
        public area: string,
        public grado: number,
        public genero: string,
        public total: number,
        public tiempoTotal: number,
        public sumaDt: number,
        public media: number,
        public dt: number,
        public tiempo: number,
        public numero: number,) {
    }

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

export class DefaultResponse{
    constructor(
        public state:number,
        public message:string
    ){}
}

