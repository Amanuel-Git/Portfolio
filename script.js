const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const contactForm = document.getElementById('contactForm');
const statusMessage = document.getElementById('formStatus');
const resumeLink = document.getElementById('resumeLink');

function smoothScroll(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('href');
  const targetSection = document.querySelector(targetId);

  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  }
}

function closeMenu() {
  if (!mainNav || !menuToggle) return;
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  if (!mainNav || !menuToggle) return;
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}

function updateActiveNav() {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    }
  });
}

function setTheme(mode) {
  document.body.classList.toggle('light', mode === 'light');
  const label = mode === 'light' ? '🌙' : '☀️';
  themeToggle.textContent = label;
  localStorage.setItem('theme', mode);
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme('dark');
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(event) {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const message = formData.get('message').trim();

  if (!name || !email || !message) {
    statusMessage.textContent = 'Please complete every field before sending your message.';
    statusMessage.style.color = '#f97316';
    return;
  }

  if (!validateEmail(email)) {
    statusMessage.textContent = 'Please enter a valid email address.';
    statusMessage.style.color = '#f97316';
    return;
  }

  statusMessage.textContent = 'Thanks! Your message is ready to send. (Form handling can be connected to email or backend.)';
  statusMessage.style.color = '#22c55e';
  contactForm.reset();
}

navLinks.forEach((link) => link.addEventListener('click', smoothScroll));
window.addEventListener('scroll', updateActiveNav);
window.addEventListener('resize', updateActiveNav);
contactForm.addEventListener('submit', validateForm);
if (menuToggle) {
  menuToggle.addEventListener('click', toggleMenu);
}

document.addEventListener('click', (event) => {
  if (!mainNav || !menuToggle) return;
  const clickedInsideMenu = mainNav.contains(event.target);
  const clickedMenuButton = menuToggle.contains(event.target);
  if (!clickedInsideMenu && !clickedMenuButton) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

themeToggle.addEventListener('click', () => {
  const currentMode = document.body.classList.contains('light') ? 'light' : 'dark';
  setTheme(currentMode === 'light' ? 'dark' : 'light');
});

initTheme();
updateActiveNav();
