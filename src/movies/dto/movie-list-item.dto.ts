import { ApiProperty } from "@nestjs/swagger";

export class MovieListItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;
}
