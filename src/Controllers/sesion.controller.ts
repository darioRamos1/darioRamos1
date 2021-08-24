import { Controller, Post, Body, Get, Param, Delete, Patch } from "@nestjs/common";
import { ActivityResultService } from "src/Services/activityResult.service";
import { AreaResultService } from "src/Services/areaResult.service";
import { ClassgroupService } from "src/Services/classgroup.service";
import { GeneralAreaService, UpdateGeneralAreaRequest } from "src/Services/generalArea.service";
import { SesionService, RegisterSesionRequest, UpdateSesionRequest, } from "src/Services/sesion.service";
import { DefaultResponse, StudentService } from "src/Services/student.service";

@Controller('sesions')
export class SesionsController {
    constructor(
        private activityService: ActivityResultService,
        private areaResultService: AreaResultService,
        private sesionService: SesionService,
        private generalAreaService: GeneralAreaService,
        private studentService: StudentService,
        private classgroupService: ClassgroupService
        ) { }
    @Post()
    async addSesion(@Body() request: RegisterSesionRequest) {
        const response = await this.sesionService.insertSesion(request);
        //cuando acabe el test actualizo los resultados generales, se necesita el genero y el grado
        if(request.estado==true){
            const guardado = await this.guardarAreaResults(response.sesionId);
            const activities = await this.activityService.getAllActivityResults();
            const student = await this.studentService.getStudent(request.student);
            if(student.student!=null){
                const clase = await this.classgroupService.getClassgroup(student.student.classgroup);
                if(guardado.state ==0 && activities.state==0 && clase.state==0){
                    return await this.generalAreaService.updateGeneralAreas(
                        new UpdateGeneralAreaRequest(
                            activities.activityResults,
                            clase.classgroup.grado,
                            student.student.genero)
                    );
                }
                return new DefaultResponse(1,"error en lectura datos");
            }
            return student;
        }
        return response;
    }

    @Get('student/:id')
    async getStudentSesions(@Param('id') studentId: string) {
        return await this.sesionService.getStudentSesions(studentId);
    }

    @Delete(':id')
    async removeSesion(@Param('id') sesionId: string) {

        return await this.sesionService.deleteSesion(sesionId);
    }

    @Patch()
    async updateSesion(@Body() request: UpdateSesionRequest) {

        const response = await this.sesionService.updateSesion(request);
        if (response.state === 0) {
            return await this.guardarAreaResults(request.sesionId);
        }
        return response;
    }

    async guardarAreaResults(sesionId: string){
        const activities = await this.activityService.getSesionActivityResults(sesionId);
        if (activities.state == 0) {
            const areaResponse = await this.areaResultService.createAreaResult(activities.activityResults, sesionId);
            if (areaResponse != null && areaResponse.state == 0) {
                activities.activityResults.forEach(async element => {
                    await this.activityService.deleteActivityResult(element.id);
                });
                return areaResponse;
            }
        }
        return activities;
    }
}