import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init implements MigrationInterface {
  name = 'Init';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "debts" ("id" SERIAL NOT NULL, "institution" character varying NOT NULL, "amount" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "clientId" integer, CONSTRAINT "PK_4bd9f54aab9e59628a3a2657fa1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "rut" character varying NOT NULL, "salary" integer NOT NULL, "savings" integer NOT NULL, "age" integer NOT NULL, "undueDebt" integer NOT NULL, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."messages_role_enum" AS ENUM('client', 'agent')`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "role" "public"."messages_role_enum" NOT NULL, "sentAt" TIMESTAMP NOT NULL, "clientId" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "debts" ADD CONSTRAINT "FK_d8ee440220d45a94bf1238b48a0" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_0b420b51bc50f348cc866e95db9" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_0b420b51bc50f348cc866e95db9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "debts" DROP CONSTRAINT "FK_d8ee440220d45a94bf1238b48a0"`,
    );
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TYPE "public"."messages_role_enum"`);
    await queryRunner.query(`DROP TABLE "clients"`);
    await queryRunner.query(`DROP TABLE "debts"`);
  }
}
