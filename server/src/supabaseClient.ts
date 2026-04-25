import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Isso faz o código ler o arquivo .env que você acabou de editar
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// Aqui criamos a conexão oficial que vamos usar em todo o projeto
export const supabase = createClient(supabaseUrl, supabaseKey);