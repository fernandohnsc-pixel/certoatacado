import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cptrbsmzwvculwrodnnf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdHJic216d3ZjdWx3cm9kbm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzIzODUsImV4cCI6MjA5MjcwODM4NX0.0EihX5uhksytuQfQKL0lzsQ3mztwhMVDP3K8UCJ1A0M'
const supabase = createClient(supabaseUrl, supabaseKey)

const listaEncartes = document.getElementById('listaEncartes');
const uploadForm = document.getElementById('uploadForm');
const btnEnviar = document.getElementById('btnEnviar');
const statusUpload = document.getElementById('status-upload');
const catSelect = document.getElementById('categoria_select');
const editCatSelect = document.getElementById('edit-categoria');

async function inicializar() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = 'index.html'; return; }
    
    await carregarOpcoesCategorias();
    carregarEncartes();
}

async function carregarOpcoesCategorias() {
    const { data } = await supabase.from('categorias').select('nome').order('nome', { ascending: true });
    if (data) {
        const options = data.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('');
        catSelect.innerHTML = options;
        editCatSelect.innerHTML = options;
    }
}

async function carregarEncartes() {
    const { data, error } = await supabase.from('encartes').select('*').order('categoria', { ascending: true });
    if (error) return;

    listaEncartes.innerHTML = '';
    const grupos = {};
    data.forEach(item => {
        const cat = item.categoria || 'Geral';
        if (!grupos[cat]) grupos[cat] = [];
        grupos[cat].push(item);
    });

    for (const [categoria, itens] of Object.entries(grupos)) {
        const header = document.createElement('tr');
        header.innerHTML = `<td colspan="4" class="categoria-header" style="background:#eee; padding: 10px; font-weight:bold;">📁 ${categoria}</td>`;
        listaEncartes.appendChild(header);

        itens.forEach(item => {
            const tr = document.createElement('tr');
            tr.id = `linha-${item.id}`;
            tr.innerHTML = `
                <td><img src="${item.url_imagem}" class="img-preview" onerror="this.style.display='none'"></td>
                <td><strong>${item.titulo}</strong></td>
                <td>${new Date(item.created_at || item.criado_em).toLocaleDateString('pt-BR')}</td>
                <td style="text-align: center;">
                    <button class="btn-editar" onclick="abrirEditar('${item.id}', '${item.titulo}', '${categoria}')">Editar</button>
                    <button class="btn-excluir" onclick="deletarEncarte('${item.id}')">Excluir</button>
                </td>
            `;
            listaEncartes.appendChild(tr);
        });
    }
}

window.abrirEditar = function(id, titulo, categoria) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-titulo').value = titulo;
    document.getElementById('edit-categoria').value = categoria;
    document.getElementById('modalEditar').style.display = 'block';
}

document.getElementById('btnSalvarEdicao').onclick = async () => {
    const id = document.getElementById('edit-id').value;
    const { error } = await supabase.from('encartes').update({ 
        titulo: document.getElementById('edit-titulo').value, 
        categoria: document.getElementById('edit-categoria').value 
    }).eq('id', id);
    if (!error) { document.getElementById('modalEditar').style.display = 'none'; carregarEncartes(); }
}

window.deletarEncarte = async function(id) {
    if (confirm("Excluir este encarte?")) {
        const { error } = await supabase.from('encartes').delete().eq('id', id);
        if (!error) carregarEncartes();
    }
}

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tituloBase = document.getElementById('titulo').value;
    const categoria = catSelect.value;
    const files = document.getElementById('imagem').files;

    btnEnviar.disabled = true;
    statusUpload.style.display = 'block';

    for (let i = 0; i < files.length; i++) {
        statusUpload.innerText = `Enviando ${i + 1} de ${files.length}...`;
        const formData = new FormData();
        formData.append('titulo', files.length > 1 ? `${tituloBase} (${i + 1})` : tituloBase);
        formData.append('categoria', categoria);
        formData.append('imagem', files[i]);
        try { await fetch('http://localhost:3000/upload', { method: 'POST', body: formData }); } catch (err) {}
    }

    statusUpload.innerText = "✅ Concluído!";
    setTimeout(() => { statusUpload.style.display = 'none'; }, 2000);
    uploadForm.reset();
    btnEnviar.disabled = false;
    carregarEncartes();
});

document.getElementById('btnSair').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
};

inicializar();