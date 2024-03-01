import { Location } from '../../location/entities/location.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { LocationSeed } from '../seeds/location.seed';

export class SeedLocation1709220178964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.getRepository(Location).save(LocationSeed);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
