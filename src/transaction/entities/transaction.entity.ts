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
import { Order } from '@/order/entities';
import { CreateTransactionResponse } from '@/wompi/interfaces';

interface Item {
  sizeId: number;
  productId: number;
}

interface Items extends CreateTransactionResponse {
  items: Item[];
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  reference_number: string;

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

  @Column('jsonb', {
    name: 'payment_response',
    nullable: false,
    default: {},
  })
  paymentResponse: Items;

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
