/**
 * Multi-Step Online Admission & Tour Booking Wizard
 * The Trendsetters Schools
 */
document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('admission-modal-overlay');
  const openButtons = document.querySelectorAll('.js-open-admission');
  const closeButton = document.getElementById('close-admission-modal');
  
  const stepPanels = document.querySelectorAll('.wizard-step-panel');
  const stepIndicators = document.querySelectorAll('.wizard-step');
  const prevButtons = document.querySelectorAll('.js-wizard-prev');
  const nextButtons = document.querySelectorAll('.js-wizard-next');
  const admissionForm = document.getElementById('admission-wizard-form');
  const successView = document.getElementById('admission-success-view');
  const formWizardContainer = document.getElementById('wizard-form-container');
  const refCodeDisplay = document.getElementById('app-reference-code');

  let currentStep = 1;
  const totalSteps = 4;

  // Open Modal
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const initialMode = btn.getAttribute('data-admission-mode');
      if (initialMode === 'tour') {
        goToStep(4); // Jump directly to tour schedule if tour button clicked
      } else {
        goToStep(1);
      }
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close Modal
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Step Navigation Function
  function goToStep(stepNumber) {
    currentStep = stepNumber;

    // Show/Hide Panels
    stepPanels.forEach(panel => {
      const panelStep = parseInt(panel.getAttribute('data-step'), 10);
      if (panelStep === currentStep) {
        panel.style.display = 'block';
      } else {
        panel.style.display = 'none';
      }
    });

    // Update Step Indicators
    stepIndicators.forEach((indicator, idx) => {
      const indicatorStep = idx + 1;
      indicator.classList.remove('active', 'completed');
      if (indicatorStep === currentStep) {
        indicator.classList.add('active');
      } else if (indicatorStep < currentStep) {
        indicator.classList.add('completed');
      }
    });
  }

  // Next Step Buttons
  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep(currentStep)) {
        if (currentStep < totalSteps) {
          goToStep(currentStep + 1);
        }
      }
    });
  });

  // Prev Step Buttons
  prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });

  // Validation function
  function validateCurrentStep(step) {
    const currentPanel = document.querySelector(`.wizard-step-panel[data-step="${step}"]`);
    if (!currentPanel) return true;

    const requiredInputs = currentPanel.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#FB7185';
        input.focus();
      } else {
        input.style.borderColor = '';
      }
    });

    return isValid;
  }

  // Form Submission
  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateCurrentStep(currentStep)) return;

      // Generate unique application ID
      const randomId = 'TTS-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      if (refCodeDisplay) refCodeDisplay.textContent = randomId;

      // Switch to success view
      if (formWizardContainer) formWizardContainer.style.display = 'none';
      if (successView) successView.style.display = 'block';
    });
  }

  // Reset form when needed
  const resetBtn = document.getElementById('reset-admission-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (admissionForm) admissionForm.reset();
      if (formWizardContainer) formWizardContainer.style.display = 'block';
      if (successView) successView.style.display = 'none';
      goToStep(1);
      closeModal();
    });
  }
});
