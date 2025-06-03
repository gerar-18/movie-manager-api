import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../../src/app.controller";
import { AppService } from "../../src/app.service";

describe("AppController", () => {
    let appController: AppController;
    let appService: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = module.get<AppController>(AppController);
        appService = module.get<AppService>(AppService);
    });

    describe("getStatus", () => {
        it('should return status object with "ok" status', () => {
            const status = { status: "ok" };
            jest.spyOn(appService, "getStatus").mockReturnValue(status);

            const result = appController.getStatus();
            expect(result).toEqual(status);
        });
    });
});
