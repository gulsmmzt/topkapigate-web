// TOPKAPI GATE - İnteraktif Parçacık / Anti-Gravity Efekti
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-bg';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none'; // Tıklamaları engellemez
  canvas.style.zIndex = '0';           // İçeriğin arkasında kalır
  canvas.style.opacity = '0.65';       // Sayfayı boğmayacak hafiflik
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  const PARTICLE_COUNT = 70; // Performans için ideal sayı
  const MOUSE_RADIUS = 130;  // Farenin itme/etkileşim alanı

  const mouse = { x: -1000, y: -1000 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6 - 0.2; // Hafif yukarı doğru yerçekimsiz akış
      this.color = Math.random() > 0.35 ? '#FFD230' : '#38BDF8'; // Sarı ve Açık Mavi parçacıklar
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Ekrandan çıkınca tekrar aşağıdan/kenardan başlat
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
        this.y = height + 10;
      }

      // Fare etkileşimi (Anti-gravity itme etkisi)
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        const dirX = dx / dist;
        const dirY = dy / dist;
        this.x -= dirX * force * 4.5;
        this.y -= dirY * force * 4.5;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          ctx.save();
          ctx.strokeStyle = '#FFD230';
          ctx.globalAlpha = (1 - dist / 90) * 0.15;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
})();