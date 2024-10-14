import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "node:fs";
import type { Request, Response } from "express";
import type { CreateUserRequest, AuthUserRequest } from "../@types/type";
import { jwtConfig } from "../configs/auth";
import { prisma } from "../lib/prisma";
import path from "node:path";

class UsersController {
	async auth(req: Request<AuthUserRequest>, res: Response) {
		try {
			const { email, password }: AuthUserRequest = req.body;
			const userExists = await prisma.User.findUnique({
				where: { email },
			});

			if (!userExists) {
				return res.status(401).json({ error: "Email inválido" });
			}

			const verifyPassword = await bcrypt.compare(
				password,
				userExists.password,
			);
			if (!verifyPassword) {
				return res.status(401).json({ error: "Senha inválida" });
			}

			const token = jwt.sign(
				{ id: userExists.id, role: userExists.role },
				jwtConfig.secret,
				{ expiresIn: jwtConfig.expiresIn },
			);
			const user = await prisma.User.findUnique({
				where: { id: userExists.id },
				select: {
					id: true,
					name: true,
				},
			});

			res.status(200).json({ token, user });
		} catch (error) {
			res.status(500).json({ error: "Erro ao criar usuário" });
		}
	}

	async create(req: Request<CreateUserRequest>, res: Response) {
		try {
			const { name, email, password }: CreateUserRequest = req.body;
			const userExists = await prisma.User.findUnique({
				where: {
					email,
				},
			});

			if (userExists) {
				return res.status(401).json({ error: "Email já cadastrado" });
			}

			const passwordEncrypt = await bcrypt.hash(password, 8);
			const user = await prisma.User.create({
				data: { name, email, password: passwordEncrypt },
			});

			res.status(201).json({ "sucesso!": "Conta criada com sucesso" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao criar usuário" });
		}
	}

	async updateImage(
		req: Request<unknown, unknown, CreateUserRequest>,
		res: Response,
	) {
		try {
			const { email, password } = req.body;
			let imageRequest = req.file ? req.file.path : null;

			if (!imageRequest) {
				return res.status(400).json({ error: "Imagem não declarada" });
			}

			const user = await prisma.User.findUnique({
				where: { email },
				select: { password: true, image: true },
			});

			if (!user) {
				return res.status(404).json({ error: "Usuário não encontrado" });
			}

			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				return res.status(401).json({ error: "Senha inválida" });
			}

			if (user.image) {
				const filePath = path.join(
					__dirname,
					"../uploads",
					path.basename(user.image),
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

			res.status(200).json({ success: "Imagem atualizada" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao atualizar imagem" });
		}
	}
}

export { UsersController };
