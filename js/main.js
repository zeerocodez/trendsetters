/**
 * The Trendsetters Schools — Interactive Digital Experience
 */
document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. SCROLL INTERSECTIONS & FLOATING NAV ISLAND MORPH
     ========================================================================== */
  const navIsland = document.getElementById('nav-island');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navIsland?.classList.add('scrolled');
    } else {
      navIsland?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     2. SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ==========================================================================
     3. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  /* ==========================================================================
     4. CURATED CAMPUS GALLERY & LIGHTBOX
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.js-gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, title, tag) {
    if (lightboxModal && lightboxImage && lightboxTitle && lightboxTag) {
      lightboxImage.src = src;
      lightboxImage.alt = title;
      lightboxTitle.textContent = title;
      lightboxTag.textContent = tag;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src') || '';
      const title = item.getAttribute('data-title') || '';
      const tag = item.getAttribute('data-tag') || '';
      openLightbox(src, title, tag);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  /* ==========================================================================
     5. STREAMLINED SIBLING TUITION CALCULATOR
     ========================================================================== */
  const childrenBtns = document.querySelectorAll('#calc-children-group .calc-chip-btn');
  const gradeBtns = document.querySelectorAll('#calc-grade-group .calc-chip-btn');
  const careCheckbox = document.getElementById('addon-care');
  const displayTotal = document.getElementById('calc-display-total');
  const displayDiscount = document.getElementById('calc-display-discount');

  // Pricing Matrix (Per Child Base Termly)
  const basePrices = {
    creche: 240000,
    nursery: 220000,
    primary: 260000
  };

  const careAddonCost = 45000;

  let selectedChildren = 2;
  let selectedGrade = 'nursery';

  function updateCalculator() {
    const basePerChild = basePrices[selectedGrade] || 220000;
    const hasCare = careCheckbox?.checked ?? false;
    const carePerChild = hasCare ? careAddonCost : 0;

    const totalBeforeDiscount = (basePerChild + carePerChild) * selectedChildren;

    // Sibling Concession Discount Rate
    let discountRate = 0;
    let discountLabel = 'Standard Family Rate';

    if (selectedChildren === 2) {
      discountRate = 0.10;
      discountLabel = '✓ 10% Sibling Concession Applied';
    } else if (selectedChildren === 3) {
      discountRate = 0.15;
      discountLabel = '✓ 15% Sibling Concession Applied';
    } else if (selectedChildren >= 4) {
      discountRate = 0.20;
      discountLabel = '✓ 20% Multi-Child Family Concession Applied';
    }

    const discountAmount = (basePerChild * selectedChildren) * discountRate;
    const finalTotal = Math.round(totalBeforeDiscount - discountAmount);

    if (displayTotal) {
      displayTotal.textContent = `₦${finalTotal.toLocaleString()}`;
    }

    if (displayDiscount) {
      displayDiscount.textContent = discountLabel;
    }
  }

  childrenBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      childrenBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedChildren = parseInt(btn.getAttribute('data-children') || '2', 10);
      updateCalculator();
    });
  });

  gradeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gradeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGrade = btn.getAttribute('data-grade') || 'nursery';
      updateCalculator();
    });
  });

  careCheckbox?.addEventListener('change', updateCalculator);
  updateCalculator();

  /* ==========================================================================
     6. FAST ADMISSION & TOUR MODAL
     ========================================================================== */
  const openModalBtns = document.querySelectorAll('.js-open-modal');
  const admissionModal = document.getElementById('admission-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const tourDateGroup = document.getElementById('tour-date-group');
  const formSubmitText = document.getElementById('form-submit-text');
  const admissionForm = document.getElementById('admission-form');
  const modalSuccessView = document.getElementById('modal-success-view');
  const successRefCode = document.getElementById('success-ref-code');
  const whatsappDirectLink = document.getElementById('whatsapp-direct-link');

  let currentModalMode = 'apply';

  function openAdmissionModal(mode = 'apply') {
    currentModalMode = mode;
    if (admissionModal) {
      if (mode === 'tour') {
        if (modalTitle) modalTitle.textContent = 'Schedule a Private Campus Tour';
        if (modalSubtitle) modalSubtitle.textContent = 'Personalized Guided Visit';
        if (tourDateGroup) tourDateGroup.style.display = 'block';
        if (formSubmitText) formSubmitText.textContent = 'Confirm Tour Reservation';
      } else {
        if (modalTitle) modalTitle.textContent = 'Apply for 2026/2027 Admission';
        if (modalSubtitle) modalSubtitle.textContent = 'Fast Online Application';
        if (tourDateGroup) tourDateGroup.style.display = 'none';
        if (formSubmitText) formSubmitText.textContent = 'Submit Application';
      }

      admissionForm.style.display = 'block';
      if (modalSuccessView) modalSuccessView.style.display = 'none';
      admissionModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAdmissionModal() {
    if (admissionModal) {
      admissionModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = btn.getAttribute('data-mode') || 'apply';
      openAdmissionModal(mode);
    });
  });

  modalCloseBtn?.addEventListener('click', closeAdmissionModal);
  admissionModal?.addEventListener('click', (e) => {
    if (e.target === admissionModal) closeAdmissionModal();
  });

  // Global Keyboard Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeAdmissionModal();
      closeDrawer();
    }
  });

  // Form Submission
  admissionForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const parentName = document.getElementById('parent-name')?.value || '';
    const parentPhone = document.getElementById('parent-phone')?.value || '';
    const childName = document.getElementById('child-name')?.value || '';
    const childGrade = document.getElementById('child-grade')?.value || '';
    const tourDate = document.getElementById('tour-date')?.value || '';

    const randomRef = 'TTS-' + Math.floor(1000 + Math.random() * 9000);

    if (successRefCode) successRefCode.textContent = randomRef;

    // WhatsApp Message URL
    const message = encodeURIComponent(
      `Hello The Trendsetters Schools,\n\nI submitted an ${currentModalMode === 'tour' ? 'in-person campus tour booking' : 'online admission request'}.\n` +
      `Reference ID: ${randomRef}\n` +
      `Parent: ${parentName}\n` +
      `Phone: ${parentPhone}\n` +
      `Child: ${childName}\n` +
      `Pathway: ${childGrade}` +
      (tourDate ? `\nPreferred Date: ${tourDate}` : '')
    );

    if (whatsappDirectLink) {
      whatsappDirectLink.href = `https://wa.me/2348035477181?text=${message}`;
    }

    admissionForm.style.display = 'none';
    if (modalSuccessView) modalSuccessView.style.display = 'block';
  });
});
