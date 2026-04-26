import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configuração das credenciais (vêm do seu .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configuração do Multer para usar a memória temporária
// Isso evita que fiquem sobras de arquivos no seu servidor
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// 3. Exporta a função que realmente faz o envio para o Cloudinary
export { cloudinary };