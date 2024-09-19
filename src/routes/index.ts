import express from 'express'
import { UsersController } from '../controllers/UsersController'
const UsersControllers = new UsersController();
const router = express.Router()

router.post('/users/session', UsersControllers.auth) // rota de login
router.post('/users/create', UsersControllers.create) // rota de registro

export { router }