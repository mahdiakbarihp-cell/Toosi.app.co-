(function () {
  'use strict';

  var project = null;
  var allProjects = [];
  var lang = document.documentElement.lang === 'en' ? 'en' : 'fa';

  function $(sel) { return document.querySelector(sel); }

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

  function slugFromPath() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('slug')) return params.get('slug').replace(/\/+$/, '');
    var path = window.location.pathname.replace(/\/+$/, '');
    var parts = path.split('/');
    var last = parts[parts.length - 1] || '';
    if (last === 'project.html' || last === 'project') {
      return parts[parts.length - 2] || '';
    }
    return decodeURIComponent(last);
  }

  function setMeta(name, value, attr) {
    var el = $('meta[' + (attr || 'property') + '="' + name + '"]');
    if (el && value != null) el.setAttribute('content', value);
  }

  function absolute(path) {
    return 'https://toosi.app.co/' + String(path || '').replace(/^\/+/, '');
  }

  function setSchema(data) {
    var id = 'projectSchema';
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  function updateMeta() {
    if (!project) return;
    var title = pick(project, 'seoTitle') || pick(project, 'title');
    var desc = pick(project, 'seoDescription') || pick(project, 'description');
    var url = 'https://toosi.app.co/portfolio/' + encodeURIComponent(project.slug);
    var image = absolute(project.cover);

    document.title = title + ' — TOOSI.APP.CO';
    setMeta('description', desc, 'name');
    setMeta('og:title', title);
    setMeta('og:description', desc);
    setMeta('og:image', image);
    setMeta('og:url', url);
    setMeta('twitter:title', title, 'name');
    setMeta('twitter:description', desc, 'name');
    setMeta('twitter:image', image, 'name');

    var canonical = $('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);

    setSchema({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      'name': pick(project, 'title'),
      'description': desc,
      'url': url,
      'image': image,
      'dateCreated': project.year,
      'creator': {
        '@type': 'Person',
        'name': 'Mahdi Toosi',
        'url': 'https://toosi.app.co/'
      },
      'keywords': (project.technologies || []).join(', ')
    });
  }

  function renderMeta() {
    var meta = $('#projectMeta');
    if (!meta) return;
    var rows = [
      [lang === 'fa' ? 'دسته' : 'Category', pick(project, 'category')],
      [lang === 'fa' ? 'نقش' : 'Role', pick(project, 'role')],
      [lang === 'fa' ? 'کارفرما' : 'Client', pick(project, 'client')],
      [lang === 'fa' ? 'سال' : 'Year', project.year],
      [lang === 'fa' ? 'وضعیت' : 'Status', pick(project, 'status')]
    ];
    meta.innerHTML = rows.map(function (row) {
      return '<div><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>';
    }).join('');
  }

  function renderLinks() {
    var wrap = $('#projectLinks');
    if (!wrap) return;
    var links = [];
    if (project.projectUrl) {
      links.push('<a class="btn btn-primary btn-block" href="' + esc(project.projectUrl) + '" target="_blank" rel="noopener">' +
        (lang === 'fa' ? 'مشاهدهٔ سایت پروژه' : 'Visit live project') +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></a>');
    }
    if (project.storeUrl) {
      links.push('<a class="btn btn-ghost btn-block" href="' + esc(project.storeUrl) + '" target="_blank" rel="noopener">' +
        (lang === 'fa' ? 'دریافت از گوگل پلی' : 'Get it on Google Play') + '</a>');
    }
    wrap.innerHTML = links.join('');
  }

  function renderGallery() {
    var gallery = $('#projectGallery');
    if (!gallery) return;
    var images = project.gallery || [];
    gallery.innerHTML = images.map(function (src) {
      return '<img src="/' + esc(src) + '" alt="" loading="lazy" decoding="async">';
    }).join('');
    gallery.style.display = images.length ? '' : 'none';
  }

  function renderNext() {
    var wrap = $('#projectNext');
    if (!wrap || !allProjects.length) return;
    var index = allProjects.findIndex(function (p) { return p.slug === project.slug; });
    if (index === -1) return;
    var next = allProjects[(index + 1) % allProjects.length];
    wrap.innerHTML = '<span class="project-cat">' + (lang === 'fa' ? 'پروژهٔ بعدی' : 'Next project') + '</span>' +
      '<a href="/portfolio/' + encodeURIComponent(next.slug) + '">' + esc(pick(next, 'title')) +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';
  }

  function renderProject() {
    lang = document.documentElement.lang === 'en' ? 'en' : 'fa';
    if (!project) return;

    var breadcrumb = $('#projectBreadcrumb');
    if (breadcrumb) breadcrumb.textContent = pick(project, 'title');

    var eyebrow = $('#projectEyebrow');
    if (eyebrow) eyebrow.textContent = pick(project, 'category');

    var title = $('#projectTitle');
    if (title) title.textContent = pick(project, 'title');

    var lead = $('#projectLead');
    if (lead) lead.textContent = pick(project, 'description');

    var cover = $('#projectCover');
    if (cover) {
      cover.src = '/' + project.cover;
      cover.alt = pick(project, 'title');
    }

    var tags = $('#projectTags');
    if (tags) {
      tags.innerHTML = (project.technologies || []).map(function (tag) {
        return '<span>' + esc(tag) + '</span>';
      }).join('');
    }

    var body = $('#projectBody');
    if (body) {
      var paragraphs = project['long_' + lang] || project.long_fa || [];
      body.innerHTML = paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    }

    renderMeta();
    renderLinks();
    renderGallery();
    renderNext();
    updateMeta();

    var loading = $('#projectLoading');
    if (loading) loading.hidden = true;
    var content = $('#projectContent');
    if (content) content.hidden = false;
  }

  function showNotFound() {
    var content = $('#projectContent');
    if (content) content.hidden = true;
    var loading = $('#projectLoading');
    if (loading) loading.hidden = true;
    var empty = $('#projectNotFound');
    if (empty) empty.hidden = false;
    document.title = (lang === 'fa' ? 'پروژه پیدا نشد' : 'Project not found') + ' — TOOSI.APP.CO';
    var canonical = $('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://toosi.app.co/portfolio/');
  }

  function init() {
    var slug = slugFromPath();
    fetch('/data/projects.json', { headers: { 'Accept': 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        allProjects = Array.isArray(data) ? data : (data.projects || []);
        project = allProjects.filter(function (p) { return p.slug === slug; })[0] || null;
        if (!project) {
          showNotFound();
          return;
        }
        renderProject();
      })
      .catch(showNotFound);
  }

  document.addEventListener('toosi:lang', function () {
    if (project) renderProject();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
