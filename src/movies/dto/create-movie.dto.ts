import { IsString, IsOptional, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateFormat } from "../../common/validators/is-date-format.validator";

export class CreateMovieDto {
    @ApiProperty({ example: "A New Hope" })
    @IsString()
    @MaxLength(255)
    title: string;

    @ApiProperty({ example: "1997-02-02" })
    @IsOptional()
    @IsDateFormat({ message: "Release date must be in the format YYYY-MM-DD and be a valid date" })
    releaseDate?: string;

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
