import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MoviesService } from "../movies.service";

@Injectable()
export class SwapiSyncTask {
    private readonly logger = new Logger(SwapiSyncTask.name);

    constructor(private readonly moviesService: MoviesService) {}

    // Run every day at 3 AM
    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async handleCron() {
        this.logger.debug("Running SWAPI sync task");
        try {
            const result = await this.moviesService.syncWithSwapi();
            this.logger.debug(result);
        } catch (error) {
            this.logger.error("Error during SWAPI sync", error);
        }
    }
}
