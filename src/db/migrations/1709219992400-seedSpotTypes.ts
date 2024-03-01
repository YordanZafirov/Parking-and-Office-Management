import { SpotType } from '../../spot-type/entities/spot-type.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { SpotTypesSeed } from '../seeds/spot-types.seed';

export class SeedSpotTypes1709219992400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.getRepository(SpotType).save(SpotTypesSeed);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
