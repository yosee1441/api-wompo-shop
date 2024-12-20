import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Image, Size, Tag } from '@/entities';
import { OrderItem } from '@/order-item/entities';
import { Stock } from '@/stock/entities/stock.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  iva: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  type: string;

  @Column()
  gender: string;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images: Image[];

  @OneToMany(() => Size, (size) => size.product, { cascade: true })
  sizes: Size[];

  @OneToMany(() => Tag, (tag) => tag.product, { cascade: true })
  tags: Tag[];

  @OneToMany(() => OrderItem, (detail) => detail.product)
  orderItems: OrderItem[];

  @OneToMany(() => Stock, (stock) => stock.product)
  stocks: Stock[];

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
