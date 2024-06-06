import { Router } from 'express'
import BrandRouter from './brand.routes'
import ClientRouter from './client.routes'
import EmployeeRouter from './employee.routes'
import FuelRouter from './fuel.routes'
import ModelRouter from './model.routes'
import VehicleTypeRouter from './vehicle-type.routes'
import VehicleRouter from './vehicle.routes'
import RentRouter from './rent.routes'

const router = Router()

router.use('/clients', ClientRouter)
router.use('/employees', EmployeeRouter)
router.use('/fuels', FuelRouter)
router.use('/models', ModelRouter)
router.use('/vehicle-types', VehicleTypeRouter)
router.use('/vehicles', VehicleRouter)
router.use('/brands', BrandRouter)
router.use('/rents', RentRouter)

export default router
