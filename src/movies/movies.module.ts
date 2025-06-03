import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MoviesService } from "./movies.service";
import { MoviesController } from "./movies.controller";
import { Movie } from "./entities/movie.entity";
import { ScheduleModule } from "@nestjs/schedule";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [TypeOrmModule.forFeature([Movie]), ScheduleModule.forRoot(), HttpModule, ConfigModule],
    providers: [MoviesService],
    controllers: [MoviesController],
    exports: [MoviesService],
})
export class MoviesModule {}
