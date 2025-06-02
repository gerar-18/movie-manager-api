import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetMoviesQueryDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: "Filter by movie title (case insensitive)" })
    title?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiPropertyOptional({ default: 1, description: "Page number for pagination" })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiPropertyOptional({ default: 10, description: "Number of items per page" })
    limit?: number = 10;
}
