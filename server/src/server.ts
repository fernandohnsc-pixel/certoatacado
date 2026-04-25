import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

// 1. Carrega as variáveis do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares (Configurações de segurança e leitura de dados)
app.use(cors()); // Permite que o frontend acesse o servidor
app.use(express.json()); // Permite que o servidor entenda JSON

// 3. Rota de Teste (Para saber se o motor ligou)
app.get('/', (req, res) => {
  res.send('O servidor do Certo Atacado está rodando com sucesso! 🚀');
});

// 4. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`=========================================`);
});