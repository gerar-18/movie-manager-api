import { AppService } from "../../src/app.service";

describe("AppService", () => {
    let appService: AppService;

    beforeEach(() => {
        appService = new AppService();
    });

    it('should return status object with "ok" status', () => {
        const result = appService.getStatus();
        expect(result).toEqual({ status: "ok" });
    });
});
