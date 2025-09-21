const canvas = document.getElementById("raspadinhaCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 200;

// Preenche a área da raspadinha
ctx.fillStyle = "#c0c0c0";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Confete
const confeteCanvas = document.getElementById("confeteCanvas");
const confCtx = confeteCanvas.getContext("2d");
confeteCanvas.width = 300;
confeteCanvas.height = 200;
let confetes = [];

// Elementos
const raspeAqui = document.getElementById("raspe-aqui");
const premio = document.getElementById("premio");
const whatsappLink = document.getElementById("whatsapp-link");

// Variáveis de controle
let isDrawing = false;

// Eventos de mouse
canvas.addEventListener("mousedown", () => { isDrawing = true; });
canvas.addEventListener("mouseup", () => { isDrawing = false; ctx.beginPath(); });
canvas.addEventListener("mousemove", raspando);

// Função de raspagem
function raspando(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    checkRaspado();
}

// Verifica se mais de 50% foi raspado
function checkRaspado() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
    }

    const totalPixels = canvas.width * canvas.height;
    if (transparentPixels / totalPixels > 0.5) {
        premio.style.display = "block"; // mostra prêmio
        canvas.style.pointerEvents = "none"; // bloqueia mais raspadas
        raspeAqui.style.opacity = 0; // desaparece suavemente

        // Configura botão WhatsApp com número correto
        const numero = "5585984189001"; // código do Brasil + número sem espaços
        const mensagem = encodeURIComponent("🎁 Acabei de ganhar um brinde na raspadinha da Closet da Marcilia!");
        whatsappLink.href = `https://wa.me/${numero}?text=${mensagem}`;
        whatsappLink.style.display = "block"; // mostra o botão

        startConfete();
    }
}

// Função de confete
function startConfete() {
    for (let i = 0; i < 100; i++) {
        confetes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 5 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            speed: Math.random() * 3 + 1,
            angle: Math.random() * Math.PI * 2
        });
    }
    requestAnimationFrame(animateConfete);
}

function animateConfete() {
    confCtx.clearRect(0, 0, confeteCanvas.width, confeteCanvas.height);
    confetes.forEach((c) => {
        c.y += c.speed;
        c.x += Math.sin(c.angle);
        c.angle += 0.05;

        if (c.y > confeteCanvas.height) c.y = 0;
        if (c.x > confeteCanvas.width) c.x = 0;
        if (c.x < 0) c.x = confeteCanvas.width;

        confCtx.fillStyle = c.color;
        confCtx.beginPath();
        confCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        confCtx.fill();
    });
    requestAnimationFrame(animateConfete);
}