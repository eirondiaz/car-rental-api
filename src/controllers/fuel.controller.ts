import { Request, Response } from 'express'
import { Fuel } from '../model'
import { AppDataSource as dbConfig } from '../db'

interface FuelBody {
  description: string
}

export const getFuels = async (req: Request, res: Response) => {
  try {
    const fuels = await Fuel.find()
    return res.json({ data: fuels })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const getFuel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const fuel = await Fuel.findOneBy({ id })

    if (!fuel) return res.status(404).json({ message: 'fuel not found' })

    return res.json({ data: fuel })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const createFuel = async (
  req: Request<unknown, unknown, FuelBody>,
  res: Response
) => {
  const { description } = req.body
  const fuel = new Fuel()

  fuel.description = description

  await fuel.save()
  return res.json({ data: fuel })
}

export const updateFuel = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const fuel = await Fuel.findOneBy({ id })
    if (!fuel) return res.status(404).json({ message: 'Not fuel found' })
    const nFuel = new Fuel()

    const body = req.body
    body.id = id

    await dbConfig.getRepository(Fuel).save({
      ...body,
      ...nFuel,
    })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const deleteFuel = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await Fuel.delete({ id })

    if (result.affected === 0)
      return res.status(404).json({ message: 'Fuel not found' })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
