import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMoviesTable1748889329291 implements MigrationInterface {
    name = "CreateMoviesTable1748889329291";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "episodeId" integer, "openingCrawl" text, "director" character varying, "producer" character varying, "release_date" character varying, "isFromSwapi" boolean NOT NULL DEFAULT false, "swapiId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bb4da3e133f4aa821cdc173d406" UNIQUE ("swapiId"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "movie"`);
    }
}
