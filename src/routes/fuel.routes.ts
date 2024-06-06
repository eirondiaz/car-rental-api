import {
  getFuels,
  getFuel,
  createFuel,
  updateFuel,
  deleteFuel,
} from './../controllers/fuel.controller'
import { Router } from 'express'

const router = Router()

router.get('/', getFuels)
router.get('/:id', getFuel)
router.post('/', createFuel)
router.put('/:id', updateFuel)
router.delete('/:id', deleteFuel)

export default router
