import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { VehicleType } from './VehicleType'
import { Model } from './Model'
import { Brand } from './Brand'
import { Fuel } from './Fuel'

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @Column()
  chasisNumber: number

  @Column()
  motorNumber: number

  @Column()
  plateNumber: string

  @ManyToOne((type) => Brand, (brand) => brand.id, { onDelete: 'CASCADE' })
  brand!: Brand

  @ManyToOne((type) => Model, (model) => model.id)
  model!: Model

  @ManyToOne((type) => VehicleType, (type) => type.id, { onDelete: 'CASCADE' })
  type!: VehicleType

  @ManyToOne((type) => Fuel, (fuel) => fuel.id)
  fuel!: Fuel

  @Column({ default: false })
  isRented: boolean

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
