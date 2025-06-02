import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../common/enums/user.enums";

export class UserResponseDto {
    @ApiProperty({ description: "Unique identifier of the user", example: 1 })
    id: number;

    @ApiProperty({ description: "Username of the user", example: "john_doe@email.com" })
    email: string;

    @ApiProperty({ enum: UserRole, description: "Role of the user", example: UserRole.ADMIN })
    role: string;
}
