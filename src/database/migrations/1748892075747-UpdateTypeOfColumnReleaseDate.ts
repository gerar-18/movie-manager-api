import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTypeOfColumnReleaseDate1748892075747 implements MigrationInterface {
    name = "UpdateTypeOfColumnReleaseDate1748892075747";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "releaseDate" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "releaseDate" character varying`);
    }
}
