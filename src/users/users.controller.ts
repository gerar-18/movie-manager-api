import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserResponseDto } from "./dto/user-response.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor() {}

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: "Returns current user data." })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    getProfile(@CurrentUser() user: User): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
}
