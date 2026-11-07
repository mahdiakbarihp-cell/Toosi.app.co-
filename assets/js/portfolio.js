(function () {
  'use strict';

  var DATA_URL = '/data/projects.json';
  var projects = [];
  var activeFilter = 'all';
  var lang = document.documentElement.lang === 'en' ? 'en' : 'fa';

  function pick(obj, key) {
    return obj[key + '_' + lang] || obj[key + '_fa'] || '';
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function statusClass(project) {
    var status = (project.status_en || '').toLowerCase();
    if (status.indexOf('development') !== -1) return 'is-dev';
    if (status.indexOf('case') !== -1) return 'is-case';
    return '';
  }

  function tags(project, limit) {
    return (project.technologies || []).slice(0, limit || 3).map(function (tag) {
      return '<span>' + esc(tag) + '</span>';
    }).join('');
  }

  function card(project, index) {
    var title = pick(project, 'title');
    var desc = pick(project, 'description');
    var cat = pick(project, 'category');
    var status = pick(project, 'status');
    var href = '/portfolio/' + encodeURIComponent(project.slug);
    var linkLabel = lang === 'fa' ? 'مشاهدهٔ پروژه' : 'View project';
    var delay = (index % 3) * 70;
    return '' +
      '<article class="project-card" data-cat="' + esc(project.category) + '" data-reveal data-delay="' + delay + '">' +
        '<a class="project-card-media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
          '<img src="/' + esc(project.cover) + '" alt="" width="1200" height="900" loading="lazy" decoding="async">' +
        '</a>' +
        '<div class="project-card-body">' +
          '<div class="project-card-top">' +
            '<span class="project-cat">' + esc(cat) + '</span>' +
            '<span class="project-status ' + statusClass(project) + '"><i aria-hidden="true"></i>' + esc(status) + '</span>' +
          '</div>' +
          '<h3><a href="' + href + '">' + esc(title) + '</a></h3>' +
          '<p>' + esc(desc) + '</p>' +
          '<div class="tags">' + tags(project) + '</div>' +
          '<a class="project-card-link" href="' + href + '">' + linkLabel +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</a>' +
        '</div>' +
      '</article>';
  }

  function renderGrid(el, list) {
    if (!el) return;
    if (!list.length) {
      el.innerHTML = '';
      return;
    }
    el.innerHTML = list.map(card).join('');
    if (window.ToosiUI && window.ToosiUI.observeNewReveals) {
      window.ToosiUI.observeNewReveals(el);
    }
  }

  function updateCount() {
    var count = document.getElementById('portfolioCount');
    if (!count) return;
    var visible = projects.filter(function (p) {
      return activeFilter === 'all' || p.category === activeFilter;
    }).length;
    var num = window.ToosiUI && window.ToosiUI.formatNum ? window.ToosiUI.formatNum(visible, lang) : visible;
    count.textContent = lang === 'fa'
      ? num + ' پروژه نمایش داده می‌شود'
      : num + (visible === 1 ? ' project' : ' projects');
  }

  function renderPortfolio() {
    var grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    var visible = projects.filter(function (p) {
      return activeFilter === 'all' || p.category === activeFilter;
    });
    renderGrid(grid, visible);
    var empty = document.getElementById('portfolioEmpty');
    if (empty) empty.classList.toggle('show', visible.length === 0);
    updateCount();
  }

  function applyFilter(filter) {
    activeFilter = filter || 'all';
    var buttons = document.querySelectorAll('[data-filter]');
    Array.prototype.forEach.call(buttons, function (btn) {
      var active = btn.getAttribute('data-filter') === activeFilter;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    renderPortfolio();
  }

  function renderHome() {
    var featured = document.getElementById('featuredProjects');
    if (featured) {
      renderGrid(featured, projects.filter(function (p) { return p.featured; }).slice(0, 6));
    }
    var products = document.getElementById('digitalProducts');
    if (products) {
      renderGrid(products, projects.filter(function (p) {
        return p.category === 'android' && p.featured;
      }).slice(0, 4));
    }
  }

  function renderAll() {
    lang = document.documentElement.lang === 'en' ? 'en' : 'fa';
    renderHome();
    renderPortfolio();
  }

  function bindFilters() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-filter]') : null;
      if (!btn) return;
      applyFilter(btn.getAttribute('data-filter'));
    });
  }

  function init() {
    bindFilters();
    fetch(DATA_URL, { headers: { 'Accept': 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        projects = Array.isArray(data) ? data : (data.projects || []);
        renderAll();
        var hash = (window.location.hash || '').replace('#', '');
        if ((hash === 'websites' || hash === 'android' || hash === 'engineering') && document.getElementById('portfolioGrid')) {
          applyFilter(hash);
        }
      })
      .catch(function () {
        var empty = document.getElementById('portfolioEmpty');
        if (empty) {
          empty.classList.add('show');
          empty.textContent = lang === 'fa'
            ? 'داده‌های پروژه در دسترس نیست. لطفاً صفحه را دوباره بارگذاری کنید.'
            : 'Project data is unavailable. Please reload the page.';
        }
      });
  }

  document.addEventListener('toosi:lang', function () {
    if (projects.length) renderAll();
  });

  window.addEventListener('hashchange', function () {
    if (!projects.length || !document.getElementById('portfolioGrid')) return;
    var hash = (window.location.hash || '').replace('#', '');
    if (hash === 'websites' || hash === 'android' || hash === 'engineering') {
      applyFilter(hash);
    } else {
      applyFilter('all');
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
