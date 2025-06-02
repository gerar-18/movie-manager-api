import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CoreModule } from "./core/core.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MoviesModule } from "./movies/movies.module";

@Module({
    imports: [CoreModule, UsersModule, AuthModule, MoviesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
