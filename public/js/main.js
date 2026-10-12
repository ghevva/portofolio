/**
 * MAIN JAVASCRIPT FILE
 * Navbar interactions: Smooth Scroll, Scroll Elevation, Mobile Navigation Toggle & Active State
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation DOM Elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Create Mobile Backdrop Element dynamically if it doesn't exist
  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  // Toggle Mobile Menu
  function toggleMobileMenu(forceClose = false) {
    if (!navMenu || !navToggle) return;
    
    const isOpen = forceClose ? false : !navMenu.classList.contains('active');
    
    if (isOpen) {
      navMenu.classList.add('active');
      navToggle.classList.add('active');
      navBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling when menu is open
    } else {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    navToggle.setAttribute('aria-expanded', isOpen);
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => toggleMobileMenu());
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', () => toggleMobileMenu(true));
  }

  // Close Mobile Menu on Nav Link Click & Handle Smooth Scrolling
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      toggleMobileMenu(true);
      
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const offsetTop = targetElement.offsetTop - 64; // Navbar height offset
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Header Background Transformation on Scroll
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check

  // Active Nav Link Highlight & Scroll Reveal Observer
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const observerOptions = {
    root: null,
    rootMargin: '-15% 0px -25% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Highlight active nav link
        const id = entry.target.getAttribute('id');
        if (id) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Scroll Reveal Observer for elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // LANGUAGE SWITCHER ENGINE (i18n)
  // ==========================================================================
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;

    // Set HTML lang attribute
    document.documentElement.lang = lang;

    // Update text elements
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });

    // Update input placeholders
    const i18nPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
    i18nPlaceholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang][key] !== undefined) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Update switcher buttons UI active state
    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Save language preference to localStorage
    try {
      localStorage.setItem('portfolio_lang', lang);
    } catch (e) {
      console.warn('Unable to save language preference:', e);
    }
  }

  // Initialize Language
  const savedLang = (function() {
    try {
      return localStorage.getItem('portfolio_lang') || 'id';
    } catch (e) {
      return 'id';
    }
  })();
  setLanguage(savedLang);

  // Attach click listeners to language toggle buttons
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang) {
        setLanguage(selectedLang);
      }
    });
  });
});


