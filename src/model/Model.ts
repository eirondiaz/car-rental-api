import { Brand } from './Brand'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

@Entity()
export class Model extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @ManyToOne((type) => Brand, (brand) => brand.id, { onDelete: 'CASCADE' })
  brand!: Brand

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
