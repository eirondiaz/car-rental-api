import {
  getModel,
  createModel,
  updateModel,
  deleteModel,
} from './../controllers/model.controller'
import { Router } from 'express'
import { getModels } from '../controllers/model.controller'

const router = Router()

router.get('/', getModels)
router.get('/:id', getModel)
router.post('/', createModel)
router.put('/:id', updateModel)
router.delete('/:id', deleteModel)

export default router
