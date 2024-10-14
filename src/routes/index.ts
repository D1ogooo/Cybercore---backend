import express, { type RequestHandler } from "express";
const router = express.Router();
import { UsersController } from "../controllers/UsersController";
import { ProductsController } from "../controllers/ProductsController";
import { CheckToken } from "../middlewares/CheckToken";
import { upload } from "../configs/multerConfig";
import { FavoriteController } from "../controllers/FavoriteController";
import { CartController } from "../controllers/CartController";
const UsersControllers = new UsersController();
const ProductsControllers = new ProductsController();
const FavoriteControllers = new FavoriteController();
const CartControllers = new CartController();

router.post("/users/session", UsersControllers.auth); // rota de login
router.post("/users/create", UsersControllers.create); // rota de registro
router.post(
	"/users/updateImage",
	upload.single("image"),
	CheckToken,
	UsersControllers.updateImage as RequestHandler,
);

router.get("/products/list", CheckToken, ProductsControllers.list); // listar todos os usuários
router.get("/products/product/:id", CheckToken, ProductsControllers.listUser); // lista usuario expecífico
router.post(
	"/products/create",
	upload.single("image"),
	CheckToken,
	ProductsControllers.create,
); // registrar algum produto
router.post("/products/delete/:id", CheckToken, ProductsControllers.delete); // registrar algum produto

router.get("/favorites/list", CheckToken, FavoriteControllers.getall); // listar os favoritos que o usuario tem
router.post(
	"/favorites/deleteFavorite/:id",
	CheckToken,
	FavoriteControllers.deleteFavorite,
);
router.post(
	"/favorites/favorite/:id",
	CheckToken,
	FavoriteControllers.favoriteItem,
);

router.post("/cart/create", CheckToken, CartControllers.create); // botar um produto no carrinho

export { router };
