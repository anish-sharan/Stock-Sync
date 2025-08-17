import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import CompanyEntity from '@features/company/entities/company.entity';
import ProductEntity from '@features/product/entities/product.entity';
import { BaseEntity } from '@core/data/entity/baseEntity.model';
import { IStock } from '../stock.interfaces';

@Entity('stocks')
export default class StockEntity extends BaseEntity implements IStock {
    @Column({ type: 'numeric' })
    quantity!: number;

    @Column({ type: 'numeric', name: 'avg_price' })
    avgPrice!: number;

    @Column({ type: 'numeric', name: 'current_price', nullable: true })
    currentPrice!: number | null;

    @ManyToOne(() => ProductEntity, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product!: ProductEntity;

    @ManyToOne(() => CompanyEntity, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company?: CompanyEntity;
}
