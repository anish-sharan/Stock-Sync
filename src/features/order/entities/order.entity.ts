import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@core/data/entity/baseEntity.model';
import CompanyEntity from '@features/company/entities/company.entity';
import ProductEntity from '@features/product/entities/product.entity';
import { OrderStatus } from '../data/enum/order.enum';
import { IOrder } from '../order.interface';

@Entity('orders')
export default class OrderEntity extends BaseEntity implements IOrder {
  @Column({ type: 'numeric' })
  quantity!: number;

  @Column({ type: 'numeric' })
  price!: number;

  @Column({ type: 'varchar', length: 20, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @ManyToOne(() => CompanyEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company!: CompanyEntity;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;
}
