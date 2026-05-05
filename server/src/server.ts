import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import encartesRoutes from './routes/encartes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estÃ¡ticos do frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use('/upload', encartesRoutes);

// Rota para o site (caso queira acessar sem .html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ðŸš€ Servidor TS do Certo Atacado rodando em http://localhost:${PORT}`);
});

