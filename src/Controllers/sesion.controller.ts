import { Controller, Post, Body, Get, Param, Delete, Patch } from "@nestjs/common";
import { ActivityResultService } from "src/Services/activityResult.service";
import { AreaResultService } from "src/Services/areaResult.service";
import { SesionService, RegisterSesionRequest, UpdateSesionRequest, } from "src/Services/sesion.service";

@Controller('sesions')
export class SesionsController {
    constructor(
        private activityService: ActivityResultService,
        private areaResultService: AreaResultService,
        private sesionService: SesionService,
        ) { }
    @Post()
    async addSesion(@Body() request: RegisterSesionRequest) {
        return await this.sesionService.insertSesion(request);
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
            const activities = await this.activityService.getSesionActivityResults(request.sesionId);
            if (activities.state == 0) {
                const areaResponse = await this.areaResultService.createAreaResult(activities.activityResults, request.sesionId);
                if (areaResponse != null && areaResponse.state == 0) {
                    activities.activityResults.forEach(async element => {
                        await this.activityService.deleteActivityResult(element.id);
                    });
                    return areaResponse;
                }
            }
            return activities;
        }
        return response;
    }
}