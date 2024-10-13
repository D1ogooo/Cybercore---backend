import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

class CartController {
  async create(req: Request, res: Response) {
   const { id } = req.body
   
  }
}

export { CartController }