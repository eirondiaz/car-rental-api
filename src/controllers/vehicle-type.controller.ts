import { Request, Response } from 'express'
import { VehicleType } from '../model'
import { AppDataSource as dbConfig } from '../db'

interface VehicleTypeBody {
  description: string
}

export const getVehicleTypes = async (req: Request, res: Response) => {
  try {
    const vehicleTypes = await VehicleType.find()
    return res.json({ data: vehicleTypes })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const getVehicleType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const vehicleType = await VehicleType.findOneBy({ id })

    if (!vehicleType)
      return res.status(404).json({ message: 'vehicleType not found' })

    return res.json({ data: vehicleType })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const createVehicleType = async (
  req: Request<unknown, unknown, VehicleTypeBody>,
  res: Response
) => {
  try {
    const { description } = req.body
    const vehicleType = new VehicleType()

    vehicleType.description = description

    await vehicleType.save()
    return res.json({ data: vehicleType })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const updateVehicleType = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const vehicleType = await VehicleType.findOneBy({ id })
    if (!vehicleType)
      return res.status(404).json({ message: 'Not vehicleType found' })

    await VehicleType.update({ id }, req.body)

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const deleteVehicleType = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const vehicleType = await VehicleType.findOneBy({ id })
    if (!vehicleType)
      return res.status(404).json({ message: 'Not vehicleType found' })
    const nVehicleType = new VehicleType()

    const body = req.body
    body.id = id

    await dbConfig.getRepository(VehicleType).save({
      ...body,
      ...nVehicleType,
    })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
