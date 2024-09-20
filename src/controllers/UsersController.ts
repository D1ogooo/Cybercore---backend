import type { CreateUserRequest, AuthUserRequest } from '../@types/type';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

class UsersController {
  async auth(req: Request<AuthUserRequest>, res: Response) {}

  async create(req: Request<CreateUserRequest>, res: Response) {
    try {
      const { name, email, password }: CreateUserRequest = req.body;
      const userExists = await prisma.User.findUnique({
       where: {
        email,
       }
      })  
      if(userExists) {
       return res.status(500).json({ "error": "Email já cadastrado" })
      }
      const user = await prisma.User.create({
       data: { name, email, password },
      });

      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ "error": 'Erro ao criar usuário' });
    }
  }
}

export { UsersController };
