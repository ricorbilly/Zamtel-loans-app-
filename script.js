const loanRange = document.getElementById('loanRange');
const loanValue = document.getElementById('loanValue');
const monthlyValue = document.getElementById('monthlyValue');
const sendOtpButton = document.getElementById('sendOtp');
const loanForm = document.getElementById('loanForm');

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
    maximumFractionDigits: 0,
  }).format(value);
};

const updateLoanSummary = () => {
  const amount = Number(loanRange.value);
  loanValue.textContent = formatCurrency(amount);
  const monthly = Math.round(amount / 4.3);
  monthlyValue.textContent = formatCurrency(monthly);
};

loanRange.addEventListener('input', updateLoanSummary);
updateLoanSummary();

const showMessage = (message, isError = false) => {
  const existing = document.querySelector('.success-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.className = 'success-banner';
  banner.style.borderColor = isError ? 'rgba(217, 83, 79, 0.35)' : 'rgba(30, 157, 97, 0.25)';
  banner.style.color = isError ? '#9b2c2c' : '#0b6b3d';
  banner.style.background = isError ? 'rgba(217, 83, 79, 0.08)' : 'rgba(30, 157, 97, 0.08)';
  banner.textContent = message;
  loanForm.appendChild(banner);
};

const validatePhoneNumber = (value) => /^\+260[0-9]{9}$/.test(value.trim()) || /^0[0-9]{9}$/.test(value.trim());

sendOtpButton.addEventListener('click', () => {
  const phoneInput = document.getElementById('phone');
  const phone = phoneInput.value.trim();

  if (!validatePhoneNumber(phone)) {
    phoneInput.classList.add('error');
    showMessage('Please enter a valid Zambian phone number.', true);
    return;
  }

  phoneInput.classList.remove('error');
  showMessage('OTP sent successfully. Use code 246810 to continue.');
});

loanForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    otp: document.getElementById('otp'),
    pin: document.getElementById('pin'),
    confirmPin: document.getElementById('confirmPin'),
    terms: document.getElementById('terms')
  };

  let isValid = true;

  Object.values(fields).forEach((field) => {
    if (field instanceof HTMLInputElement && field.type !== 'checkbox') {
      field.classList.remove('error');
    }
  });

  if (!fields.firstName.value.trim()) {
    fields.firstName.classList.add('error');
    isValid = false;
  }

  if (!fields.lastName.value.trim()) {
    fields.lastName.classList.add('error');
    isValid = false;
  }

  if (!fields.email.value.trim() || !fields.email.checkValidity()) {
    fields.email.classList.add('error');
    isValid = false;
  }

  if (!validatePhoneNumber(fields.phone.value)) {
    fields.phone.classList.add('error');
    isValid = false;
  }

  if (!/^\d{6}$/.test(fields.otp.value.trim())) {
    fields.otp.classList.add('error');
    isValid = false;
  }

  if (!/^\d{4}$/.test(fields.pin.value.trim())) {
    fields.pin.classList.add('error');
    isValid = false;
  }

  if (fields.pin.value.trim() !== fields.confirmPin.value.trim()) {
    fields.confirmPin.classList.add('error');
    isValid = false;
  }

  if (!fields.terms.checked) {
    showMessage('Please accept the terms and conditions before submitting.', true);
    return;
  }

  if (!isValid) {
    showMessage('Please fill in all fields correctly before submitting.', true);
    return;
  }

  showMessage('Application submitted successfully. We will contact you shortly.');
  loanForm.reset();
  updateLoanSummary();
  document.getElementById('loanRange').value = 8000;
});
