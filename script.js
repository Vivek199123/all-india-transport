// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

// Animate on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.aos, .aos-left, .aos-right').forEach(el => {
  observer.observe(el);
});

// Scroll to Top Button
const scrollTop = document.querySelector('.scroll-top');
if (scrollTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Active Navigation Link
const navLinksAll = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinksAll.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// Form Validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
      if (input.required && !input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#e74c3c';
      } else {
        input.style.borderColor = '';
      }
    });

    if (!isValid) {
      e.preventDefault();
      alert('Please fill in all required fields');
    }
  });
});

// Lazy Loading Images
if ('IntersectionObserver' in window) {
  const images = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => imgObserver.observe(img));
}

// Smooth Scroll Behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Track Page Views for Analytics
if (typeof gtag !== 'undefined') {
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href
  });
}

// ─────────────────────────────────────────────
// MOBILE IMAGE FIX
// Prevents images from overflowing the viewport
// on small screens. Works on all images including
// those loaded dynamically after page load.
// ─────────────────────────────────────────────
(function () {
  const MOBILE_BREAKPOINT = 768;

  // Inject a <style> block so the fix applies even
  // before JS finishes running (render-safe).
  function injectResponsiveImageStyles() {
    const style = document.createElement('style');
    style.id = 'ait-mobile-img-fix';
    style.textContent = `
      @media (max-width: ${MOBILE_BREAKPOINT}px) {
        img {
          max-width: 100% !important;
          height: auto !important;
          display: block;
        }

        /* Prevent fixed-width inline styles from
           overriding responsive behaviour */
        img[width], img[style*="width"] {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }

        /* Stop parent containers clipping or
           causing horizontal scroll */
        figure, picture, .img-wrap,
        .image-wrapper, .thumb, .thumbnail,
        [class*="gallery"], [class*="banner"],
        [class*="hero"], [class*="slider"],
        [class*="carousel"] {
          max-width: 100% !important;
          overflow: hidden !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Also strip oversized inline width/height
  // attributes at runtime (belt-and-suspenders).
  function fixImageAttributes(root) {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;

    root.querySelectorAll('img').forEach(img => {
      const naturalW = img.naturalWidth || 0;
      const viewportW = window.innerWidth;

      // Remove hard-coded width attributes wider than viewport
      if (img.hasAttribute('width')) {
        const attrW = parseInt(img.getAttribute('width'), 10);
        if (attrW > viewportW) {
          img.removeAttribute('width');
          img.removeAttribute('height'); // keep aspect ratio
        }
      }

      // Strip inline styles that force a fixed width
      if (img.style.width && parseInt(img.style.width, 10) > viewportW) {
        img.style.width = '100%';
        img.style.height = 'auto';
      }

      // Mark oversized natural-width images
      if (naturalW > viewportW) {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      }
    });
  }

  // Watch for dynamically added images (e.g. sliders,
  // lazy loaders, JS-rendered sections).
  function observeDynamicImages() {
    if (!window.MutationObserver) return;

    const mo = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return; // elements only
          if (node.tagName === 'IMG') {
            fixImageAttributes(node.parentElement || document.body);
          } else if (node.querySelectorAll) {
            fixImageAttributes(node);
          }
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Run order: styles first (sync), then attribute
  // fixes after DOM + images are available.
  injectResponsiveImageStyles();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fixImageAttributes(document);
      observeDynamicImages();
    });
  } else {
    fixImageAttributes(document);
    observeDynamicImages();
  }

  // Re-run on orientation change (portrait ↔ landscape)
  window.addEventListener('orientationchange', () => {
    setTimeout(() => fixImageAttributes(document), 300);
  });

  // Re-run on resize in case user resizes a browser window
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fixImageAttributes(document), 200);
  });
})();
