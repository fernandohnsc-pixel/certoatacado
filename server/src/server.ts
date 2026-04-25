import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { supabase } from './supabaseClient'; // Importa a conexão que criamos

// 1. Configurações Iniciais
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares (Filtros de entrada)
app.use(cors());              // Libera o acesso para o seu futuro Frontend
app.use(express.json());      // Permite que o servidor entenda quando você enviar textos em JSON

// 3. Rotas (Os caminhos do seu site)

// Rota de "Boas-vindas" - Apenas para saber se o servidor ligou
app.get('/', (req, res) => {
  res.send('🚀 API do Certo Atacado está online e operante!');
});

// Rota para buscar todos os encartes
app.get('/encartes', async (req, res) => {
  const { data, error } = await supabase
    .from('encartes')
    .select('*, categorias(nome)'); // Isso traz o encarte E o nome da categoria junto!

  if (error) return res.status(500).json(error);
  res.json(data);
});

// Rota de Teste do Banco de Dados - Busca as categorias que criamos no Supabase
app.get('/teste-banco', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categorias') // Nome da tabela que criamos
      .select('*');        // Seleciona todas as colunas

    if (error) {
      return res.status(500).json({ mensagem: 'Erro no Supabase', detalhes: error });
    }

    return res.json({
      mensagem: 'Conexão com Supabase OK!',
      categorias: data
    });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor', erro: err });
  }
});

// 4. Inicialização
app.listen(PORT, () => {
  console.log(`-------------------------------------------`);
  console.log(`✅ Servidor do Certo Atacado Ativo!`);
  console.log(`🌍 URL Local: http://localhost:${PORT}`);
  console.log(`-------------------------------------------`);
});