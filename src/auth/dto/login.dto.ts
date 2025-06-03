import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: "test@test.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "password123456" })
    @IsNotEmpty()
    password: string;
}
