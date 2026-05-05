import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { upload, cloudinary } from '../cloudinaryConfig';

const router = Router();

// Rota de Upload de Encartes
router.post('/', upload.single('imagem'), async (req: any, res: any) => {
  try {
    const { titulo, categoria } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    // 1. Upload para o Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'encartes_certo' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // 2. Salvar no Supabase com categoria
    const { error } = await supabase
      .from('encartes')
      .insert([{
        titulo: titulo,
        url_imagem: result.secure_url,
        categoria: categoria || 'Geral'
      }]);

    if (error) throw error;

    console.log(`✅ Sucesso: ${titulo}`);
    res.status(200).json({ message: 'Encarte cadastrado!' });

  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Rota para listar encartes
router.get('/listar', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('encartes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar encartes:', error);
    res.status(500).json({ error: 'Erro ao buscar encartes.' });
  }
});

export default router;
