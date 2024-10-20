import bcrypt from "bcrypt";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import type { CreateUserRequest } from "../@types/type";

async function UsersAvatarController(req: Request, res: Response) {
	try {
		const { email, password } = req.body;
		let imageRequest = req.file ? req.file.path : null;

		if (!imageRequest) {
			return res.status(400).json({ error: "Imagem não declarada" });
		}

		const userFromDb = await prisma.User.findUnique({
			where: { email },
			select: { password: true, image: true },
		});

		if (!userFromDb) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		const passwordMatch = await bcrypt.compare(password, userFromDb.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: "Senha inválida" });
		}

		if (userFromDb.image) {
			const filePath = path.join(
				__dirname,
				"../uploads",
				path.basename(userFromDb.image),
			);
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
		}

		const imageName = path.basename(imageRequest);
		imageRequest = `/uploads/${imageName}`;

		await prisma.User.update({
			where: { email },
			data: { image: imageRequest },
		});

		const updatedUser = await prisma.User.findUnique({
			where: { email },
			select: {
				id: true,
				name: true,
				image: true,
			},
		});

		res.status(202).json({ user: updatedUser });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro ao atualizar imagem" });
	}
}

export { UsersAvatarController };
