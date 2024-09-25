import express from 'express'
const router = express.Router()
import { UsersController } from '../controllers/UsersController'
import { ProductsController } from '../controllers/ProductsController';
import { CheckToken } from '../middlewares/CheckToken'
import { upload } from '../configs/multerConfig';
import { FavoriteController } from '../controllers/FavoriteController';
const UsersControllers = new UsersController();
const ProductsControllers = new ProductsController(); 
const FavoriteControllers = new FavoriteController(); 

router.post('/users/session', UsersControllers.auth) // rota de login
router.post('/users/create', UsersControllers.create) // rota de registro

router.get('/products/list', CheckToken, ProductsControllers.list)
router.post('/products/create', upload.single('image') , CheckToken , ProductsControllers.create) // registrar algum produto
router.post('/products/delete/:id', CheckToken , ProductsControllers.delete) // registrar algum produto

router.post('/favorites/list', CheckToken, FavoriteControllers.getall) // listar os favoritos

export { router }