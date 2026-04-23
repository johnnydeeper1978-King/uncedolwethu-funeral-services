/* =========================================================
   UNCEDOLWETHU FUNERAL SERVICES — JAVASCRIPT
   ========================================================= */

/* ---- Dark / Light mode toggle ---- */
(function () {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Apply saved preference or system default on load
  const saved   = localStorage.getItem('theme');
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', saved || prefers);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ---- Navbar: scroll shadow + active link highlight ---- */
(function () {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    // Scroll shadow
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Hamburger / mobile menu ---- */
(function () {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

/* ---- Scroll-triggered entrance animations ---- */
(function () {
  const els = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right');
  if (!window.IntersectionObserver) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ---- Hero button → smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Slideshow ---- */
(function () {
  const slides     = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap   = document.getElementById('slideDots');
  const prevBtn    = document.getElementById('slidePrev');
  const nextBtn    = document.getElementById('slideNext');
  if (!slides.length || !dotsWrap) return;

  let current  = 0;
  let timer    = null;
  const DELAY  = 4500;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.slide-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    updateDots();
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DELAY);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Pause on hover
  const wrap = document.getElementById('slideshow');
  wrap.addEventListener('mouseenter', () => clearInterval(timer));
  wrap.addEventListener('mouseleave', resetTimer);

  // Touch/swipe support
  let touchStartX = 0;
  wrap.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetTimer();
})();

/* ---- Contact form: WhatsApp redirect ---- */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = form.querySelector('#name').value.trim();
    const phone   = form.querySelector('#phone').value.trim();
    const message = form.querySelector('#message').value.trim();

    const text = encodeURIComponent(
      `Hello Uncedolwethu Funeral Services,\n\nName: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`
    );

    // Replace form with success state, then open WhatsApp
    form.innerHTML = `
      <div class="form-success show">
        <div class="form-success-icon">✅</div>
        <h3>Message Sent!</h3>
        <p>Opening WhatsApp so we can assist you directly…</p>
      </div>`;

    setTimeout(() => {
      window.open(`https://wa.me/27799215535?text=${text}`, '_blank', 'noopener');
    }, 800);
  });
})();
