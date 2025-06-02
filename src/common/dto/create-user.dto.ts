import { IsEmail, IsEnum, IsNotEmpty, Matches, MinLength } from "class-validator";
import { UserRole } from "../enums/user.enums";
import { ApiProperty } from "@nestjs/swagger";

// DTO for creating a new user, it's in common to be reused across modules
export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: "test@test.com",
    })
    email: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/, { message: "invalid password" })
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({
        example: "Test1234!",
    })
    password: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    @ApiProperty({
        example: UserRole.REGULAR_USER,
    })
    role: UserRole;
}
