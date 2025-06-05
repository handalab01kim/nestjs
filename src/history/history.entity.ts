import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  idx: number; // SERIAL PRIMARY KEY

  @Column({ length: 512, default: '' })
  url: string;

  @CreateDateColumn({ type: 'timestamp' })
  time: Date; // DEFAULT now()

  @Column({ type: 'int', default: 0 })
  bearing: number;

  @Column({ length: 32, default: '' })
  state: string;
}
