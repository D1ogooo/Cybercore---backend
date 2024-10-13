import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { jwtConfig } from "../configs/auth";

class FavoriteController {
	async getall(req: Request, res: Response) {
		try {
			const authHeader = req.headers.authorization;
			const token = authHeader?.split(" ")[1];

			if (!token) {
				return res.status(401).json({ message: "Acesso negado" });
			}

			const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;
			const favorites = await prisma.Favorite.findMany({
				where: {
					userId: decoded.id,
				},
				include: {
					product: true,
				},
			});
			res.status(200).json({ favorites });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: "Dados inválidos" });
		}
	}

	async deleteFavorite(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const authHeader = req.headers.authorization;
			const token = authHeader?.split(" ")[1];
			const idProduct = id;

			if (!token) {
				return res.status(401).json({ message: "Acesso negado" });
			}
			console.log(idProduct);
			await prisma.Favorite.deleteMany({
				where: {
					productId: idProduct,
				},
			});
			res.status(200).json({ sucess: "item deletado 🛒" });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: "Dados inválidos" });
		}
	}

	async favoriteItem(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const authHeader = req.headers.authorization;
			const token = authHeader?.split(" ")[1];
			if (!token) {
				return res.status(401).json({ message: "Acesso negado" });
			}

			const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;

			if (typeof decoded.id !== "string") {
				return res.status(401).json({ message: "Token inválido" });
			}

			const productExists = await prisma.product.findUnique({
				where: {
					id: id,
				},
			});

			if (!productExists) {
				return res.status(404).json({ message: "Produto não encontrado" });
			}

			const favoriteUserCreate = await prisma.favorite.create({
				data: {
					userId: decoded.id,
					productId: id,
				},
			});
			res.status(201).json({ favoriteUserCreate });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: "Erro ao favoritar item" });
		}
	}
}

export { FavoriteController };
