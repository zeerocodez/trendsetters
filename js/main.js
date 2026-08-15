/**
 * Main Interactive Application Script
 * The Trendsetters Schools
 */
document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. STICKY HEADER & SCROLL BEHAVIOR
     ========================================== */
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  /* ==========================================
     2. MOBILE DRAWER NAVIGATION
     ========================================== */
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link');

  function openMobileMenu() {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openMobileMenu);
  drawerClose?.addEventListener('click', closeMobileMenu);
  drawerOverlay?.addEventListener('click', closeMobileMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ==========================================
     3. GALLERY FILTERING & LIGHTBOX
     ========================================== */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Filter items
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox Trigger
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || '';
      const category = item.querySelector('.gallery-category-tag')?.textContent || '';

      if (lightbox && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<strong>${title}</strong><br><span style="font-size:0.85rem;color:var(--gold-primary);">${category}</span>`;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ==========================================
     4. PARENT TESTIMONIALS CAROUSEL
     ========================================== */
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonialIndex = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentTestimonialIndex = index;
  }

  testimonialDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showTestimonial(i);
      resetAutoPlay();
    });
  });

  function nextTestimonial() {
    const nextIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
    showTestimonial(nextIndex);
  }

  function resetAutoPlay() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonial, 6500);
  }

  if (testimonialCards.length > 0) {
    showTestimonial(0);
    testimonialInterval = setInterval(nextTestimonial, 6500);
  }

  /* ==========================================
     5. FAQ ACCORDION
     ========================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isOpen);
    });
  });

  /* ==========================================
     6. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================
     7. QUICK INQUIRY FORM SUBMISSION
     ========================================== */
  const contactForm = document.getElementById('quick-inquiry-form');
  const inquiryFeedback = document.getElementById('inquiry-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending Message...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          if (inquiryFeedback) {
            inquiryFeedback.style.display = 'block';
            setTimeout(() => {
              inquiryFeedback.style.display = 'none';
            }, 6000);
          }
        }, 1200);
      }
    });
  }
});
