import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transform } from 'class-transformer';

import { Transaction } from '@/transaction/entities';
import { Customer } from '@/customer/entities';
import { OrderItem } from '@/order-item/entities';
import { StatusTransaction } from '@/wompi/utils/enums.util';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  customer: Customer;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  delivery_date: Date;

  @Column({
    type: 'enum',
    enum: StatusTransaction,
    default: StatusTransaction.PENDING,
  })
  status: StatusTransaction;

  @Column({ name: 'delivery_address', nullable: true })
  deliveryAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value))
  total: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
