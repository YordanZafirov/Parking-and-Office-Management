import { Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Spot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(2, 64, { message: 'Name must be between 2 and 64 characters long' })
  name: string;

  @Column()
  @Length(2, 256, {
    message: 'Description must be between 2 and 256 characters long',
  })
  description: string;

  @Column({ name: 'is_permanent', default: false })
  isPermanent: boolean;

  @Column()
  top: number;

  @Column()
  left: number;

  @Column({ name: 'spot_type_id', type: 'uuid', nullable: false })
  spotTypeId: string;

  @Column({ name: 'floor_plan_id', type: 'uuid', nullable: false })
  floorPlanId: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @Column({ name: 'modified_by', nullable: false })
  modifiedBy: string;
}
