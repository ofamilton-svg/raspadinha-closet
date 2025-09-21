const canvas = document.getElementById("raspadinhaCanvas");
const ctx = canvas.getContext("2d");

const confeteCanvas = document.getElementById("confeteCanvas");
const confCtx = confeteCanvas.getContext("2d");

const raspeAqui = document.getElementById("raspe-aqui");
const premio = document.getElementById("premio");
const mensagemFallback = document.getElementById("mensagem-fallback");
const whatsappLink = document.getElementById("whatsapp-link");
const shareButton = document.getElementById("share-whatsapp");

let isDrawing = false;
let confetes = [];
let chanceDeBrinde = 0.25; // 25%

// Verifica se o usuário já ganhou
let jaParticipou = localStorage.getItem("raspadinhaGanhou");

function ajustarCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  confeteCanvas.width = rect.width;
  confeteCanvas.height = rect.height;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
ajustarCanvas();
window.addEventListener('resize', ajustarCanvas);

// Eventos touch
canvas.addEventListener("touchstart", (e) => { isDrawing = true; e.preventDefault(); });
canvas.addEventListener("touchend", () => { isDrawing = false; ctx.beginPath(); });
canvas.addEventListener("touchmove", raspandoTouch, { passive: false });

function raspandoTouch(e) {
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  raspandoBase(x, y);
}

// Eventos mouse
canvas.addEventListener("mousedown", () => { isDrawing = true; });
canvas.addEventListener("mouseup", () => { isDrawing = false; ctx.beginPath(); });
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  raspandoBase(x, y);
});

function raspandoBase(x, y) {
  ctx.globalCompositeOperation = "destination-out";
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  checkRaspado();
}

function checkRaspado() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  let transparentPixels = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) transparentPixels++;
  }

  const totalPixels = canvas.width * canvas.height;
  if (transparentPixels / totalPixels > 0.5) {
    canvas.style.pointerEvents = "none";
    raspeAqui.style.opacity = 0;

    premio.style.display = "none";
    mensagemFallback.style.display = "none";
    whatsappLink.style.display = "none";

    if (!jaParticipou) {
      const ganhouBrinde = Math.random() < chanceDeBrinde;
      localStorage.setItem("raspadinhaGanhou", ganhouBrinde ? "true" : "false");
      jaParticipou = localStorage.getItem("raspadinhaGanhou");
    }

    if (jaParticipou === "true") {
      premio.style.display = "block";
      startConfete();
      const numero = "5585984189001";
      const mensagem = encodeURIComponent(
        "🎁 Acabei de ganhar um brinde na raspadinha da Closet da Marcilia! Visite: Rua NE-9, Nº 132, Bom Jardim"
      );
      whatsappLink.href = `https://wa.me/${numero}?text=${mensagem}`;
      whatsappLink.style.display = "block";
    } else {
      mensagemFallback.style.display = "block";
    }
  }
}

// Confete ultra atrativo
function startConfete() {
  confetes = [];
  for (let i = 0; i < 150; i++) {
    confetes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speed: Math.random() * 1.5 + 0.5,
      angle: Math.random() * Math.PI * 2,
      shape: Math.random() > 0.5 ? "circle" : "square"
    });
  }
  requestAnimationFrame(animateConfete);
}

function animateConfete() {
  confCtx.clearRect(0, 0, confeteCanvas.width, confeteCanvas.height);
  confetes.forEach(c => {
    c.y += c.speed;
    c.x += Math.sin(c.angle);
    c.angle += 0.05;

    if (c.y > confeteCanvas.height) c.y = 0;
    if (c.x > confeteCanvas.width) c.x = 0;
    if (c.x < 0) c.x = confeteCanvas.width;

    confCtx.fillStyle = c.color;
    confCtx.beginPath();
    if (c.shape === "circle") {
      confCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      confCtx.fill();
    } else {
      confCtx.fillRect(c.x, c.y, c.r * 2, c.r * 2);
    }
  });
  requestAnimationFrame(animateConfete);
}

// Compartilhamento
const urlRaspadinha = encodeURIComponent(
  "https://ofamilton-svg.github.io/raspadinha-closet/"
);
const mensagemShare = encodeURIComponent(
  "🎉 Olha a raspadinha que ganhei na Closet da Marcilia! Visite a loja: Rua NE-9, Nº 132, Bom Jardim. Experimente você também: "
);
shareButton.href = `https://wa.me/?text=${mensagemShare}${urlRaspadinha}`;
