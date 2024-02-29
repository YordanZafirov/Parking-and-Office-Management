import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'node:util';
import { User } from 'src/user/entities/user.entity';
import { UserRoles } from 'src/user/user-role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';
const scrypt = promisify(_scrypt);
require('dotenv').config();

export class SeedUserAdmin1709217680080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userEmail = process.env.email;
    const userPassword = process.env.password;
    const modifiedBy = process.env.modifiedBy;

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(userPassword, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const userAdmin = {
      email: userEmail,
      password: hashedPassword,
      role: UserRoles.ADMIN,
      modifiedBy: modifiedBy,
    };

    await queryRunner.connection.getRepository(User).save(userAdmin);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
