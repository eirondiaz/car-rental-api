import { Request, Response } from 'express'
import { Vehicle, Rent, Employee, Client, Inspection } from '../model'
import { AppDataSource as dbConfig } from '../db'

interface RentBody {
  rentDate: string
  returnDate: string
  amountPerDay: number
  totalDays: number
  comments: string
  vehicleId: string
  employeeId: string
  clientId: string
  inspection: InspectionBody
}

interface InspectionBody {
  hasScratch: boolean
  fuelAmount: string
  hasSpareTire: boolean
  hasJack: boolean
  hasBrokenGlass: boolean
  frontLeftTireStatus: boolean
  frontRightTireStatus: boolean
  backLeftTireStatus: boolean
  backRightTireStatus: boolean
  vehicleId: string
  employeeId: string
  clientId: string
}

export const getRents = async (req: Request, res: Response) => {
  const { vehicleId, clientId, rentDate } = req.query

  try {
    const rents = await Rent.find({
      where: {
        ...(vehicleId && { vehicle: { id: String(vehicleId) } }),
        ...(clientId && { client: { id: String(clientId) } }),
        ...(rentDate && { rentDate: String(rentDate) }),
      },
      relations: [
        'vehicle',
        'employee',
        'client',
        'inspection',
        'inspection.employee',
        'inspection.vehicle',
        'inspection.client',
      ],
    })
    return res.json({ data: rents })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const getRent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const rent = await Rent.findOneBy({ id })

    if (!rent) return res.status(404).json({ message: 'rent not found' })

    return res.json({ data: rent })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const createRent = async (
  req: Request<unknown, unknown, RentBody>,
  res: Response
) => {
  const {
    rentDate,
    returnDate,
    amountPerDay,
    totalDays,
    comments,
    vehicleId,
    employeeId,
    clientId,
    inspection,
  } = req.body
  const rent = new Rent()

  const vehicle = await Vehicle.findOneBy({ id: vehicleId })
  if (!vehicle) return res.status(400).json({ msg: 'vehicle not found' })

  const employee = await Employee.findOneBy({ id: employeeId })
  if (!employee) return res.status(400).json({ msg: 'employee not found' })

  const client = await Client.findOneBy({ id: clientId })
  if (!client) return res.status(400).json({ msg: 'client not found' })

  rent.rentDate = rentDate
  rent.returnDate = returnDate
  rent.amountPerDay = amountPerDay
  rent.totalDays = totalDays
  rent.comments = comments
  rent.vehicle = vehicle
  rent.employee = employee
  rent.client = client

  const inspect = await createInspection(inspection)

  if (!inspect) {
    return res.status(400).json({ msg: 'create inspection error' })
  }

  rent.inspection = inspect

  await updateVehicleRentStatus(vehicleId)
  await rent.save()
  return res.json({ data: vehicle })
}

export const updateRent = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const rent = await Rent.findOneBy({ id })
    if (!rent) return res.status(404).json({ message: 'rent not found' })
    const nRent = new Rent()

    const vehicle = await Vehicle.findOneBy({ id: req.body.vehicleId })
    if (!vehicle) return res.status(400).json({ msg: 'vehicle not found' })

    const employee = await Employee.findOneBy({ id: req.body.employeeId })
    if (!employee) return res.status(400).json({ msg: 'employee not found' })

    const client = await Client.findOneBy({ id: req.body.clientId })
    if (!client) return res.status(400).json({ msg: 'client type not found' })

    const body = req.body
    body.id = id
    body.vehicle = vehicle
    body.employee = employee
    body.client = client

    await dbConfig.getRepository(Rent).save({
      ...body,
      ...nRent,
    })

    if (body?.returnDate) await updateVehicleRentStatus(vehicle.id)
    await updateInspection(req.body.inspection, req.body.inspection.id)

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export const deleteRent = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const rent = await Rent.findOne({ where: { id }, relations: ['vehicle'] })
    const result = await Rent.delete({ id })

    if (result.affected === 0)
      return res.status(404).json({ message: 'Rent not found' })

    await updateVehicleRentStatus(rent?.vehicle?.id || '')

    return res.sendStatus(204)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

const createInspection = async (
  payload: InspectionBody
): Promise<Inspection | null> => {
  const inspection = new Inspection()

  const vehicle = await Vehicle.findOneBy({ id: payload.vehicleId })
  if (!vehicle) return null

  const employee = await Employee.findOneBy({ id: payload.employeeId })
  if (!employee) return null

  const client = await Client.findOneBy({ id: payload.clientId })
  if (!client) return null

  inspection.hasScratch = payload.hasScratch
  inspection.fuelAmount = payload.fuelAmount
  inspection.hasSpareTire = payload.hasSpareTire
  inspection.hasJack = payload.hasJack
  inspection.hasBrokenGlass = payload.hasBrokenGlass
  inspection.frontLeftTireStatus = payload.frontLeftTireStatus
  inspection.frontRightTireStatus = payload.frontRightTireStatus
  inspection.backLeftTireStatus = payload.backLeftTireStatus
  inspection.backRightTireStatus = payload.backRightTireStatus
  inspection.employee = employee
  inspection.vehicle = vehicle
  inspection.client = client

  return await inspection.save()
}

const updateInspection = async (payload: InspectionBody, id: string) => {
  try {
    const inspection = await Inspection.findOneBy({ id })
    if (!inspection) return
    const nInspect = new Inspection()

    const vehicle = await Vehicle.findOneBy({ id: payload.vehicleId })
    if (!vehicle) return

    const employee = await Employee.findOneBy({ id: payload.employeeId })
    if (!employee) return

    const client = await Client.findOneBy({ id: payload.clientId })
    if (!client) return

    const body = {
      id,
      ...payload,
      vehicle,
      client,
      employee,
    }

    await dbConfig.getRepository(Inspection).save({
      ...body,
      ...nInspect,
    })
  } catch (error) {
    console.log(error)
  }
}

const updateVehicleRentStatus = async (id: string) => {
  const vehicle = await Vehicle.findOneBy({ id })
  if (!vehicle) return
  //const nVehicle = new Vehicle()

  vehicle.isRented = !vehicle.isRented

  await dbConfig.getRepository(Vehicle).save({
    ...vehicle,
  })
}
