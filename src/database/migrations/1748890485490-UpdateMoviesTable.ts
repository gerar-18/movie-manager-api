import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMoviesTable1748890485490 implements MigrationInterface {
    name = "UpdateMoviesTable1748890485490";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "release_date" TO "releaseDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "releaseDate" TO "release_date"`);
    }
}
