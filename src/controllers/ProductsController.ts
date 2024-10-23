import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { jwtConfig } from "../configs/auth";

class ProductsController {
	async create(req: Request, res: Response) {
		const authHeader = req.headers.authorization;
		const token = authHeader?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ error: "Token inválido" });
		}

		try {
			const { nome, preco, sobre } = req.body;
			let image = req.file ? req.file.path : null;
			const decoded = jwt.verify(token, jwtConfig.secret) as { id: string };

			if (image) {
				const imageName = path.basename(image);
				image = `/uploads/${imageName}`;
			} else {
				return res.status(401).json({ error: "Imagem não declarada" });
			}

			await prisma.Product.create({
				data: {
					nome,
					preco: Number(preco),
					sobre,
					imagem: image,
				},
			});
			res.status(200).json({
				"sucesso!": "Produto criado com sucesso",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			console.log(id);
			const imageDB = await prisma.Product.findUnique({
				where: {
					id,
				},
			});
			console.log(imageDB.imagem);
			if (imageDB.imagem) {
				const filePath = path.join(
					__dirname,
					"../uploads",
					path.basename(imageDB.imagem),
				);
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
			}
			await prisma.Product.delete({
				where: {
					id,
				},
			});
			res.status(200);
		} catch (error) {
			res.status(401).json({ error: "Erro ao tentar deletar o produto" });
		}
	}

	async list(req: Request, res: Response) {
		const authHeader = req.headers.authorization;
		const token = authHeader?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ error: "Token inválido" });
		}

		try {
			const publicItens = await prisma.product.findMany();
			return res.status(200).json({ publicItens });
		} catch (error) {
			console.error("Erro ao processar requisição: ", error);
		}
	}

	async listUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const product = await prisma.Product.findUnique({
				where: {
					id,
				},
			});
			res.status(200).json(product);
		} catch (error) {
			res.status(401).json(error);
		}
	}
}

export { ProductsController };
