import { Vehicle } from './Vehicle'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { Employee } from './Employee'
import { Client } from './Client'

@Entity()
export class Inspection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne((type) => Vehicle, (vehicle) => vehicle.id, { onDelete: 'CASCADE' })
  vehicle!: Vehicle

  @ManyToOne((type) => Employee, (employee) => employee.id)
  employee!: Employee

  @ManyToOne((type) => Client, (client) => client.id)
  client!: Client

  @Column({ default: false })
  hasScratch: boolean

  @Column()
  fuelAmount: string

  @Column({ default: false })
  hasSpareTire: boolean

  @Column({ default: false })
  hasJack: boolean

  @Column({ default: false })
  hasBrokenGlass: boolean

  @Column({ default: false })
  frontLeftTireStatus: boolean

  @Column({ default: false })
  frontRightTireStatus: boolean

  @Column({ default: false })
  backLeftTireStatus: boolean

  @Column({ default: false })
  backRightTireStatus: boolean

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
