import { DataSource } from 'typeorm'
import {
  Brand,
  Client,
  Employee,
  Fuel,
  Model,
  Vehicle,
  VehicleType,
  Inspection,
  Rent,
} from './model'
import * as dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || '',
  port: Number(process.env.DB_PORT) || 0,
  username: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  database: process.env.NAME || '',
  synchronize: true,
  // logging: true,
  entities: [
    Brand,
    VehicleType,
    Model,
    Fuel,
    Vehicle,
    Client,
    Employee,
    Inspection,
    Rent,
  ],
})
