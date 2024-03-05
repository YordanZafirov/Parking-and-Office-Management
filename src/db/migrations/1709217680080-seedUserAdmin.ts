import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'node:util';
import { User } from '../../user/user.entity';
import { UserRoles } from '../../user/user-role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';
const scrypt = promisify(_scrypt);
// eslint-disable-next-line @typescript-eslint/no-var-requires
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
