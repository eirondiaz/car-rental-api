import { Request, Response } from 'express'
import { Brand, Model, Vehicle, VehicleType, Fuel } from '../model'
import { AppDataSource as dbConfig } from '../db'

interface VehicleBody {
  description: string
  chasisNumber: number
  motorNumber: number
  plateNumber: string
  brandId: string
  modelId: string
  typeId: string
  fuelId: string
}

export const getVehicles = async (req: Request, res: Response) => {
  const { isNotRented } = req.query

  try {
    const vehicles = await Vehicle.find({
      where: { ...(isNotRented == '1' && { isRented: false }) },
      relations: ['brand', 'model', 'type', 'fuel'],
    })
    return res.json({ data: vehicles })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const vehicle = await Vehicle.findOneBy({ id })

    if (!vehicle) return res.status(404).json({ message: 'vehicle not found' })

    return res.json({ data: vehicle })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const createVehicle = async (
  req: Request<unknown, unknown, VehicleBody>,
  res: Response
) => {
  const {
    description,
    brandId,
    chasisNumber,
    motorNumber,
    plateNumber,
    fuelId,
    typeId,
    modelId,
  } = req.body
  const vehicle = new Vehicle()

  const brand = await Brand.findOneBy({ id: brandId })
  if (!brand) return res.status(400).json({ msg: 'brand not found' })

  const fuel = await Fuel.findOneBy({ id: fuelId })
  if (!fuel) return res.status(400).json({ msg: 'fuel not found' })

  const type = await VehicleType.findOneBy({ id: typeId })
  if (!type) return res.status(400).json({ msg: 'vehicle type not found' })

  const model = await Model.findOneBy({ id: modelId })
  if (!model) return res.status(400).json({ msg: 'model not found' })

  vehicle.description = description
  vehicle.chasisNumber = chasisNumber
  vehicle.motorNumber = motorNumber
  vehicle.plateNumber = plateNumber
  vehicle.brand = brand
  vehicle.fuel = fuel
  vehicle.type = type
  vehicle.model = model

  await vehicle.save()
  return res.json({ data: vehicle })
}

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const vehicle = await Vehicle.findOneBy({ id })
    if (!vehicle) return res.status(404).json({ message: 'Not vehicle found' })
    const nVehicle = new Vehicle()

    const brand = await Brand.findOneBy({ id: req.body.brandId })
    if (!brand) return res.status(400).json({ msg: 'brand not found' })

    const fuel = await Fuel.findOneBy({ id: req.body.fuelId })
    if (!fuel) return res.status(400).json({ msg: 'fuel not found' })

    const type = await VehicleType.findOneBy({ id: req.body.typeId })
    if (!type) return res.status(400).json({ msg: 'vehicle type not found' })

    const model = await Model.findOneBy({ id: req.body.modelId })
    if (!model) return res.status(400).json({ msg: 'model not found' })

    const body = req.body
    body.id = id
    body.brand = brand
    body.fuel = fuel
    body.type = type
    body.model = model

    await dbConfig.getRepository(Vehicle).save({
      ...body,
      ...nVehicle,
    })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await Vehicle.delete({ id })

    if (result.affected === 0)
      return res.status(404).json({ message: 'Vehicle not found' })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
