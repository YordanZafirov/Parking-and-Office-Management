import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'spot_id', type: 'uuid', nullable: false })
  spotId: string;
}
