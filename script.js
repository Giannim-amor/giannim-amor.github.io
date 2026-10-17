/**
 * SCRIPT PRINCIPAL - PÁGINA ROMÁNTICA
 * Controla: Preloader, Parallax multicapa, Temporizador, Galería, Lightbox y Efectos dinámicos
 */

document.addEventListener('DOMContentLoaded', () => {
  // Asegurar que el texto sea únicamente el definido en el HTML
  localStorage.removeItem('romantic_letter_text');
  localStorage.removeItem('romantic_recipient_name');

  initPreloader();
  initParallaxHearts();
  initTimer();
  initGallery();
  initLightbox();
  initInteractiveClickHearts();
  initLoveBurstButton();
});

/* ============================================================
   1. PANTALLA DE CARGA (PRELOADER)
   ============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const minDisplayTime = 1600; // 1.6 segundos para apreciar el corazón sonriente
  const startTime = Date.now();

  const hidePreloader = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDisplayTime - elapsed);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 850);
    }, remaining);
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
    // Tiempo de seguridad por si alguna imagen tarda en cargar
    setTimeout(hidePreloader, 4000);
  }
}

/* ============================================================
   2. FONDO PARALLAX MULTICAPA CON CORAZONES
   - Capa Lejos: corazones más oscuros, pequeños, lentos
   - Capa Media: corazones lilas intermedios
   - Capa Cerca: corazones grandes, brillantes, rápidos
   ============================================================ */
