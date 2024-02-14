import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1707835683091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '64',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '512',
          },
          {
            name: 'role',
            type: 'enum',
            enumName: 'user_role',
            enum: ['ADMIN', 'EMPLOYEE'],
            default: `'EMPLOYEE'`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
