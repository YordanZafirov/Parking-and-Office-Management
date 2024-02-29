import { SpotTypesSeed } from 'db/seeds/spot-types.seed';
import { SpotType } from 'src/spot-type/entities/spot-type.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSpotTypes1709219992400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.getRepository(SpotType).save(SpotTypesSeed);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
