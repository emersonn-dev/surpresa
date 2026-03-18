import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const btn = document.getElementById("loginBtn");
const erro = document.getElementById("erro");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.replace("index.html");
    }
});

async function fazerLogin() {
    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    erro.textContent = "";

    if (!email || !senha) {
        erro.textContent = "Preencha email e senha.";
        return;
    }

    btn.disabled = true;
    btn.textContent = "Entrando...";

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.replace("index.html");
    } catch (e) {
        erro.textContent = "Email ou senha inválidos 👀";
        console.error("Erro no login:", e);
    } finally {
        btn.disabled = false;
        btn.textContent = "Entrar";
    }
}

btn.addEventListener("click", fazerLogin);

senhaInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fazerLogin();
});

emailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fazerLogin();
});