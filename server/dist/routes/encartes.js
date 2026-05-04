"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseClient_1 = require("../supabaseClient");
const cloudinaryConfig_1 = require("../cloudinaryConfig");
const router = (0, express_1.Router)();
// Rota de Upload de Encartes
router.post('/', cloudinaryConfig_1.upload.single('imagem'), async (req, res) => {
    try {
        const { titulo } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
        }
        // 1. Upload para o Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinaryConfig_1.cloudinary.uploader.upload_stream({ folder: 'encartes_certo' }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(file.buffer);
        });
        // 2. Salvar no Supabase
        const { error } = await supabaseClient_1.supabase
            .from('encartes')
            .insert([{ titulo: titulo, url_imagem: result.secure_url }]);
        if (error)
            throw error;
        console.log(`✅ Sucesso: ${titulo}`);
        res.status(200).json({ message: 'Encarte cadastrado!' });
    }
    catch (error) {
        console.error('❌ Erro:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});
exports.default = router;
