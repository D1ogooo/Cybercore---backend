import express from 'express'
const router = express.Router()
import { UsersController } from '../controllers/UsersController'
import { ProductsController } from '../controllers/ProductsController';
import { CheckToken } from '../middlewares/CheckToken'
const UsersControllers = new UsersController();
const ProductsControllers = new ProductsController(); 

router.post('/users/session', UsersControllers.auth) // rota de login
router.post('/users/create', UsersControllers.create) // rota de registro

router.post('/products/create', CheckToken , ProductsControllers.create) // registrar algum produto

export { router }