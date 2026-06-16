/* =========================================================
   ANDREW COLIN DE LEON — PORTFOLIO — ENHANCED SCRIPT
   Framer-style scroll reveals · Stagger · Nav · Progress bar
   ========================================================= */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. SCROLL PROGRESS BAR
  ---------------------------------------------------------- */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrolled / total) * 100).toFixed(2) + '%';
  }

  /* ----------------------------------------------------------
     2. NAV — scroll state + active link highlight
  ---------------------------------------------------------- */
  const nav = document.querySelector('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNav() {
    // Scrolled class for background
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      const href = a.getAttribute('href');
      if (href === '#' + current || (current === '' && href === '#')) {
        a.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     3. SCROLL REVEAL — unified observer
  ---------------------------------------------------------- */
  const revealSelectors = [
    '.fade-in',
    '.reveal-left',
    '.reveal-right',
    '.reveal-scale',
    '.reveal-clip'
  ].join(', ');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Once revealed, stop observing (perf)
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(revealSelectors).forEach(el => {
    revealObserver.observe(el);
  });

  /* ----------------------------------------------------------
     4. STAGGER — auto-apply stagger delays to grid children
  ---------------------------------------------------------- */
  function applyStagger(containerSelector, childSelector, delayStep = 80) {
    document.querySelectorAll(containerSelector).forEach(container => {
      const children = container.querySelectorAll(childSelector);
      children.forEach((child, i) => {
        child.style.setProperty('--stagger-delay', `${i * delayStep}ms`);
        child.classList.add('stagger-child');
      });
    });
  }

  // Stagger skill cards, project cards, edu cards
  applyStagger('.skills-grid',   '.skill-card',   60);
  applyStagger('.projects-grid', '.project-card', 90);
  applyStagger('.edu-grid',      '.edu-card',      80);
  applyStagger('.exp-list',      '.exp-card',      100);
  applyStagger('.contact-info',  '.contact-item',  70);

  /* ----------------------------------------------------------
     5. SKILL BAR ANIMATION on scroll
  ---------------------------------------------------------- */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const cards = e.target.querySelectorAll('.skill-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('animate-bar'), i * 70);
        });
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) barObserver.observe(skillsGrid);

  /* ----------------------------------------------------------
     6. PROJECT CARD — tilt effect on mouse move
  ---------------------------------------------------------- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-10px) scale(1.01) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ----------------------------------------------------------
     7. SKILL CARD — subtle tilt on hover
  ---------------------------------------------------------- */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      card.style.transform = `translateY(-6px) scale(1.01) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ----------------------------------------------------------
     8. SECTION HEADERS — add reveal-clip to section titles
     (run once DOM is parsed)
  ---------------------------------------------------------- */
  document.querySelectorAll('.section-title').forEach(el => {
    if (!el.classList.contains('reveal-clip')) {
      el.classList.add('reveal-clip');
      revealObserver.observe(el);
    }
  });

  /* ----------------------------------------------------------
     9. HERO CONTENT — stagger entrance on page load
  ---------------------------------------------------------- */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const heroChildren = heroContent.children;
    Array.from(heroChildren).forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(24px)';
      child.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms,
                                  transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`;
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 200 + i * 100);
    });
  }

  /* Photo frame entrance */
  const photoWrap = document.querySelector('.hero-photo-wrap');
  if (photoWrap) {
    photoWrap.style.opacity = '0';
    photoWrap.style.transform = 'translateX(40px)';
    photoWrap.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s';
    setTimeout(() => {
      photoWrap.style.opacity = '1';
      photoWrap.style.transform = 'translateX(0)';
    }, 300);
  }

  /* ----------------------------------------------------------
     10. SCROLL listener
  ---------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
  }, { passive: true });

  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('toast-error', isError);
    toast.classList.add('visible');
    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => toast.classList.remove('visible'), 4200);
  }

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      formStatus.textContent = 'Sending your message…';

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Submission failed.');
        }

        contactForm.reset();
        formStatus.textContent = 'Thanks! Your message has been sent successfully.';
        showToast('Message sent successfully!');
      } catch (error) {
        formStatus.textContent = 'Something went wrong. Please email me directly at andrewcolindeleon13@gmail.com.';
      }
    });
  }

  // Initial call
  updateNav();
  updateProgress();

})();
