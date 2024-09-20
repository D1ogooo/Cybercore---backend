import type { ProductsRequest } from '../@types/type';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

class ProductsController {
  async create(req: Request<ProductsRequest>, res: Response) {
   try {
    const { conteudo, preco } = req.body
    // let image = req.file ? req.file.path : null;
    
    // if(image) {
    //  const imageName = path.basename(image)
    //  image = `/uploads/${imageName}`
    // } else {
    //   return res.status(401).json({ "error": "Imagem não declarada" })
    // }

   } catch (error) {
    
   }
  }
}

export { ProductsController }