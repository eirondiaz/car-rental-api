import { Request, Response } from 'express'
import { Client } from '../model'
import { AppDataSource as dbConfig } from '../db'

interface ClientBody {
  name: string
  cedula: string
  creditCard: string
  creditLimit: string
  type: string
}

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find()
    return res.json({ data: clients })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const getClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const client = await Client.findOneBy({ id })

    if (!client) return res.status(404).json({ message: 'client not found' })

    return res.json({ data: client })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const createClient = async (
  req: Request<unknown, unknown, ClientBody>,
  res: Response
) => {
  const { name, cedula, creditCard, creditLimit, type } = req.body
  const client = new Client()

  client.name = name
  client.cedula = cedula
  client.creditCard = creditCard
  client.creditLimit = creditLimit
  client.type = type

  await client.save()
  return res.json({ data: client })
}

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const client = await Client.findOneBy({ id })
    if (!client) return res.status(404).json({ message: 'Not client found' })
    const nClient = new Client()

    const body = req.body
    body.id = id

    await dbConfig.getRepository(Client).save({
      ...body,
      ...nClient,
    })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await Client.delete({ id })

    if (result.affected === 0)
      return res.status(404).json({ message: 'Client not found' })

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
