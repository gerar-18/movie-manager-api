import { ApiProperty } from "@nestjs/swagger";

export class SwapiFilmPropertiesDto {
    @ApiProperty({ example: "A New Hope", description: "Film title" })
    title: string;

    @ApiProperty({ example: 4, description: "Episode number" })
    episode_id: number;

    @ApiProperty({
        example: "It is a period of civil war...",
        description: "Opening crawl text",
    })
    opening_crawl: string;

    @ApiProperty({ example: "George Lucas", description: "Film director" })
    director: string;

    @ApiProperty({
        example: "Gary Kurtz, Rick McCallum",
        description: "Film producer(s)",
    })
    producer: string;

    @ApiProperty({
        example: "1977-05-25",
        description: "Release date (YYYY-MM-DD format)",
    })
    release_date: string;

    @ApiProperty({
        example: "2014-12-10T14:23:31.880000Z",
        description: "Creation timestamp in SWAPI database",
    })
    created: string;

    @ApiProperty({
        example: "2014-12-20T19:49:45.256000Z",
        description: "Last modification timestamp in SWAPI database",
    })
    edited: string;

    @ApiProperty({
        example: "https://www.swapi.tech/api/films/1",
        description: "Resource URL",
    })
    url: string;
}

export class SwapiFilmResultDto {
    @ApiProperty({ type: SwapiFilmPropertiesDto, description: "Film properties" })
    properties: SwapiFilmPropertiesDto;

    @ApiProperty({
        example: "A Star Wars Film",
        description: "Film description",
    })
    description: string;

    @ApiProperty({
        example: "5f63a36eee9fd7000499be42",
        description: "Internal SWAPI database ID",
    })
    _id: string;

    @ApiProperty({ example: "1", description: "Public unique identifier" })
    uid: string;
}

export class SwapiFilmResponseDto {
    @ApiProperty({ example: "ok", description: "Operation status message" })
    message: string;

    @ApiProperty({
        type: [SwapiFilmResultDto],
        description: "List of film resources",
    })
    result: SwapiFilmResultDto[];
}
