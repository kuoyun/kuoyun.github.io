document.addEventListener('DOMContentLoaded', function () {

  // Mobile navigation toggle
  var toggle = document.querySelector('.site-navigation-toggle');
  var dropdown = document.getElementById('site-navigation-dropdown');

  if (toggle && dropdown) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      dropdown.classList.toggle('is-open', !isOpen);
      if (isOpen) {
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.setAttribute('inert', '');
      } else {
        dropdown.removeAttribute('aria-hidden');
        dropdown.removeAttribute('inert');
      }
    });
  }

  // FAQ / accordion widgets
  function closeAccordionItem(title) {
    var content = document.getElementById(title.getAttribute('aria-controls'));
    title.classList.remove('elementor-active');
    title.setAttribute('aria-expanded', 'false');
    if (content) {
      content.style.maxHeight = content.scrollHeight + 'px';
      requestAnimationFrame(function () {
        content.classList.remove('is-open');
        content.style.maxHeight = '0px';
      });
    }
  }

  function openAccordionItem(title) {
    var content = document.getElementById(title.getAttribute('aria-controls'));
    title.classList.add('elementor-active');
    title.setAttribute('aria-expanded', 'true');
    if (content) {
      content.classList.add('is-open');
      content.style.maxHeight = content.scrollHeight + 'px';
      content.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName !== 'max-height') return;
        content.style.maxHeight = 'none';
        content.removeEventListener('transitionend', onEnd);
      });
    }
  }

  document.querySelectorAll('.elementor-accordion').forEach(function (accordion) {
    var titles = accordion.querySelectorAll('.elementor-tab-title');
    titles.forEach(function (title) {
      title.addEventListener('click', function () {
        var isActive = title.classList.contains('elementor-active');

        titles.forEach(function (other) {
          if (other.classList.contains('elementor-active')) closeAccordionItem(other);
        });

        if (!isActive) openAccordionItem(title);
      });
    });
  });

  // Elementor entrance animations (fadeIn, fadeInLeft, ...)
  var animated = document.querySelectorAll('.elementor-invisible[data-settings]');
  if ('IntersectionObserver' in window && animated.length) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var settings = {};
        try { settings = JSON.parse(el.getAttribute('data-settings')); } catch (e) {}
        var animation = settings._animation;
        el.classList.remove('elementor-invisible');
        if (animation) el.classList.add('animated', animation);
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    animated.forEach(function (el) { observer.observe(el); });
  } else {
    animated.forEach(function (el) { el.classList.remove('elementor-invisible'); });
  }
});
