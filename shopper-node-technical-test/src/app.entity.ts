import { UUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { measureType } from './app.dtos';

@Entity()
export class Measure {
  @PrimaryColumn()
  measure_uuid: UUID;
  @Column()
  customer_code: string;
  @Column()
  measure_datetime: Date;
  @Column()
  measure_type: measureType;
  @Column({ default: false })
  has_confirmed: boolean;
  @Column()
  image_url: string;
  @Column()
  monthAndYear: string;
  @Column()
  measure_value: number;
}
