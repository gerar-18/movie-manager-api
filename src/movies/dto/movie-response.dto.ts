import { ApiProperty } from "@nestjs/swagger";

export class MovieResponseDto {
    @ApiProperty({ description: "Unique identifier of the movie", example: 1 })
    id: number;

    @ApiProperty({ description: "Title of the movie", example: "A New Hope" })
    title: string;

    @ApiProperty({ description: "Release date of the movie", example: 1977 })
    releaseDate?: number;

    @ApiProperty({ description: "Director of the movie", example: "George Lucas", required: false })
    director?: string;

    @ApiProperty({ description: "Producer of the movie", example: "Gary Kurtz, Rick McCallum", required: false })
    producer?: string;
}
