import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Customer } from '@/customer/entities';
import { RequestType } from '@/request-type/entities';
import { TransactionDetail } from '@/order-items/entities';
import { Order } from '@/order/entities';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.transactions, {
    onDelete: 'CASCADE',
  })
  customer: Customer;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => RequestType, (requestType) => requestType.transactions)
  requestType: RequestType;

  @OneToMany(() => Order, (order) => order.transaction)
  orders: Order[];

  @OneToMany(() => TransactionDetail, (detail) => detail.transaction)
  details: TransactionDetail[];

  @Column('jsonb', {
    name: 'json_response',
    nullable: false,
    default: {},
  })
  jsonResponse: any | any[];

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
}
