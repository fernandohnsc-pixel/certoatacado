import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import encartesRoutes from './routes/encartes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/upload', encartesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor TS do Certo Atacado rodando em http://localhost:${PORT}`);
});
