import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnToUserTable1708502432428 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'img_url',
        type: 'varchar',
        length: '512',
        isNullable: true,
      }),
    ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
