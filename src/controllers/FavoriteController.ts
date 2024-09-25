import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

class FavoriteController {
 async getall(req: Request, res: Response) {
  try {
   const { idUser, productId } = req.body
   const res = await prisma.Favorite.findMany({
    where: {
     idUser,
     productId
    }
   })
   res.status(200).json(res)
  } catch (error) {
    // biome-ignore lint/correctness/noUnreachable: <explanation>
    res.json(error)
   }
  }
}

export { FavoriteController }