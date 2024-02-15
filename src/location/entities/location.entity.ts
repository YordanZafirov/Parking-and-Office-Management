import { Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Length(2, 64, { message: 'Name must be between 2 and 64 characters long' })
  name: string;

  @Column({ nullable: false })
  @Length(2, 64, { message: 'City must be between 2 and 64 characters long' })
  city: string;

  @Column({ nullable: false })
  @Length(5, 128, {
    message: 'Address must be between 2 and 64 characters long',
  })
  address: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'created_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'created_at' })
  deletedAt: Date;

  @Column({ type: 'uuid', name: 'modified_by', nullable: false })
  modifiedBy: string;
}
