import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Image } from './image.entity';
import { Size } from './size.entity';
import { Tag } from './tag.entity';

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

  @Column()
  inStock: number;

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
}
