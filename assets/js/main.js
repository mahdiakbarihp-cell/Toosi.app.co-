(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var faDigits = '۰۱۲۳۴۵۶۷۸۹';

  var fallbackMeta = {
    fa: {
      title: 'طوسی | طراحی وب و توسعه اندروید — TOOSI.APP.CO',
      desc: 'مهدی طوسی، طراح و توسعه‌دهنده وب و اندروید. طراحی سایت‌های سریع، اپلیکیشن‌های اندروید و محصولات دیجیتال با دقت مهندسی.'
    },
    en: {
      title: 'TOOSI.APP.CO — Web Design & Android Development',
      desc: 'Mahdi Toosi — web designer and Android developer. Fast websites, Android apps and digital products built with engineering precision.'
    }
  };

  function formatNum(value, lang) {
    var str = String(Math.round(value));
    if (lang === 'fa') {
      str = str.replace(/\d/g, function (d) { return faDigits[+d]; });
    }
    return str;
  }

  function currentLang() {
    return root.classList.contains('is-en') ? 'en' : 'fa';
  }

  function pageMeta(lang) {
    var data = body.dataset || {};
    var fallback = fallbackMeta[lang] || fallbackMeta.fa;
    return {
      title: (lang === 'fa' ? data.titleFa : data.titleEn) || fallback.title,
      desc: (lang === 'fa' ? data.descFa : data.descEn) || fallback.desc
    };
  }

  function setMeta(property, value, attr) {
    var el = $('meta[' + (attr || 'property') + '="' + property + '"]');
    if (el && value) el.setAttribute('content', value);
  }

  function applyLanguage(lang, persist, syncCounters) {
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
    root.classList.toggle('is-en', lang === 'en');

    $$('[data-lang-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-btn') === lang));
    });

    $$('[data-ph-fa]').forEach(function (el) {
      el.placeholder = lang === 'fa' ? el.getAttribute('data-ph-fa') : el.getAttribute('data-ph-en');
    });

    $$('#topic option').forEach(function (opt) {
      var value = lang === 'fa' ? opt.getAttribute('data-fa') : opt.getAttribute('data-en');
      if (value) opt.textContent = value;
    });

    var m = pageMeta(lang);
    document.title = m.title;
    setMeta('description', m.desc, 'name');
    setMeta('og:title', m.title);
    setMeta('og:description', m.desc);
    setMeta('twitter:title', m.title, 'name');
    setMeta('twitter:description', m.desc, 'name');
    setMeta('og:locale', lang === 'fa' ? 'fa_IR' : 'en_US');

    if (syncCounters) {
      $$('.stat-num').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        el.textContent = formatNum(target, lang);
      });
    }

    if (persist) {
      try { localStorage.setItem('toosi-lang', lang); } catch (e) {}
    }

    try {
      document.dispatchEvent(new CustomEvent('toosi:lang', { detail: { lang: lang } }));
    } catch (e) {
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('toosi:lang', true, true, { lang: lang });
      document.dispatchEvent(evt);
    }
  }

  body.classList.add('js-ready');

  $$('[data-lang-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLanguage(btn.getAttribute('data-lang-btn'), true, true);
    });
  });

  applyLanguage(currentLang(), false, false);

  var header = $('#siteHeader');
  var nav = $('#primaryNav');
  var menuToggle = $('#menuToggle');

  function onScrollHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  }
  onScrollHeader();

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('nav-open');
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      body.classList.toggle('nav-open', open);
    });

    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  function bindFramePhoto(frame, src, className, alt) {
    if (!frame) return;
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement('img');
      img.src = src;
      img.alt = alt || '';
      img.className = className;
      img.loading = 'lazy';
      img.decoding = 'async';
      frame.insertBefore(img, frame.firstChild);
      frame.classList.add('has-photo');
    };
    probe.src = src;
  }

  bindFramePhoto($('.about-frame'), 'assets/img/portrait.jpg', 'about-photo', 'Mahdi Toosi');

  var hero = $('.hero');
  var heroVisual = $('#heroVisual');
  if (hero) {
    var heroBg = new Image();
    heroBg.onload = function () { hero.classList.add('has-hero-bg'); };
    heroBg.src = 'assets/img/hero-bg.jpg';
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      hero.style.setProperty('--mx', x + '%');
      hero.style.setProperty('--my', y + '%');
      if (heroVisual && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        var rx = (y - 50) / 50 * -3.5;
        var ry = (x - 50) / 50 * 3.5;
        heroVisual.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      }
    });
    hero.addEventListener('pointerleave', function () {
      if (heroVisual) heroVisual.style.transform = '';
    });
  }

  $$('[data-reveal]').forEach(function (el) {
    var delay = el.getAttribute('data-delay');
    if (delay) el.style.transitionDelay = delay + 'ms';
    if (reduceMotion) el.classList.add('in');
  });

  var revealObserver = null;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach(function (el) { revealObserver.observe(el); });
  } else {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  }

  function observeNewReveals(scope) {
    if (!revealObserver) {
      $$('[data-reveal]', scope).forEach(function (el) { el.classList.add('in'); });
      return;
    }
    $$('[data-reveal]', scope).forEach(function (el) {
      if (!el.classList.contains('in')) revealObserver.observe(el);
    });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) {
      el.textContent = formatNum(target, currentLang());
      return;
    }
    el.textContent = formatNum(0, currentLang());
    var start = null;
    var duration = 1400;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNum(target * eased, currentLang());
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target, currentLang());
    }
    requestAnimationFrame(step);
  }

  var statObserver = null;
  if ('IntersectionObserver' in window) {
    statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    $$('.stat-num').forEach(function (el) { statObserver.observe(el); });
  } else {
    $$('.stat-num').forEach(animateCount);
  }

  var sections = $$('main section[id]');
  var navLinks = $$('.nav a[href^="#"]');
  var spyTicking = false;

  function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;
    var pos = window.scrollY + 140;
    var current = sections[0] ? sections[0].id : '';
    sections.forEach(function (section) {
      if (section.offsetTop <= pos) {
        var hasLink = navLinks.some(function (link) {
          return link.getAttribute('href') === '#' + section.id;
        });
        if (hasLink) current = section.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
    spyTicking = false;
  }

  function onScroll() {
    onScrollHeader();
    if (!spyTicking) {
      spyTicking = true;
      requestAnimationFrame(updateActiveNav);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateActiveNav);
  updateActiveNav();

  var toast = $('#toast');
  var toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 4200);
  }

  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lang = currentLang();
      var name = $('#name', form).value.trim();
      var message = $('#message', form).value.trim();
      var topicSelect = $('#topic', form);
      var selected = topicSelect ? topicSelect.options[topicSelect.selectedIndex] : null;
      var topic = selected ? (lang === 'fa' ? selected.getAttribute('data-fa') : selected.getAttribute('data-en')) : '';

      if (!name || !message) {
        showToast(lang === 'fa' ? 'لطفاً نام و توضیح پروژه را کامل کنید.' : 'Please fill in your name and project brief.');
        return;
      }

      var text = lang === 'fa'
        ? 'سلام مهندس طوسی،\nنام: ' + name + '\nموضوع: ' + (topic || '') + '\n\n' + message
        : 'Hello Mr. Toosi,\nName: ' + name + '\nTopic: ' + (topic || '') + '\n\n' + message;

      var url = 'https://wa.me/9893677781266?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
      showToast(lang === 'fa' ? 'واتساپ باز شد؛ پیام را ارسال کنید.' : 'WhatsApp opened — press send.');
    });
  }

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  window.ToosiUI = {
    applyLanguage: applyLanguage,
    currentLang: currentLang,
    formatNum: formatNum,
    observeNewReveals: observeNewReveals,
    showToast: showToast
  };
})();
