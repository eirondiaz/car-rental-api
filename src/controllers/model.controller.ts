import { Request, Response } from 'express'
import { Brand, Model } from '../model'
import { AppDataSource as dbConfig } from '../db'

interface ModelBody {
  description: string
  brandId: string
}

export const getModels = async (req: Request, res: Response) => {
  const { brandId } = req.query

  try {
    const models = await Model.find({
      where: { ...(brandId && { brand: { id: String(brandId) } }) },
      relations: ['brand'],
    })
    return res.json({ data: models })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const getModel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const model = await Model.findOneBy({ id })

    if (!model) return res.status(404).json({ message: 'Model not found' })

    return res.json({ data: model })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const createModel = async (
  req: Request<unknown, unknown, ModelBody>,
  res: Response
) => {
  const { description, brandId } = req.body
  const model = new Model()

  const brand = await Brand.findOneBy({ id: brandId })
  if (!brand) return res.status(400).json({ msg: 'brand not found' })

  model.description = description
  model.brand = brand

  await model.save()
  return res.json({ data: model })
}

export const updateModel = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const model = await Model.findOneBy({ id })
    if (!model) return res.status(404).json({ message: 'Not model found' })
    const nModel = new Model()

    const brand = await Brand.findOneBy({ id: req.body.brandId })
    if (!brand) return res.status(400).json({ msg: 'brand not found' })

    const body = req.body
    body.id = id
    body.brand = brand

    await dbConfig.getRepository(Model).save({
      ...body,
      ...nModel,
    })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const deleteModel = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await Model.delete({ id })

    if (result.affected === 0)
      return res.status(404).json({ message: 'Model not found' })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
