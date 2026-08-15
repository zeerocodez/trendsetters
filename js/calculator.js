/**
 * Sibling Discount & Tuition Estimator
 * Real-time calculation showing multi-child family discounts and options
 */
document.addEventListener('DOMContentLoaded', () => {
  const childChips = document.querySelectorAll('[data-calc-children]');
  const gradeChips = document.querySelectorAll('[data-calc-grade]');
  const addonToggles = document.querySelectorAll('.calc-addon-toggle');

  const baseTuitionDisplay = document.getElementById('calc-base-tuition');
  const discountRow = document.getElementById('calc-discount-row');
  const discountDisplay = document.getElementById('calc-discount-amount');
  const discountPercentDisplay = document.getElementById('calc-discount-percent');
  const addonsDisplay = document.getElementById('calc-addons-amount');
  const totalDisplay = document.getElementById('calc-total-amount');

  // State
  let selectedChildren = 2; // Default 2 children to showcase sibling discount immediately
  let selectedGradeRate = 220000; // Default Early Years rate
  let activeAddons = [45000]; // Default: Extended 10hr care

  const gradeRates = {
    creche: 180000,
    nursery: 220000,
    primary: 250000
  };

  function formatCurrency(amount) {
    return '₦' + Number(amount).toLocaleString('en-NG');
  }

  function calculateTuition() {
    // Base tuition for all children
    const rawTuition = selectedGradeRate * selectedChildren;

    // Sibling Discount Logic:
    // 1 Child: 0%
    // 2 Children: 10% discount on total
    // 3 Children: 15% discount on total
    // 4+ Children: 20% discount on total
    let discountPercent = 0;
    if (selectedChildren === 2) {
      discountPercent = 0.10;
    } else if (selectedChildren === 3) {
      discountPercent = 0.15;
    } else if (selectedChildren >= 4) {
      discountPercent = 0.20;
    }

    const discountAmount = Math.round(rawTuition * discountPercent);
    const discountedTuition = rawTuition - discountAmount;

    // Addons per child
    const totalAddonsPerChild = activeAddons.reduce((sum, cost) => sum + cost, 0);
    const totalAddons = totalAddonsPerChild * selectedChildren;

    const grandTotal = discountedTuition + totalAddons;

    // Update UI with smooth counter transition
    if (baseTuitionDisplay) baseTuitionDisplay.textContent = formatCurrency(rawTuition);
    
    if (discountRow) {
      if (discountPercent > 0) {
        discountRow.style.display = 'flex';
        if (discountDisplay) discountDisplay.textContent = `-${formatCurrency(discountAmount)}`;
        if (discountPercentDisplay) discountPercentDisplay.textContent = `(${discountPercent * 100}% Multi-Child Family Discount)`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (addonsDisplay) addonsDisplay.textContent = formatCurrency(totalAddons);
    if (totalDisplay) totalDisplay.textContent = formatCurrency(grandTotal);
  }

  // Children selector listeners
  childChips.forEach(chip => {
    chip.addEventListener('click', () => {
      childChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedChildren = parseInt(chip.getAttribute('data-calc-children'), 10) || 1;
      calculateTuition();
    });
  });

  // Grade selector listeners
  gradeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      gradeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const grade = chip.getAttribute('data-calc-grade');
      selectedGradeRate = gradeRates[grade] || 220000;
      calculateTuition();
    });
  });

  // Add-on checkboxes/toggles
  addonToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      const cost = parseInt(toggle.getAttribute('data-addon-cost'), 10) || 0;
      
      if (toggle.classList.contains('active')) {
        if (!activeAddons.includes(cost)) activeAddons.push(cost);
      } else {
        activeAddons = activeAddons.filter(c => c !== cost);
      }
      calculateTuition();
    });
  });

  // Initial Calculation
  calculateTuition();
});
