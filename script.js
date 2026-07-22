'use strict';

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;
let animationId;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(160, 160, 255, ${p.opacity})`;
    ctx.fill();
  }

  drawConnections();
  drawMouseGlow();

  animationId = requestAnimationFrame(drawParticles);
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(160, 160, 255, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function drawMouseGlow() {
  if (!mouseX && !mouseY) return;

  const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
  gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.02)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  mouseX = touch.clientX;
  mouseY = touch.clientY;
});

resize();
createParticles(Math.floor((canvas.width * canvas.height) / 8000));
drawParticles();

window.addEventListener('resize', () => {
  resize();
  createParticles(Math.floor((canvas.width * canvas.height) / 8000));
});