function initParallaxHearts() {
  const layerFar = document.getElementById('layer-far');
  const layerMid = document.getElementById('layer-mid');
  const layerNear = document.getElementById('layer-near');

  if (!layerFar || !layerMid || !layerNear) return;

  // Configuración de corazones por capa
  const configs = [
    {
      container: layerFar,
      count: 18,
      sizes: [14, 22],
      durations: [22, 34],
      colors: ['#2e0854', '#3c1361', '#4a154b', '#521262'],
      opacities: [0.25, 0.45],
      parallaxFactor: 0.015,
      scrollFactor: 0.05
    },
    {
      container: layerMid,
      count: 15,
      sizes: [24, 38],
      durations: [16, 24],
      colors: ['#7b2cbf', '#9d4edd', '#b5179e', '#845ec2'],
      opacities: [0.45, 0.7],
      parallaxFactor: 0.038,
      scrollFactor: 0.12
    },
    {
      container: layerNear,
      count: 12,
      sizes: [42, 64],
      durations: [11, 16],
      colors: ['#c77dff', '#e0aaff', '#ff70a6', '#f72585'],
      opacities: [0.75, 0.95],
      parallaxFactor: 0.075,
      scrollFactor: 0.22
    }
  ];

  // SVG de corazón para crear elementos vectoriales nítidos
  const heartSvgTemplate = (color, size, opacity) => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" style="opacity: ${opacity};" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `;

  // Poblar cada capa
  configs.forEach(cfg => {
    for (let i = 0; i < cfg.count; i++) {
      const heartEl = document.createElement('div');
      heartEl.className = 'floating-heart';

      const size = Math.floor(cfg.sizes[0] + Math.random() * (cfg.sizes[1] - cfg.sizes[0]));
      const duration = (cfg.durations[0] + Math.random() * (cfg.durations[1] - cfg.durations[0])).toFixed(1);
      const delay = (Math.random() * -30).toFixed(1); // Desfase para que ya estén en pantalla
      const left = (Math.random() * 100).toFixed(1);
      const color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
      const opacity = (cfg.opacities[0] + Math.random() * (cfg.opacities[1] - cfg.opacities[0])).toFixed(2);

      heartEl.style.left = `${left}%`;
      heartEl.style.animationDuration = `${duration}s`;
      heartEl.style.animationDelay = `${delay}s`;
      heartEl.innerHTML = heartSvgTemplate(color, size, opacity);

      cfg.container.appendChild(heartEl);
    }
  });

  // Efecto Parallax con el ratón y scroll
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let scrollY = window.scrollY;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - window.innerWidth / 2);
    targetMouseY = (e.clientY - window.innerHeight / 2);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  // Loop de animación fluido con lerp (interpolación suave)
  function renderParallax() {
    currentMouseX += (targetMouseX - currentMouseX) * 0.06;
    currentMouseY += (targetMouseY - currentMouseY) * 0.06;

    configs.forEach(cfg => {
      const offsetX = currentMouseX * cfg.parallaxFactor;
      const offsetY = (currentMouseY * cfg.parallaxFactor) - (scrollY * cfg.scrollFactor);
      cfg.container.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}

/* ============================================================
   3. TEMPORIZADOR (DESDE EL 29/04/2026)
   ============================================================ */
function initTimer() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Fecha solicitada: 29 de Abril de 2026
  const TARGET_DATE = new Date('2026-04-29T00:00:00');

  function update() {
    const now = new Date();
    // Tiempo transcurrido desde la fecha
    let diff = now.getTime() - TARGET_DATE.getTime();

    // Si la fecha actual estuviese antes, calculamos el valor absoluto
    diff = Math.abs(diff);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    daysEl.textContent = days;
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   4. GALERÍA DE IMÁGENES CON DESPLAZAMIENTO SUAVE
   ============================================================ */
function initGallery() {
  const track = document.getElementById('gallery-track');
  const btnPrev = document.getElementById('gallery-prev');
  const btnNext = document.getElementById('gallery-next');
  const dotsContainer = document.getElementById('gallery-dots');

  if (!track) return;

  const cards = track.querySelectorAll('.photo-card');
  if (!cards.length) return;

  // Generar puntos indicadores
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `gallery-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 22;
        track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Navegación con flechas
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth + 22;
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth + 22;
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  // Sincronizar indicador de punto activo con el scroll
  track.addEventListener('scroll', () => {
    if (!dotsContainer) return;
    const cardWidth = cards[0].offsetWidth + 22;
    const activeIndex = Math.round(track.scrollLeft / cardWidth);
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }, { passive: true });
}

/* ============================================================
   5. MODAL LIGHTBOX (ZOOM Y AMPLIACIÓN DE FOTOS)
   ============================================================ */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');

  if (!modal || !modalImg) return;

  const photoCards = Array.from(document.querySelectorAll('.photo-card'));
  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = photoCards.length - 1;
    if (index >= photoCards.length) index = 0;
    currentIndex = index;

    const card = photoCards[currentIndex];
    const img = card.querySelector('.gallery-img');
    const caption = card.querySelector('.photo-caption-text');

    modalImg.src = img.src;
    modalImg.alt = img.alt || 'Foto especial';
    if (modalCaption) {
      modalCaption.textContent = caption ? caption.textContent : 'Recuerdo de amor ❤️';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  photoCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      showImage(index);
    });
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  // Cerrar al hacer clic en el fondo oscuro
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-inner')) {
      closeLightbox();
    }
  });

  // Soporte de teclado (Escape, Flecha Izquierda, Flecha Derecha)
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}


/* ============================================================
   7. PARTÍCULAS DE CORAZÓN AL HACER CLIC EN CUALQUIER LUGAR
   ============================================================ */
function initInteractiveClickHearts() {
  const heartIcons = ['💜', '💖', '✨', '🌸', '💕', '🤍', '🔮'];

  window.addEventListener('click', (e) => {
    // Evitar generar partículas si se hizo clic en botones o enlaces específicos
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('iframe')) return;

    createClickHeart(e.clientX, e.clientY);
  });

  function createClickHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'interactive-click-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);
  }
}

/* ============================================================
   8. BOTÓN DE EXPLOSIÓN DE AMOR
   ============================================================ */
function initLoveBurstButton() {
  const btnBurst = document.getElementById('btn-love-burst');
  if (!btnBurst) return;

  btnBurst.addEventListener('click', () => {
    const rect = btnBurst.getBoundingClientRect();
    triggerHeartBurst(rect, 25);
  });
}

function triggerHeartBurst(rect, count = 18) {
  const icons = ['💖', '💜', '💕', '✨', '🌸', '💐', '🥰'];
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'interactive-click-heart';
    particle.textContent = icons[Math.floor(Math.random() * icons.length)];
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;

    // Dispersión radial aleatoria
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 160;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 50;

    particle.style.transition = 'all 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
    document.body.appendChild(particle);

    requestAnimationFrame(() => {
      particle.style.transform = `translate(${destX}px, ${destY}px) scale(${0.8 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
      particle.style.opacity = '0';
    });

    setTimeout(() => {
      particle.remove();
    }, 1150);
  }
}
