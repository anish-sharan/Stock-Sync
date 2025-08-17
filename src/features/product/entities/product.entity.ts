import { BaseEntity } from '@core/data/entity/baseEntity.model';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'products' })
export default class ProductEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;
}
