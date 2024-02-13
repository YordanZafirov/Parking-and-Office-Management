import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSpotTable1707836040675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'spot',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'top',
            type: 'float',
          },
          {
            name: 'left',
            type: 'float',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '64',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'is_permanent',
            type: 'boolean',
            default: false,
          },
          {
            name: 'spot_type_id',
            type: 'uuid',
          },
          {
            name: 'schema_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'spot',
      new TableForeignKey({
        columnNames: ['schema_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'schema',
      }),
    );

    await queryRunner.createForeignKey(
      'spot',
      new TableForeignKey({
        columnNames: ['spot_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'spot_type',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
