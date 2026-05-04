import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// COLE SUAS CHAVES AQUI:
const supabaseUrl = "https://cptrbsmzwvculwrodnnf.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdHJic216d3ZjdWx3cm9kbm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzIzODUsImV4cCI6MjA5MjcwODM4NX0.0EihX5uhksytuQfQKL0lzsQ3mztwhMVDP3K8UCJ1A0M"
const supabase = createClient(supabaseUrl, supabaseKey)

const loginForm = document.getElementById('loginForm');
const mensagemErro = document.getElementById('mensagem-erro');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Tenta fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
    });

    if (error) {
        mensagemErro.style.display = 'block';
    } else {
        // Se der certo, vai para o painel
        window.location.href = 'painel.html';
    }
});