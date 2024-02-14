import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSchemaTable1707836036749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schema',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '64',
          },
          {
            name: 'img_url',
            type: 'varchar',
            length: '512',
          },
          {
            name: 'location_id',
            type: 'uuid',
          },
          {
            name: 'schema_type_id',
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
      'schema',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'location',
      }),
    );

    await queryRunner.createForeignKey(
      'schema',
      new TableForeignKey({
        columnNames: ['schema_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'schema_type',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
