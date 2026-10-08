(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;
  var body = document.body;
  var header = document.querySelector('[data-header]');
  var menu = document.querySelector('[data-menu]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var heroImg = document.querySelector('.hero__media img');

  // Header: solid once the page scrolls, tucked away while scrolling down,
  // back as soon as the visitor scrolls up. Also drives a light hero parallax.
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    if (!body.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', y > lastY && y > 360);
    }
    if (heroImg && !reduceMotion && y < window.innerHeight) {
      heroImg.style.translate = '0 ' + (y * 0.22).toFixed(1) + 'px';
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // Keyboard users tabbing back into a hidden header should see it.
  header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

  // Mobile menu
  if (menu && toggle) {
    var label = toggle.querySelector('[data-label-open]');

    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? label.getAttribute('data-label-close') : label.getAttribute('data-label-open');
      if (open) header.classList.remove('is-hidden');
    };

    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        setMenu(false);
        toggle.focus();
        return;
      }
      // Keep focus inside the toggle + menu while it is open.
      if (e.key === 'Tab') {
        var focusables = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    window.matchMedia('(min-width: 62em)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  // Scroll reveal, staggered for elements entering together.
  var revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty('--reveal-delay', Math.min(n++, 5) * 90 + 'ms');
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealables.forEach(function (el) { observer.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Magnetic call-to-action button.
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.cta__button').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
      });
      btn.addEventListener('pointerleave', function () { btn.style.translate = ''; });
    });
  }

  // Gallery lightbox (native <dialog>; links still work without it).
  var dialog = document.querySelector('[data-lightbox-dialog]');
  if (dialog && typeof dialog.showModal === 'function') {
    var img = dialog.querySelector('img');
    document.querySelectorAll('[data-lightbox]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = link.querySelector('img');
        img.src = link.href;
        img.alt = thumb ? thumb.alt : '';
        dialog.showModal();
      });
    });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.closest('[data-lightbox-close]')) dialog.close();
    });
  }
})();
