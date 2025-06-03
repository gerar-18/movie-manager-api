import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("Status")
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("status")
    @ApiOperation({ summary: "Get status" })
    @ApiResponse({
        status: 200,
        description: "Return the status of the application",
    })
    getStatus(): object {
        return this.appService.getStatus();
    }
}
