import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTypeOfColumnReleaseDateToString1748905517292 implements MigrationInterface {
    name = "UpdateTypeOfColumnReleaseDateToString1748905517292";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "releaseDate" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "releaseDate" integer`);
    }
}
