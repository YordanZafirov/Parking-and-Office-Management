import { Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('spot_type')
export class SpotType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Length(2, 64, { message: 'Name must be between 2 and 64 characters long' })
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'uuid', name: 'modified_by', nullable: false })
  modifiedBy: string;
}
