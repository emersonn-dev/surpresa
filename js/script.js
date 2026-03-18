import { auth, db } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let pageIndex = 0;
let musicOn = false;
let siteIniciado = false;
let pages = [];

const pageContent = document.getElementById("pageContent");
const dotsEl = document.getElementById("dots");
const final = document.getElementById("final");
const restart = document.getElementById("restart");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");
const flipBook = document.getElementById("flipBook");
const logoutBtn = document.getElementById("logoutBtn");

if (bgMusic) {
    bgMusic.volume = 0.35;
}

function renderDots() {
    if (!dotsEl) return;

    dotsEl.innerHTML = "";

    pages.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = i === pageIndex ? "dot on" : "dot";
        dotsEl.appendChild(dot);
    });
}

function updatePage() {
    if (!pages.length || !pageContent) return;

    pageContent.style.opacity = "0";

    setTimeout(() => {
        pageContent.innerHTML = pages[pageIndex].html;
        pageContent.style.opacity = "1";
        renderDots();

        conectarAudios(); // conecta os audios da página

    }, 200);
}

function nextPage() {
    if (!pages.length) return;

    if (pageIndex === pages.length - 1) {
        if (final) final.classList.add("active");
        return;
    }

    pageIndex++;
    updatePage();
}

function prevPage() {
    if (pageIndex <= 0) return;

    pageIndex--;
    updatePage();
}

function handleFlipClick(e) {
    if (!flipBook) return;

    const rect = flipBook.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x > rect.width / 2) {
        nextPage();
    } else {
        prevPage();
    }
}

async function toggleMusic() {
    if (!bgMusic) return;

    if (!musicOn) {
        try {

            if (bgMusic.readyState >= 1) {
                if (bgMusic.currentTime === 0 && bgMusic.duration > 60) {
                    bgMusic.currentTime = 8;
                }
            } else {
                bgMusic.addEventListener("loadedmetadata", () => {
                    if (bgMusic.currentTime === 0 && bgMusic.duration > 60) {
                        bgMusic.currentTime = 8;
                    }
                }, { once: true });
            }

            await bgMusic.play();

            if (musicIcon) musicIcon.textContent = "⏸";
            if (musicText) musicText.textContent = "Pause Music";

            musicOn = true;

        } catch (error) {
            console.error("Erro ao tocar música:", error);
        }

    } else {

        bgMusic.pause();

        if (musicIcon) musicIcon.textContent = "🎵";
        if (musicText) musicText.textContent = "Play Music";

        musicOn = false;
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        window.location.replace("login.html");
    } catch (error) {
        console.error("Erro ao sair:", error);
    }
}

async function carregarPaginas() {

    const q = query(collection(db, "cartao"), orderBy("ordem"));
    const snapshot = await getDocs(q);

    pages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));
}

function initSite() {

    if (siteIniciado) return;
    siteIniciado = true;

    if (flipBook) {
        flipBook.addEventListener("click", handleFlipClick);
    }

    if (restart) {
        restart.addEventListener("click", () => {

            if (final) final.classList.remove("active");

            pageIndex = 0;
            updatePage();
        });
    }

    if (musicBtn) {
        musicBtn.addEventListener("click", toggleMusic);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    updatePage();
    document.body.style.display = "block";
}

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    try {

        await carregarPaginas();

        if (!pages.length) {

            if (pageContent) {
                pageContent.innerHTML = "<p style='text-align:center;'>Nenhuma página encontrada no banco.</p>";
            }

            document.body.style.display = "block";
            return;
        }

        initSite();

    } catch (error) {

        console.error("Erro ao carregar páginas:", error);

        if (pageContent) {
            pageContent.innerHTML = `<p style="text-align:center;">Erro ao carregar conteúdo.<br>${error.message}</p>`;
        }

        document.body.style.display = "block";
    }

});

function conectarAudios() {

    const audios = document.querySelectorAll("audio");

    audios.forEach(audio => {

        if (audio.id !== "bgMusic" && !audio.dataset.connected) {

            audio.dataset.connected = "true";


            audio.addEventListener("play", () => {

                

                if (audio.id === "musica2") {

                    audio.volume = 0;

                    let fade = setInterval(() => {

                        if (audio.volume < 1) {
                            audio.volume = Math.min(audio.volume + 0.03, 1);
                        } else {
                            clearInterval(fade);
                        }

                    }, 200);

                }

                if (bgMusic && !bgMusic.paused) {
                    bgMusic.pause();
                }

                if (musicIcon) musicIcon.textContent = "🎵";
                if (musicText) musicText.textContent = "Play Music";
                musicOn = false;

            });

            audio.addEventListener("ended", () => {

                if (bgMusic && !musicOn) {

                   bgMusic.play().catch(() => {});

                    if (musicIcon) musicIcon.textContent = "⏸";
                    if (musicText) musicText.textContent = "Pause Music";
                    musicOn = true;

                }

            });

        }

    });

}