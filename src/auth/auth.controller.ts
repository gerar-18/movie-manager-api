import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../common/dto/create-user.dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiCreatedResponse({
        description: "User successfully registered",
        example: {
            id: 1,
            email: "test@test.com",
            role: "REGULAR_USER",
            createdAt: "2023-10-01T00:00:00.000Z",
            updatedAt: "2023-10-01T00:00:00.000Z",
        },
    })
    @ApiBadRequestResponse({
        description: "Invalid input data",
    })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post("login")
    @ApiCreatedResponse({
        description: "User successfully logged in",
        example: {
            accessToken: "asdedef12dedesd",
        },
    })
    @ApiBadRequestResponse({
        description: "Invalid credentials",
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
