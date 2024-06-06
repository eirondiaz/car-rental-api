import {
  getRent,
  getRents,
  createRent,
  updateRent,
  deleteRent,
} from '../controllers/rent.controller'
import { Router } from 'express'

const router = Router()

router.get('/', getRents)
router.get('/:id', getRent)
router.post('/', createRent)
router.put('/:id', updateRent)
router.delete('/:id', deleteRent)

export default router
