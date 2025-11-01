/**
 * Header client-side interactions
 */

'use strict';

(function () {
  'use strict';

  // Update active navigation item
  function updateActiveNav(activeId) {
    const navItems = document.querySelectorAll('.nav-menu li');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    // Remove active from all items
    navItems.forEach((item) => {
      item.classList.remove('active');
    });

    // Add active to matching item
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.closest('li')?.classList.add('active');
      }
    });
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      event.preventDefault();
      const href = this.getAttribute('href');
      const target = document.querySelector(href);

      if (target) {
        // Update active state immediately
        const sectionId = href.substring(1); // Remove #
        updateActiveNav(sectionId);

        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  // Update active nav based on scroll position
  function handleScroll() {
    const sections = document.querySelectorAll('section[id]');
    // const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    let current = '';
    const scrollPosition = window.pageYOffset + 150; // Offset for better detection

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      updateActiveNav(current);
    }
  }

  // Throttled scroll handler
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScroll, 100);
  });

  // Initial check on load
  handleScroll();

  // Sticky header on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Get theme from localStorage or prefer user's system preference
  function getInitialTheme() {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
    } catch {
      // Ignore storage issues
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  // Apply theme
  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);

    // Update toggle button icons
    const lightIcon = themeToggle?.querySelector('.theme-icon-light');
    const darkIcon = themeToggle?.querySelector('.theme-icon-dark');

    if (theme === 'dark') {
      lightIcon?.style.setProperty('display', 'none');
      darkIcon?.style.setProperty('display', 'flex');
    } else {
      lightIcon?.style.setProperty('display', 'flex');
      darkIcon?.style.setProperty('display', 'none');
    }

    // Save preference
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage issues
    }
  }

  // Initialize theme
  applyTheme(getInitialTheme());

  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        try {
          const savedTheme = localStorage.getItem('theme');
          if (!savedTheme) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        } catch {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  }

  // Language switcher
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (!lang) return;

      // Store preference
      try {
        localStorage.setItem('preferred-lang', lang);
      } catch {
        // Ignore storage issues (private mode, etc.)
      }

      // Navigate to the correct HTML file
      const currentPath = window.location.pathname;
      let newPath;

      if (lang === 'en') {
        // Switch to English version
        if (currentPath.endsWith('index.html')) {
          newPath = currentPath.replace('index.html', 'index-en.html');
        } else if (currentPath === '/' || currentPath.endsWith('/')) {
          newPath = '/index-en.html';
        } else {
          newPath = '/index-en.html';
        }
      } else {
        // Switch to Russian version (default)
        if (currentPath.includes('index-en.html')) {
          newPath = currentPath.replace('index-en.html', 'index.html');
        } else {
          newPath = '/index.html';
        }
      }

      window.location.href = newPath;
    });
  });
})();
