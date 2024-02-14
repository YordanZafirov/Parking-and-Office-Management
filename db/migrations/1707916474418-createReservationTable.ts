import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateReservationTable1707836062685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reservation',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'start',
            type: 'timestamp',
          },
          {
            name: 'end',
            type: 'timestamp',
          },
          {
            name: 'comment',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'spot_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
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
          {
            name: 'modified_by',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'reservation',
      new TableForeignKey({
        columnNames: ['spot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'spot',
      }),
    );

    await queryRunner.createForeignKey(
      'reservation',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
