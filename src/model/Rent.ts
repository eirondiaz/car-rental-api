import { Inspection } from './Inspection'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { Vehicle } from './Vehicle'
import { Employee } from './Employee'
import { Client } from './Client'

@Entity()
export class Rent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne((type) => Vehicle, (vehicle) => vehicle.id, {
    onDelete: 'CASCADE',
  })
  vehicle!: Vehicle

  @ManyToOne((type) => Employee, (employee) => employee.id, {
    onDelete: 'CASCADE',
  })
  employee!: Employee

  @ManyToOne((type) => Client, (client) => client.id, { onDelete: 'CASCADE' })
  client!: Client

  @ManyToOne((type) => Inspection, (inspection) => inspection.id)
  inspection!: Inspection

  @Column()
  rentDate: string

  @Column({ nullable: true })
  returnDate: string

  @Column()
  amountPerDay: number

  @Column()
  totalDays: number

  @Column()
  comments: string

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
