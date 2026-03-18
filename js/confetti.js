(function () {
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let angle = 0;

    // Cores festivas baseadas no seu tema (pink, note-pink, gold, cyan)
    const colors = [
        "rgba(255, 77, 125, 0.9)", // hName color
        "rgba(255, 214, 227, 0.9)", // note color
        "rgba(255, 231, 239, 0.9)", // gradient white
        "rgba(255, 210, 0, 0.9)",   // gold accent
        "rgba(0, 210, 255, 0.7)"    // cyan accent
    ];

    // Ajusta o tamanho do canvas para a tela toda
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // Construtor de Partículas de Confete
    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height; // Começa acima da tela
        this.r = Math.random() * 8 + 2; // tamanho (radius)
        this.d = Math.random() * 10 + 2; // peso (densidade/velocidade)
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.tilt = Math.random() * 10 - 10;
        this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
        this.tiltAngle = 0;
    }

    // Popula o array de partículas (150 confetes é um bom número)
    const mp = 150; // Max particles
    for (let i = 0; i < mp; i++) {
        particles.push(new Particle());
    }

    // Função para desenhar cada confete
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
        }
    }

    // Função para atualizar a posição de cada confete
    function update() {
        angle += 0.01;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.tiltAngle += p.tiltAngleIncremental;

            // Movimento de queda
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;

            // Movimento de "giro" (tilt)
            p.tilt = Math.sin(p.tiltAngle - (i / 3)) * 15;

            // Se o confete sair da tela por baixo, reseta para o topo
            if (p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height) {
                // Alterna entre resetar no topo ou na lateral oposta
                if (i % 3 > 0) {
                    particles[i] = new Particle();
                    particles[i].y = -10;
                } else {
                    if (Math.sin(angle) > 0) {
                        p.x = -5;
                    } else {
                        p.x = canvas.width + 5;
                    }
                    p.y = Math.random() * canvas.height;
                }
            }
        }
    }

    // Loop de animação
    (function animloop() {
        requestAnimationFrame(animloop);
        draw();
        update();
    })();
})();