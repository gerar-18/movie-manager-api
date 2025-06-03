import { ApiProperty } from "@nestjs/swagger";

export class SyncResponseDto {
    @ApiProperty({
        example: "Synchronization completed successfully",
        description: "Message indicating the result of the synchronization",
    })
    message: string;

    @ApiProperty({
        example: 3,
        description: "Number of new movies added to the database",
    })
    newMovies: number;

    @ApiProperty({
        example: 10,
        description: "Number of existing movies in the database",
    })
    existingMovies: number;

    @ApiProperty({
        example: ["Movie A", "Movie B", "Movie C"],
        description: "Titles of movies that were added during the synchronization",
        type: [String],
        required: false,
    })
    addedTitles?: string[];

    @ApiProperty({
        example: "2023-08-15T14:30:00.000Z",
        description: "Timestamp of when the synchronization was performed",
    })
    timestamp: Date;

    constructor(partial: Partial<SyncResponseDto>) {
        Object.assign(this, partial);
    }
}
