import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEMEASURE1724801957611 implements MigrationInterface {
    name = 'CREATEMEASURE1724801957611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "measure" ("measure_uuid" varchar PRIMARY KEY NOT NULL, "customer_code" varchar NOT NULL, "measure_datetime" datetime NOT NULL, "measure_type" varchar NOT NULL, "has_confirmed" boolean NOT NULL DEFAULT (0), "image_url" varchar NOT NULL, "monthAndYear" varchar NOT NULL, "measure_value" integer NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "measure"`);
    }

}
