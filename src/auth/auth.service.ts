import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../common/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    // Method to register a new user
    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // Method to login a user
    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) throw new UnauthorizedException("Invalid credentials");

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");

        const jwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(jwtPayload);

        return { accessToken };
    }
}
