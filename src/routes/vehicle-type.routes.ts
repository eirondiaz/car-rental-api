import {
  getVehicleTypes,
  getVehicleType,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
} from './../controllers/vehicle-type.controller'
import { Router } from 'express'

const router = Router()

router.get('/', getVehicleTypes)
router.get('/:id', getVehicleType)
router.post('/', createVehicleType)
router.put('/:id', updateVehicleType)
router.delete('/:id', deleteVehicleType)

export default router
