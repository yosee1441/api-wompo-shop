import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  status: 'PENDING' | 'COMPLETED' | 'FAILED';

  @CreateDateColumn()
  createdAt: Date;

  @Column('decimal', { nullable: true })
  amount: number;
}
