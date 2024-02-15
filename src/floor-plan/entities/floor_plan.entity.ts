import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class FloorPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'img_url', nullable: false })
  imgUrl: string;

  @Column({ nullable: false })
  location: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deleted: Date;

  @Column({ name: 'modified_by', type: 'uuid' })
  modifiedBy: string;
}
