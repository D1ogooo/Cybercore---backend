import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express';
import type { CreateUserRequest, AuthUserRequest } from '../@types/type';
import { jwtConfig } from '../configs/auth'
import { prisma } from '../lib/prisma';

class UsersController {
  async auth(req: Request<AuthUserRequest>, res: Response) {
    try {
     const { email, password }: AuthUserRequest = req.body
     const userExists = await prisma.User.findUnique({
      where: { email }
     })
     
     if(!userExists) {
      return res.status(401).json({ "error": "Email inválido" })
     }

     const verifyPassword = await bcrypt.compare(password, userExists.password)
     if(!verifyPassword) {
      return res.status(401).json({ "error": "Senha inválida" })
     }
     
     const token = jwt.sign({ id: userExists.id, role: userExists.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
     const user = await prisma.User.findUnique({
      where: { id: userExists.id },
      select: {
       id: true,
       name: true,
      },
     })

     res.status(200).json({ token, user }) 
    } catch (error) {
     res.status(500).json({ "error": "Erro ao criar usuário" })
    }
  }

  async create(req: Request<CreateUserRequest>, res: Response) {
    try {
      const { name, email, password }: CreateUserRequest = req.body;
      const userExists = await prisma.User.findUnique({
       where: {
        email,
       }
      })

      if(userExists) {
       return res.status(401).json({ "error": "Email já cadastrado" })
      }

      const passwordEncrypt = await bcrypt.hash(password,8)
      const user = await prisma.User.create({
       data: { name, email, password: passwordEncrypt },
      });

      res.status(201).json({ "sucesso!": "Conta criada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "error": 'Erro ao criar usuário' });
    }
  }
}

export { UsersController };
