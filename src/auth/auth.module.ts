import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User]), UsersModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
