/* ============================================
   ORA CAFÉ — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // NAVBAR — scroll behavior
  // ============================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ============================================
  // HERO IMAGE LOAD ANIMATION
  // ============================================
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = entry.target.parentElement?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        let delay = 0;
        if (siblings) {
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 120;
          });
        }
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // ACTIVE NAV LINK (based on current page)
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================
  // MENU TABS
  // ============================================
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCategories = document.querySelectorAll('.menu-category');

  if (menuTabs.length) {
    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        menuTabs.forEach(t => t.classList.remove('active'));
        menuCategories.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetCat = document.getElementById(target);
        if (targetCat) targetCat.classList.add('active');
      });
    });
  }

  // ============================================
  // GALLERY FILTERS
  // ============================================
  const galleryFilters = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-masonry-item');

  if (galleryFilters.length) {
    galleryFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        galleryFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const category = filter.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.4s ease';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ============================================
  // LIGHTBOX
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentLightboxIndex = 0;
  const lightboxImages = [];

  // Collect all gallery images
  document.querySelectorAll('.gallery-masonry-item img, .gallery-item img').forEach((img, i) => {
    lightboxImages.push(img.src);
    img.parentElement.addEventListener('click', () => {
      openLightbox(i);
    });
  });

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentLightboxIndex = index;
    lightboxImg.src = lightboxImages[index];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      lightboxImg.src = lightboxImages[currentLightboxIndex];
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
      lightboxImg.src = lightboxImages[currentLightboxIndex];
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev?.click();
    if (e.key === 'ArrowRight') lightboxNext?.click();
  });

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => i.classList.remove('open'));
        // Open clicked (if was closed)
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ============================================
  // RESERVATION FORM → WHATSAPP
  // ============================================
  const reservationForm = document.getElementById('reservation-form');

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name')?.value || '';
      const phone = document.getElementById('res-phone')?.value || '';
      const date = document.getElementById('res-date')?.value || '';
      const time = document.getElementById('res-time')?.value || '';
      const guests = document.getElementById('res-guests')?.value || '';
      const notes = document.getElementById('res-notes')?.value || '';

      const message = `🍽️ *New Table Reservation — Ora Café*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📅 *Date:* ${date}\n` +
        `🕐 *Time:* ${time}\n` +
        `👥 *Guests:* ${guests}\n` +
        `📝 *Special Requests:* ${notes || 'None'}\n\n` +
        `_Sent via Ora Café website_`;

      const whatsappNumber = '254111809595';
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, '_blank');
    });
  }

  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  const scrollTopBtn = document.querySelector('.scroll-top');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // SMOOTH HOVER PARALLAX ON HERO
  // ============================================
  const heroBgEl = document.querySelector('.hero-bg');
  if (heroBgEl) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      heroBgEl.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
    });
  }

  // ============================================
  // SET MIN DATE FOR RESERVATION
  // ============================================
  const resDate = document.getElementById('res-date');
  if (resDate) {
    const today = new Date().toISOString().split('T')[0];
    resDate.setAttribute('min', today);
  }

});
