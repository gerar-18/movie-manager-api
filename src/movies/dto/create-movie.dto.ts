import { IsString, IsInt, IsOptional, IsPositive, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMovieDto {
    @ApiProperty({ example: "A New Hope" })
    @IsString()
    @MaxLength(255)
    title: string;

    @ApiProperty({ example: 1977 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    releaseDate?: number;

    @ApiProperty({ example: "George Lucas", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    director?: string;

    @ApiProperty({ example: "Gary Kurtz, Rick McCallum", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    producer?: string;
}
