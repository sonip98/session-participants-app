import express from 'express'
import { createSession, getSessions, deleteSession, updateSession } from '../controllers/sessionController.js'
import { validateBody } from '../midllewares/validateMiddleware.js'
import { sessionValidation } from '../validations/sessionValidation.js'

const router = express.Router()

router.post('/', validateBody(sessionValidation), createSession)
router.get('/', getSessions)
router.delete('/:id', deleteSession)
router.put('/:id', updateSession)

export default router
