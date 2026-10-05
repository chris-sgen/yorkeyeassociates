/* site.js: behaviour for the whole site. Progressive: every page reads and works without it. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  /* the site's root, read from where its own stylesheet was found: the build also runs from a folder */
  var sheet = $('link[rel="stylesheet"][href*="assets/css/"]');
  var siteRoot = sheet ? sheet.href.slice(0, sheet.href.indexOf('assets/css/')) : '/';
  var fromRoot = function (u) { return u && u.charAt(0) === '/' ? siteRoot + u.slice(1) : u; };

  /* ---- header: shadow once the page moves; the top bar tucks away further down ---- */
  var header = $('[data-header]');
  if (header) {
    var ticking = false;
    var onScroll = function () {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle('is-stuck', y > 8);
      header.classList.toggle('is-compact', y > 220);
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ---- header panels: click, keyboard, outside click; hover is CSS ---- */
  var toggles = $$('.menu__toggle');
  var closePanels = function (except) {
    toggles.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      var p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = true;
    });
  };
  toggles.forEach(function (t) {
    var panel = doc.getElementById(t.getAttribute('aria-controls'));
    if (!panel) return;
    t.addEventListener('click', function () {
      var open = t.getAttribute('aria-expanded') === 'true';
      closePanels(t);
      t.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });
  doc.addEventListener('click', function (e) { if (!e.target.closest('.menu__item--panel')) closePanels(); });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = toggles.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; })[0];
    if (open) { closePanels(); open.focus(); }
  });
  $$('.menu__item--panel').forEach(function (li) {
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) { var t = $('.menu__toggle', li); if (t && t.getAttribute('aria-expanded') === 'true') closePanels(); } });
  });

  /* ---- drawer ---- */
  var drawer = $('[data-drawer]');
  var opener = $('[data-drawer-open]');
  if (drawer && opener) {
    var lastFocus = null;
    var focusables = function () { return $$('a[href], button, summary, input', drawer).filter(function (el) { return el.offsetParent !== null; }); };
    var close = function () {
      drawer.hidden = true;
      opener.setAttribute('aria-expanded', 'false');
      doc.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    var open = function () {
      lastFocus = doc.activeElement;
      drawer.hidden = false;
      opener.setAttribute('aria-expanded', 'true');
      doc.body.style.overflow = 'hidden';
      var f = focusables();
      if (f.length) f[0].focus();
    };
    opener.setAttribute('role', 'button');
    opener.addEventListener('click', function (e) { e.preventDefault(); open(); });
    opener.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); open(); } });
    $$('[data-drawer-close]', drawer).forEach(function (b) { b.addEventListener('click', close); });
    drawer.addEventListener('click', function (e) { if (e.target === drawer) close(); });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    window.matchMedia('(min-width: 68.75em)').addEventListener('change', function (m) { if (m.matches && !drawer.hidden) close(); });
  }

  /* ---- chapters: on phones all but the first fold under their heading ---- */
  var chapters = $$('details.chapter');
  if (chapters.length) {
    var phone = window.matchMedia('(max-width: 47.99em)');
    var openFor = function (hash) {
      if (!hash || hash.length < 2) return;
      var t = doc.getElementById(decodeURIComponent(hash.slice(1)));
      var d = t && t.closest('details.chapter');
      if (d) d.open = true;
    };
    var apply = function () {
      chapters.forEach(function (d) { d.open = phone.matches ? !d.hasAttribute('data-fold') : true; });
      openFor(location.hash);
    };
    apply();
    phone.addEventListener('change', apply);
    window.addEventListener('hashchange', function () { openFor(location.hash); });
    doc.addEventListener('click', function (e) { var a = e.target.closest('a[href^="#"]'); if (a) openFor(a.getAttribute('href')); });
    /* above the phone width a chapter is always open: its summary is a heading, not a control */
    chapters.forEach(function (d) {
      var s = $('summary', d);
      if (!s) return;
      s.addEventListener('click', function (e) { if (!phone.matches) e.preventDefault(); });
      var sync = function () { if (phone.matches) s.removeAttribute('tabindex'); else s.setAttribute('tabindex', '-1'); };
      sync(); phone.addEventListener('change', sync);
    });
  }

  /* ---- contents rail: mark the chapter being read ---- */
  var tocLinks = $$('.toc__list a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove('is-current'); });
        var a = byId[en.target.id];
        if (a) a.classList.add('is-current');
      });
    }, { rootMargin: '-20% 0px -65% 0px' });
    Object.keys(byId).forEach(function (id) { var el = doc.getElementById(id); if (el) seen.observe(el); });
  }

  /* ---- today's row in every hours table (the visitor's own clock) ---- */
  var day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
  $$('.hours tr[data-day="' + day + '"]').forEach(function (tr) { tr.classList.add('is-today'); });

  /* ---- long reviews: a button opens the rest (the text is all in the page) ---- */
  $$('.review--long').forEach(function (li) {
    var text = $('.review__text', li);
    if (!text || text.scrollHeight <= text.clientHeight + 4) { li.classList.add('is-open'); return; }
    var b = doc.createElement('button');
    b.type = 'button'; b.className = 'review__toggle'; b.textContent = 'Read more'; b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () { var open = li.classList.toggle('is-open'); b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Show less' : 'Read more'; });
    text.insertAdjacentElement('afterend', b);
  });

  /* ---- video: nothing is requested from the video host until the visitor asks ---- */
  $$('.video[data-video]').forEach(function (box) {
    var link = $('.video__link', box);
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var f = doc.createElement('iframe');
      f.setAttribute('referrerpolicy', 'strict-origin'); f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(box.getAttribute('data-video')) + '?autoplay=1&rel=0';
      f.title = ($('.video__label', box) || link).textContent.trim();
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin';
      box.innerHTML = '';
      box.appendChild(f);
      f.focus();
    });
  });

  /* ---- marquee: the row is doubled so it runs without a seam; its pictures are fetched together ---- */
  $$('.marquee__row').forEach(function (row) {
    if (reduce.matches) { row.parentNode.classList.add('is-static'); return; }
    $$('li', row).forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); row.appendChild(c); });
    if (!('IntersectionObserver' in window)) return;
    var near = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; $$('img[loading="lazy"]', row).forEach(function (i) { i.loading = 'eager'; }); near.disconnect(); });
    }, { rootMargin: '900px 0px' });
    near.observe(row);
  });

  /* ---- reveal on scroll, with a stagger between siblings ---- */
  if (!reduce.matches && 'IntersectionObserver' in window) {
    var targets = $$('.band__head, .cards > .card, .posts > .post-card, .links > .link-card, .reviews > .review, .doctors > .doctor, .split__copy, .logos > .logo, .quick > li, .faq > .faq__item, .products__list > .product, .equipment > li, .visit__info, .rail-card, .toc, .tile, .fact, .price');
    var zooms = $$('.split__media, .visit__map, .strip__item, .hero__media');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    var vh = window.innerHeight;
    targets.forEach(function (el) {
      /* what is already on screen at load is left alone: no flash of hidden content */
      if (el.getBoundingClientRect().top < vh * 0.9) return;
      var i = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty('--i', String(Math.min(i, 5)));
      el.classList.add('rv');
      io.observe(el);
    });
    zooms.forEach(function (el) { if (el.getBoundingClientRect().top < vh * 0.9) return; el.classList.add('rv-zoom'); io.observe(el); });
  }

  /* ---- loops: silent background video with no controls; a poster under reduced motion or data saver ---- */
  var loops = $$('.loop[data-loop]');
  if (loops.length) {
    var saver = navigator.connection && navigator.connection.saveData;
    var started = new WeakMap();
    var start = function (box) {
      if (started.has(box) || reduce.matches || saver) return;
      var v = doc.createElement('video');
      v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true'); v.setAttribute('tabindex', '-1');
      v.disablePictureInPicture = true; v.disableRemotePlayback = true;
      v.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      var small = window.matchMedia('(max-width: 48em)').matches && box.getAttribute('data-loop-small');
      v.src = fromRoot(small || box.getAttribute('data-loop'));
      v.addEventListener('playing', function () { box.classList.add('is-playing'); });
      /* a pause the script did not ask for is undone: these loops are scenery, not players */
      v.addEventListener('pause', function () { if (box.getAttribute('data-visible') === '1' && !reduce.matches) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
      box.appendChild(v);
      started.set(box, v);
      var p = v.play();
      if (p && p.catch) p.catch(function () { v.removeAttribute('src'); v.load(); box.classList.remove('is-playing'); });
    };
    var vis = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var box = en.target;
        box.setAttribute('data-visible', en.isIntersecting ? '1' : '0');
        if (en.isIntersecting) { start(box); var v = started.get(box); if (v && v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
        else { var w = started.get(box); if (w && !w.paused) w.pause(); }
      });
    }, { rootMargin: '200px 0px' });
    loops.forEach(function (b) { vis.observe(b); });
    reduce.addEventListener('change', function () {
      loops.forEach(function (box) { var v = started.get(box); if (!v) return; if (reduce.matches) { v.pause(); box.classList.remove('is-playing'); } else { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
    });
  }
})();

/* forms.js: the practice's forms.

   What it does, per <form data-form>:
     - shows and hides the parts a rule governs (data-rule), exactly as the source form's rules read
     - checks the required fields on submit: a summary that takes focus, a message under each field
     - adds up a questionnaire (data-score-formula) and goes to its results page with ?score=N
     - on a results page, writes ?score=N into the score field; the rules then show the matching text
     - sends nothing anywhere. A form whose markup does not say data-connected never posts: a valid
       submit shows the notice that is already in the page (the practice's phone number is in it).

   It does nothing on a page without a form, keeps nothing between pages, and adds no global. */
(function () {
  'use strict';

  var forms = Array.prototype.slice.call(document.querySelectorAll('form[data-form]'));
  if (!forms.length) return;

  var CONTROLS = 'input, select, textarea, button';
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  // ---- values, compared the way the source's rules compare them --------------------------------
  var NUMERIC = /^-?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]+)?$/;
  var PLAIN_NUMBER = /^-?(?:[0-9]+\.?[0-9]*|\.[0-9]+)$/;

  function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

  // digits and the decimal point are kept, a hyphen makes it negative, everything else is dropped
  function cleanNumber(text) {
    text = String(text == null ? '' : text);
    var digits = '', negative = false, i, c;
    for (i = 0; i < text.length; i++) {
      c = text.charAt(i);
      if ((c >= '0' && c <= '9') || c === '.') digits += c;
      else if (c === '-') negative = true;
    }
    if (negative) digits = '-' + digits;
    return isNumber(digits) ? parseFloat(digits) : false;
  }
  function tryFloat(text) { return NUMERIC.test(text) ? cleanNumber(text) : text; }

  function compare(a, b, op) {
    a = String(a == null ? '' : a).toLowerCase();
    b = String(b == null ? '' : b).toLowerCase();
    if (op === 'is') return a === b;
    if (op === 'isnot') return a !== b;
    if (op === '>' || op === '<') {
      a = tryFloat(a); b = tryFloat(b);
      if (!isNumber(a) || !isNumber(b)) return false;
      return op === '>' ? a > b : a < b;
    }
    if (op === 'contains') return a.indexOf(b) >= 0;
    if (op === 'starts_with') return a.indexOf(b) === 0;
    if (op === 'ends_with') return b.length <= a.length && a.slice(a.length - b.length) === b;
    return false;
  }

  function named(form, name) {
    var out = [], i;
    if (!name) return out;
    for (i = 0; i < form.elements.length; i++) if (form.elements[i].name === name) out.push(form.elements[i]);
    return out;
  }

  // what a control holds. A number field that does not hold a number counts as empty.
  function valueOf(el) {
    if (!el || el.disabled) return '';
    var v = el.value == null ? '' : String(el.value);
    if (el.hasAttribute('data-number')) {
      v = v.trim();
      if (!PLAIN_NUMBER.test(v)) return '';
      var n = cleanNumber(v);
      return String(n ? n : 0);
    }
    return v;
  }

  function isMatch(form, r) {
    var els = named(form, r.field), first = els[0], i, el, v;
    if (first && (first.type === 'checkbox' || first.type === 'radio')) {
      var open = r.op === '<' || r.op === '>' || r.op === 'contains' || r.op === 'starts_with' || r.op === 'ends_with';
      for (i = 0; i < els.length; i++) {
        el = els[i]; v = el.value;
        if (v !== r.value && !open) continue;                     // looking for one answer, and this is another
        if (!el.checked || el.disabled) v = '';
        else if (el.hasAttribute('data-other')) v = valueOf(named(form, el.getAttribute('data-other'))[0]);
        if (compare(v, r.value, r.op)) return true;
      }
      return false;
    }
    return compare(valueOf(first), r.value, r.op);
  }

  // "show when all of ..." / "hide when any of ...": the action when the rules are met, else its opposite
  function actionOf(form, rule) {
    var met = 0;
    each(rule.rules || [], function (r) { if (isMatch(form, r)) met++; });
    var all = (rule.rules || []).length;
    var hit = (rule.match === 'all' && met === all) || (rule.match === 'any' && met > 0);
    return hit ? rule.action : (rule.action === 'show' ? 'hide' : 'show');
  }

  var parsed = new WeakMap();
  function ruleOf(el) {
    if (!parsed.has(el)) {
      var rule = null;
      try { rule = JSON.parse(el.getAttribute('data-rule')); } catch (e) { rule = null; }
      parsed.set(el, rule);
    }
    return parsed.get(el);
  }

  function setOff(el, off) {
    el.hidden = off;
    if (el.matches(CONTROLS)) el.disabled = off;
    each(el.querySelectorAll(CONTROLS), function (c) { c.disabled = off; });
  }

  // A hidden part is also switched off: it is not checked, not counted and would not be posted.
  function applyRules(form) {
    var targets = form.querySelectorAll('[data-rule]'), pass, changed;
    for (pass = 0; pass < 5; pass++) {
      changed = false;
      each(targets, function (t) {
        var rule = ruleOf(t);
        if (!rule) return;
        var off = actionOf(form, rule) === 'hide';
        if (t.hidden !== off || !t.hasAttribute('data-ruled')) { setOff(t, off); t.setAttribute('data-ruled', ''); changed = true; }
      });
      if (!changed) break;
    }
  }

  // ---- the score ---------------------------------------------------------------------------------
  function query(key) {
    try { return new URLSearchParams(window.location.search).get(key); } catch (e) { return null; }
  }

  // + - * / and brackets over plain numbers; anything else is not a sum
  function arithmetic(src) {
    var i = 0;
    function ws() { while (src.charAt(i) === ' ') i++; }
    function number() {
      ws();
      var m = /^(?:[0-9]+\.?[0-9]*|\.[0-9]+)/.exec(src.slice(i));
      if (!m) throw new Error('number');
      i += m[0].length;
      return parseFloat(m[0]);
    }
    function factor() {
      ws();
      var c = src.charAt(i), v;
      if (c === '(') { i++; v = sum(); ws(); if (src.charAt(i) !== ')') throw new Error('bracket'); i++; return v; }
      if (c === '-') { i++; return -factor(); }
      if (c === '+') { i++; return factor(); }
      return number();
    }
    function product() {
      var v = factor(), c;
      for (;;) { ws(); c = src.charAt(i); if (c === '*') { i++; v *= factor(); } else if (c === '/') { i++; v /= factor(); } else return v; }
    }
    function sum() {
      var v = product(), c;
      for (;;) { ws(); c = src.charAt(i); if (c === '+') { i++; v += product(); } else if (c === '-') { i++; v -= product(); } else return v; }
    }
    try {
      src = String(src).replace(/\s+/g, ' ');
      var out = sum();
      ws();
      if (i < src.length) return null;
      return isFinite(out) ? out : 0;
    } catch (e) { return null; }
  }

  // {name} is the chosen answer of a group, {name:Value} one answer; an answer's number is data-score
  function scoreOf(form) {
    var formula = form.getAttribute('data-score-formula');
    if (!formula) return null;
    var expr = formula.replace(/\{([^{}]+)\}/g, function (whole, tag) {
      var at = tag.indexOf(':'), name = at < 0 ? tag : tag.slice(0, at), want = at < 0 ? null : tag.slice(at + 1), total = 0;
      each(named(form, name), function (el) {
        var n;
        if (el.disabled) return;
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (!el.checked || (want !== null && el.value !== want)) return;
          n = cleanNumber(el.getAttribute('data-score'));
        } else n = cleanNumber(el.value);
        total += n ? n : 0;
      });
      return String(total);
    });
    var out = arithmetic(expr);
    return out === null ? null : String(Math.round(out * 1e6) / 1e6);
  }

  function prefill(form) {
    var name = form.getAttribute('data-score-field');
    if (!name) return;
    var v = query(form.getAttribute('data-score-param') || 'score');
    if (v === null || !/^[0-9]{1,4}(?:\.[0-9]{1,4})?$/.test(v)) return;
    var el = named(form, name)[0];
    if (el) el.value = v;
  }

  // Into view at once, by the shortest way. (A page that scrolls smoothly would otherwise take the
  // length of a long form to arrive, and the message would be read late or not at all.)
  function reveal(el) {
    if (!el || !el.scrollIntoView) return;
    try { el.scrollIntoView({ block: 'nearest', behavior: 'instant' }); } catch (e) { el.scrollIntoView(false); }
  }

  // ---- the notice ----------------------------------------------------------------------------------
  function showNotice(form, where) {
    var status = where || form.querySelector('[data-form-status]'), tpl = form.querySelector('template[data-form-notice]');
    if (!status || !tpl) return;
    status.textContent = '';
    status.appendChild(tpl.content.cloneNode(true));
    // a line that appears below the button may be below the screen: bring it into view (a submit only, not on arrival)
    if (!where) reveal(status);
    // the number is the page's own: if the notice came without one, take the page's phone link
    if (!status.querySelector('a[href^="tel:"]')) {
      var tel = document.querySelector('a[href^="tel:"]');
      if (tel) {
        var a = document.createElement('a');
        a.setAttribute('href', tel.getAttribute('href'));
        a.textContent = tel.getAttribute('href').replace(/^tel:\s*/, '');
        status.appendChild(document.createTextNode(' '));
        status.appendChild(a);
      }
    }
  }

  // ---- required fields ---------------------------------------------------------------------------
  function problems(form) {
    var out = [], seen = {};
    each(form.querySelectorAll('input, select, textarea, fieldset[data-required]'), function (el) {
      var group, box;
      if (el.disabled) return;
      if (el.tagName === 'FIELDSET') {
        group = Array.prototype.filter.call(el.querySelectorAll('input[type=checkbox], input[type=radio]'), function (c) { return !c.disabled; });
        if (!group.length || seen[group[0].name]) return;
        seen[group[0].name] = true;
        if (!group.some(function (c) { return c.checked; })) out.push({ el: group[0], box: el, group: el });
        return;
      }
      if (!el.required) return;
      box = el.closest('[data-field]');
      if (!box) return;
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (seen[el.name]) return;
        seen[el.name] = true;
        group = named(form, el.name).filter(function (c) { return !c.disabled; });
        if (!group.some(function (c) { return c.checked; })) out.push({ el: group[0], box: box, group: el.closest('fieldset') });
        return;
      }
      if (!String(el.value).trim()) out.push({ el: el, box: box, group: null });
    });
    return out;
  }

  function describe(el, id, on) {
    if (!el) return;
    var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && x !== id; });
    if (on) ids.push(id);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' ')); else el.removeAttribute('aria-describedby');
  }

  function clearBox(form, box) {
    var msg = box.querySelector('[data-form-error]');
    if (!msg) return;
    each(box.querySelectorAll('[aria-describedby]'), function (el) { describe(el, msg.id, false); });
    describe(box, msg.id, false);
    each(box.querySelectorAll('[aria-invalid]'), function (el) { el.removeAttribute('aria-invalid'); });
    box.classList.remove('is-invalid');
    var summary = form.querySelector('[data-form-summary]');
    var item = summary && summary.querySelector('[data-for-error="' + msg.id + '"]');
    if (item) item.parentNode.removeChild(item);
    msg.parentNode.removeChild(msg);
    if (summary && !summary.querySelector('li')) { summary.hidden = true; summary.textContent = ''; }
  }

  function showProblems(form, list) {
    each(form.querySelectorAll('.is-invalid'), function (box) { clearBox(form, box); });
    var summary = form.querySelector('[data-form-summary]');
    var alert = document.createElement('div'), title = document.createElement('p'), ul = document.createElement('ul');
    alert.setAttribute('role', 'alert');
    title.className = 'form__summary-title';
    title.textContent = form.getAttribute('data-msg-summary') || '';
    list.forEach(function (p) {
      var id = p.el.id + '-error';
      var msg = document.createElement('p');
      msg.className = 'field__error';
      msg.id = id;
      msg.setAttribute('data-form-error', '');
      msg.textContent = form.getAttribute('data-msg-required') || '';
      p.box.appendChild(msg);
      p.box.classList.add('is-invalid');
      describe(p.el, id, true);
      if (p.group) describe(p.group, id, true); else p.el.setAttribute('aria-invalid', 'true');
      var li = document.createElement('li'), a = document.createElement('a');
      li.setAttribute('data-for-error', id);
      a.setAttribute('href', '#' + p.el.id);
      a.textContent = p.box.getAttribute('data-label') || '';
      li.appendChild(a);
      ul.appendChild(li);
    });
    alert.appendChild(title);
    alert.appendChild(ul);
    if (!summary) return;
    summary.textContent = '';
    summary.appendChild(alert);
    summary.hidden = false;
    summary.focus();
    reveal(summary);
  }

  // ---- rows of a list (medications): the page has one row, more are added here --------------------
  function fill(text, n) { return String(text || '').replace('{0}', n); }
  function number(rows) {
    var list = rows.querySelectorAll('[data-row]');
    each(list, function (row, i) {
      var n = i + 1;
      if (rows.getAttribute('data-row-name')) row.setAttribute('aria-label', fill(rows.getAttribute('data-row-name'), n));
      each(row.querySelectorAll('input'), function (input) {
        var id = input.id.replace(/-[0-9]+$/, '') + '-' + n, label = row.querySelector('label[for="' + input.id + '"]');
        if (label) label.setAttribute('for', id);
        input.id = id;
        if (input.getAttribute('data-label-template')) input.setAttribute('aria-label', fill(input.getAttribute('data-label-template'), n));
      });
      var del = row.querySelector('[data-row-remove]');
      if (del) {
        del.hidden = list.length < 2;                               // the only row stays
        if (rows.getAttribute('data-remove-name')) del.setAttribute('aria-label', fill(rows.getAttribute('data-remove-name'), n));
      }
    });
  }
  // The two buttons are in the page, unseen until this runs (without it a row cannot be added).
  function initRows(form) {
    each(form.querySelectorAll('[data-rows]'), function (rows) {
      var add = rows.parentNode.querySelector('[data-rows-add]');
      if (!add || !rows.querySelector('[data-row]')) return;
      add.hidden = false;
      add.addEventListener('click', function () {
        var all = rows.querySelectorAll('[data-row]');
        if (all.length >= 30) return;
        var row = all[all.length - 1].cloneNode(true);
        each(row.querySelectorAll('input'), function (input) { input.value = ''; input.removeAttribute('aria-invalid'); });
        rows.appendChild(row);
        number(rows);
        var input = row.querySelector('input');
        if (input) input.focus();
      });
      rows.addEventListener('click', function (ev) {
        var del = ev.target && ev.target.closest ? ev.target.closest('[data-row-remove]') : null, row = del && del.closest('[data-row]');
        if (!row || rows.querySelectorAll('[data-row]').length < 2) return;
        rows.removeChild(row);
        number(rows);
        add.focus();
      });
    });
  }

  // ---- one form -------------------------------------------------------------------------------------
  function init(form) {
    prefill(form);
    applyRules(form);
    initRows(form);
    // arriving from a questionnaire that also asked for contact details: they were not sent,
    // and the page says so right under the result
    if (form.hasAttribute('data-score-field') && query('notice') === '1') showNotice(form, form.querySelector('[data-form-arrival]'));

    function changed(ev) {
      var el = ev.target;
      // typing an answer beside "Other" chooses "Other"
      if (el && el.getAttribute && el.getAttribute('data-other-for') && el.value) {
        var radio = document.getElementById(el.getAttribute('data-other-for'));
        if (radio && !radio.checked) radio.checked = true;
      }
      applyRules(form);
      if (form.querySelector('.is-invalid')) {
        var still = problems(form).map(function (p) { return p.box; });
        each(form.querySelectorAll('.is-invalid'), function (box) { if (still.indexOf(box) < 0) clearBox(form, box); });
      }
    }
    form.addEventListener('input', changed);
    form.addEventListener('change', changed);

    // a phone number typed without its punctuation takes the source form's shape when the field is left
    form.addEventListener('change', function (ev) {
      var el = ev.target, mask = el && el.getAttribute && el.getAttribute('data-mask');
      if (!mask) return;
      var digits = el.value.replace(/[^0-9]/g, ''), slots = (mask.match(/9/g) || []).length, k = 0;
      if (digits.length === slots + 1 && digits.charAt(0) === '1') digits = digits.slice(1);
      if (digits.length !== slots) return;
      el.value = mask.replace(/9/g, function () { return digits.charAt(k++); });
    });

    // a link of the summary goes to its field and puts the cursor in it
    form.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('[data-form-summary] a') : null;
      if (!a) return;
      var target = document.getElementById((a.getAttribute('href') || '').slice(1));
      if (!target) return;
      ev.preventDefault();
      target.focus();
    });

    form.addEventListener('submit', function (ev) {
      applyRules(form);
      // a form whose button a rule keeps back has nothing to send (Enter in a field must not send it either)
      var button = form.querySelector('button[type=submit]');
      if (!button || button.hidden || button.disabled) { ev.preventDefault(); return; }
      var list = problems(form);
      if (list.length) { ev.preventDefault(); showProblems(form, list); return; }
      each(form.querySelectorAll('.is-invalid'), function (box) { clearBox(form, box); });

      var score = scoreOf(form), target = form.querySelector('[data-score-target]');
      if (score !== null && target) target.value = score;

      if (form.hasAttribute('data-connected')) return;            // a receiver is connected: post as written
      ev.preventDefault();

      var next = form.getAttribute('data-next');
      if (score !== null && next) {
        // the site may be served under a folder: the form's own action says which
        var action = form.getAttribute('action') || '', cut = action.indexOf('/forms/'), prefix = cut > 0 ? action.slice(0, cut) : '';
        if (prefix && next.indexOf(prefix + '/') !== 0) next = prefix + next;
        var url = next + '?' + (form.getAttribute('data-score-param') || 'score') + '=' + encodeURIComponent(score);
        if (form.hasAttribute('data-personal')) url += '&notice=1';
        window.location.assign(url);
        return;
      }
      showNotice(form);
    });
  }

  forms.forEach(init);
  // a page restored from the back-forward cache keeps its answers: read the rules again
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) forms.forEach(applyRules); });
})();

/* search.js — site search on a static host.
   The search page (/search/) ships an empty results region and the address of an index of every
   page (title, section, other names, headings, full text, a one-line summary). This script reads
   ?q=, fetches the index once, matches, ranks and draws the results. It does nothing on a page
   that has no results region, and it carries no copy: its messages are the data-msg-* attributes
   the page was built with.

   Matching: the query and the text are folded the same way (case, accents, apostrophes of
   either kind, quotes, hyphens and dashes). Every query word of two letters or more must match
   the start of a word somewhere on the page (a word of two letters: a whole word). A plural also
   finds its singular, and a name written in two words is found when typed as one. Ranking: a
   page whose own name is the query; then pages with text of their own over listings of posts
   (tags, categories); then a hit in the title over one in the page's other names, over headings,
   over body text; then pages the live site lets search engines index over those it does not;
   then a hub over its own sub-pages when both match by name.

   The lines tagged fold:... and rank:... are the ones src/tools/search-check.mjs --self-test
   takes out or changes to prove its checks can fail; keep the tags when editing those lines. */
(function () {
  'use strict';
  var region = document.querySelector('[data-search-results]');
  if (!region) return;
  var statusEl = region.querySelector('[data-search-status]');
  var listEl = region.querySelector('[data-search-list]');
  if (!statusEl || !listEl) return;
  var helpEl = region.querySelector('[data-search-help]');
  var moreEl = region.querySelector('[data-search-more]');
  var form = document.querySelector('[data-search-form]');
  var field = form ? form.querySelector('input[name="q"]') : null;

  var PAGE = 30;            // results drawn at a time
  var MAX_QUERY = 120;      // characters of a query that are read
  var MAX_WORDS = 10;
  var TITLE = 4, NAME = 3, HEAD = 2, BODY = 1;

  // ---- folding ------------------------------------------------------------------------------
  var chr = String.fromCharCode;
  // apostrophes: straight, grave, acute, modifier letter, the curly pair, reversed, prime
  var APOS_CHARS = chr(0x27) + chr(0x60) + chr(0xb4) + chr(0x2bc) + chr(0x2018) + chr(0x2019) + chr(0x201b) + chr(0x2032);
  var APOS = new RegExp('[' + APOS_CHARS + ']', 'g');
  var MARKS = new RegExp('[' + chr(0x300) + '-' + chr(0x36f) + ']', 'g');
  var NONWORD, CHUNK;
  try {
    NONWORD = new RegExp('[^\\p{L}\\p{N}]+', 'gu');
    CHUNK = new RegExp('[\\p{L}\\p{N}' + APOS_CHARS + ']+', 'gu');
  } catch (e) {
    NONWORD = /[^a-z0-9]+/g;
    CHUNK = new RegExp('[A-Za-z0-9' + APOS_CHARS + ']+', 'g');
  }

  // One fold for the query and for the text. The tags at the line ends are for the check tool
  // (src/tools/search-check.mjs --self-test takes a line out and must see the check fail).
  function fold(s) {
    s = String(s == null ? '' : s);
    if (s.normalize) s = s.normalize('NFD');
    s = s.toLowerCase(); /* fold:case */
    s = s.replace(APOS, ''); /* fold:apostrophes */
    s = s.replace(MARKS, ''); /* fold:accents */
    return s.replace(NONWORD, ' ').replace(/ +/g, ' ').replace(/^ | $/g, '');
  }

  // "lenses" also finds "lens", "contacts" finds "contact lenses"
  function singular(w) {
    var n = w.length;
    if (n < 4 || w.charAt(n - 1) !== 's') return w;
    if (/(ss|us|is)$/.test(w)) return w;
    if (/ies$/.test(w) && n > 4) return w.slice(0, n - 3) + 'y';
    if (/(ses|xes|zes|ches|shes)$/.test(w)) return w.slice(0, n - 2);
    return w.slice(0, n - 1);
  }
  function singularAll(s) { return s.split(' ').map(singular).join(' '); }
  // the one plural a prefix does not reach: "emergency" also finds "emergencies"
  function plural(w) { return w.length >= 4 && /[^aeiou]y$/.test(w) ? w.slice(0, w.length - 1) + 'ies' : ''; }

  // ---- the index ------------------------------------------------------------------------------
  var entries = null;       // prepared entries
  var loading = null;       // the one request for the index
  var siteBase = (function () {
    // where the site's root is, read from this page's own address (/search/ or <base>/search/)
    var m = /^(.*\/)search(?:\/(?:index\.html)?)?$/.exec(location.pathname);
    return m ? m[1] : '/';
  })();
  function withBase(path) {
    path = String(path || '');
    if (path.charAt(0) !== '/' || siteBase === '/' || path.indexOf(siteBase) === 0) return path;
    return siteBase + path.slice(1);
  }

  function prepare(list) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (!e || typeof e.u !== 'string' || typeof e.t !== 'string') continue;
      var names = [], heads = [], j;
      var k = e.k instanceof Array ? e.k : [], h = e.h instanceof Array ? e.h : [];
      for (j = 0; j < k.length; j++) names.push(fold(k[j]));
      for (j = 0; j < h.length; j++) heads.push(fold(h[j]));
      var t = fold(e.t);
      // the first e.o names are the page's own (menu and breadcrumb labels); the rest are tags,
      // brands, people: they get a page found, they are not what the page is called
      var own = names.slice(0, e.o > 0 ? e.o : 0);
      out.push({
        e: e, t: t, names: names, heads: heads, own: own,
        T: ' ' + t + ' ',
        K: ' ' + names.join(' | ') + ' ',
        O: ' ' + own.join(' | ') + ' ',
        H: ' ' + heads.join(' | ') + ' ',
        X: ' ' + fold(e.x) + ' | ' + fold(e.d) + ' ',
        tSing: singularAll(t), ownSing: own.map(singularAll),
        depth: e.u.split('/').length - 2,
        n: e.n === 2 ? 2 : e.n ? 1 : 0     // 0 indexed, 1 noindex, 2 a listing of posts
      });
    }
    return out;
  }

  function load() {
    if (entries) return Promise.resolve(entries);
    if (loading) return loading;
    var url = withBase(region.getAttribute('data-index') || '');
    if (!url || typeof fetch !== 'function') return Promise.reject(new Error('no index'));
    loading = fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('index: HTTP ' + r.status);
      return r.json();
    }).then(function (list) {
      if (!(list instanceof Array)) throw new Error('index: not a list');
      entries = prepare(list);
      return entries;
    });
    loading.catch(function () { loading = null; });   // a failed request may be tried again
    return loading;
  }

  // ---- matching -------------------------------------------------------------------------------
  // w at the start of a word of a padded, folded field
  function starts(F, w) { return F.indexOf(' ' + w) !== -1; }
  function whole(F, w) { return F.indexOf(' ' + w + ' ') !== -1; }
  // w across neighbouring words of a short field: "rayban" in "ray ban", "eyemed" in "eye med"
  function joined(str, w) {
    if (str.indexOf(' ') === -1) return false;
    var words = str.split(' ');
    for (var i = 0; i < words.length - 1; i++) {
      if (words[i] === '|' || words[i].length >= w.length || w.indexOf(words[i]) !== 0) continue;
      var acc = words[i], j = i + 1;
      while (j < words.length && words[j] !== '|' && acc.length < w.length) acc += words[j++];
      if (acc.indexOf(w) === 0) return true;
    }
    return false;
  }
  // w closing a compound word of a short field: "glasses" in "eyeglasses", "lens" in "neurolens"
  function closes(F, w) { return w.length >= 4 && F.indexOf(w + ' ') !== -1; }

  // the best field a word is found in, and how: { tier, how } (how: 0 as typed, lower is weaker)
  function findWord(p, w) {
    var best = { tier: 0, how: 0, whole: false };
    function take(tier, how, isWhole) {
      if (tier > best.tier || (tier === best.tier && how > best.how)) { best.tier = tier; best.how = how; best.whole = !!isWhole; }
    }
    function direct(word, how) {
      if (starts(p.T, word)) take(TITLE, how, whole(p.T, word));
      // a name the site itself gives the page (menu, breadcrumb) says more than one it is filed under
      else if (starts(p.K, word)) take(NAME, starts(p.O, word) ? how : how - 0.5, whole(p.K, word));
      else if (starts(p.H, word)) take(HEAD, how, whole(p.H, word));
      else if (starts(p.X, word)) take(BODY, how, whole(p.X, word));
    }
    if (w.length < 3) {
      // two letters are a word of their own ("dr", "uv", "od"), not the start of "dry" or "uveitis"
      if (whole(p.T, w)) take(TITLE, 0, true);
      else if (whole(p.K, w)) take(NAME, 0, true);
      else if (whole(p.H, w)) take(HEAD, 0, true);
      else if (whole(p.X, w)) take(BODY, 0, true);
      return best;
    }
    direct(w, 0);
    if (best.tier === TITLE) return best;
    // the singular is as good as the word typed on a page that also uses the word typed
    // ("contacts": the contact lens pages), and weaker where it does not ("Contact Us")
    var typed = best.tier > 0;
    var s = singular(w);
    if (s !== w) direct(s, typed ? 0 : -1);
    else if (plural(w)) direct(plural(w), typed ? 0 : -1);
    if (best.tier >= NAME) return best;
    // weaker ways in, through the page's names only
    if (joined(p.t, w)) take(TITLE, -2);
    else if (joined(p.K.slice(1, -1), w)) take(NAME, -2);
    else if (joined(p.H.slice(1, -1), w)) take(HEAD, -2);
    if (closes(p.T, w) || (s !== w && closes(p.T, s))) take(NAME, -3);
    else if (closes(p.K, w) || (s !== w && closes(p.K, s))) take(HEAD, -3);
    return best;
  }

  function count(F, w, cap) {
    var n = 0, i = -1, needle = ' ' + w;
    while (n < cap && (i = F.indexOf(needle, i + 1)) !== -1) n++;
    return n;
  }

  function parse(raw) {
    var f = fold(String(raw == null ? '' : raw).slice(0, MAX_QUERY));
    var all = f ? f.split(' ').slice(0, MAX_WORDS) : [];
    var words = [], seen = {};
    for (var i = 0; i < all.length; i++) {
      // a word of one letter says nothing; a word typed twice is asked once
      if (all[i].length < 2 || seen['$' + all[i]]) continue;
      seen['$' + all[i]] = 1;
      words.push({ w: all[i], i: i });
    }
    return { folded: f, all: all, words: words, phrase: words.map(function (x) { return x.w; }).join(' ') };
  }

  function search(raw) {
    var q = parse(raw);
    if (!q.words.length || !entries) return { q: q, results: [] };
    var qSing = singularAll(q.folded), results = [];
    for (var n = 0; n < entries.length; n++) {
      var p = entries[n], tier = 0, fine = 0, how = 0, byName = true, ok = true, inTitle = 0;
      for (var i = 0; i < q.words.length; i++) {
        var w = q.words[i].w, at = q.words[i].i;
        var m = findWord(p, w);
        if (!m.tier) {
          // two words typed for one written: "care credit" for "CareCredit", "i light" for "iLight"
          var pair = at + 1 < q.all.length ? w + q.all[at + 1] : '', before = at > 0 ? q.all[at - 1] + w : '';
          var m2 = pair ? findWord(p, pair) : null;
          if (!m2 || !m2.tier || m2.how < -1) m2 = before ? findWord(p, before) : null;
          if (m2 && m2.tier && m2.how >= -1) m = { tier: m2.tier, how: -2, whole: false };
        }
        if (!m.tier) { ok = false; break; }
        tier += m.tier;
        if (m.tier < NAME) byName = false;
        if (m.tier === TITLE) inTitle += w.length;
        how += m.how;
        fine += (m.whole ? 2 : 0) + Math.min(4, count(p.X, w, 4));
      }
      if (!ok) continue;
      if (q.words.length > 1) {
        // the words side by side, as typed, say more than the same words scattered: "new patient"
        // is the page with "New Patient Forms", not a page titled "What's New" that mentions patients
        var ph = ' ' + q.phrase;
        var where = p.T.indexOf(ph) !== -1 ? 30 : p.K.indexOf(ph) !== -1 ? 24 : p.H.indexOf(ph) !== -1 ? 12 : p.X.indexOf(ph) !== -1 ? 6 : 0;
        if (where) { tier += 4 * (q.words.length - 1); fine += where; }
      }
      if (inTitle) fine += Math.round(20 * Math.min(1, inTitle / Math.max(1, p.t.replace(/ /g, '').length)));
      if (p.T.indexOf(' ' + q.words[0].w) === 0) fine += 4;
      fine -= p.depth;
      // the page's own name is the query: as typed (2), or but for a plural (1). A listing of
      // posts under a tag has the tag's name, not a name of its own.
      var exact = 0;
      if (p.n < 2) {
        if (p.t === q.folded || p.own.indexOf(q.folded) !== -1) exact = 2;
        else if (p.tSing === qSing || p.ownSing.indexOf(qSing) !== -1) exact = 1;
      }
      results.push({ p: p, e: p.e, exact: exact, tier: tier, how: how, fine: fine, byName: byName, n: p.n });
    }
    results.sort(byRank); /* rank:sort */
    return { q: q, results: liftHubs(results) };
  }

  function byRank(a, b) {
    return (b.exact - a.exact) || ((a.n === 2) - (b.n === 2)) || (b.tier - a.tier) || (a.n - b.n) || (b.how - a.how) || (b.fine - a.fine)
      || (a.e.t.length - b.e.t.length) || (a.e.u < b.e.u ? -1 : a.e.u > b.e.u ? 1 : 0);
  }

  // A hub goes above its own sub-pages when both match by name ("glaucoma": the glaucoma page,
  // then its articles). Never past a page whose name is the query, never a noindex hub past an
  // indexed page.
  function liftHubs(sorted) {
    var out = [], placed = {};
    function isHubOf(a, r) {
      return a !== r && a.byName && r.byName && a.e.u !== '/' && a.e.u.length < r.e.u.length && r.e.u.indexOf(a.e.u) === 0
        && a.exact >= r.exact && a.n <= r.n;
    }
    for (var i = 0; i < sorted.length; i++) {
      var r = sorted[i];
      if (placed[r.e.u]) continue;
      if (r.byName) {
        var hubs = [];
        for (var j = i + 1; j < sorted.length; j++) if (!placed[sorted[j].e.u] && isHubOf(sorted[j], r)) hubs.push(sorted[j]);
        hubs.sort(function (a, b) { return a.e.u.length - b.e.u.length; });
        for (var h = 0; h < hubs.length; h++) { placed[hubs[h].e.u] = 1; out.push(hubs[h]); }
      }
      placed[r.e.u] = 1;
      out.push(r);
    }
    return out;
  }

  // ---- drawing --------------------------------------------------------------------------------
  function hit(chunk, q) {
    var f = fold(chunk);
    if (!f) return false;
    for (var i = 0; i < q.words.length; i++) {
      var w = q.words[i].w, s = singular(w), pl = plural(w);
      if (w.length < 3) { if (f === w) return true; continue; }
      if (f.indexOf(w) === 0 || f.indexOf(s) === 0 || (pl && f.indexOf(pl) === 0)) return true;
      if (w.length >= 4 && f.length > w.length && f.lastIndexOf(w) === f.length - w.length) return true;
    }
    return false;
  }
  // text into `parent`, the matched words inside <mark>; returns how many were marked
  function mark(parent, text, q) {
    var last = 0, marked = 0, m;
    text = String(text == null ? '' : text);
    CHUNK.lastIndex = 0;
    while ((m = CHUNK.exec(text))) {
      if (!m[0]) { CHUNK.lastIndex++; continue; }
      if (!hit(m[0], q)) continue;
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      var el = document.createElement('mark');
      el.textContent = m[0];
      parent.appendChild(el);
      last = m.index + m[0].length;
      marked++;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
    return marked;
  }
  // the lines around the first matched word of a long text
  function excerpt(text, q) {
    var m;
    text = String(text == null ? '' : text);
    CHUNK.lastIndex = 0;
    while ((m = CHUNK.exec(text))) {
      if (!m[0]) { CHUNK.lastIndex++; continue; }
      if (!hit(m[0], q)) continue;
      var from = Math.max(0, m.index - 70), to = Math.min(text.length, m.index + 150);
      if (from > 0) { var sp = text.indexOf(' ', from); from = sp !== -1 && sp < m.index ? sp + 1 : from; }
      if (to < text.length) { var ep = text.lastIndexOf(' ', to); to = ep > m.index ? ep : to; }
      return (from > 0 ? '… ' : '') + text.slice(from, to) + (to < text.length ? ' …' : '');
    }
    return '';
  }
  function has(text, q) {
    var m;
    text = String(text == null ? '' : text);
    CHUNK.lastIndex = 0;
    while ((m = CHUNK.exec(text))) { if (!m[0]) { CHUNK.lastIndex++; continue; } if (hit(m[0], q)) return true; }
    return false;
  }

  function item(r, q) {
    var e = r.e;
    var li = document.createElement('li');
    li.className = 'search-result';
    if (e.s) {
      var sec = document.createElement('p');
      sec.className = 'search-result__section';
      sec.textContent = e.s;
      li.appendChild(sec);
    }
    var h = document.createElement('h2');
    h.className = 'search-result__title';
    var a = document.createElement('a');
    a.className = 'search-result__link';
    a.setAttribute('href', withBase(e.u));
    mark(a, e.t, q);
    h.appendChild(a);
    li.appendChild(h);
    // the page's own summary when it shows the match; else the lines of the page that do
    var line = e.d || '';
    if (!has(line, q)) line = excerpt(e.x, q) || line;
    if (line) {
      var sum = document.createElement('p');
      sum.className = 'search-result__summary';
      mark(sum, line, q);
      li.appendChild(sum);
    }
    return li;
  }

  var shown = { q: null, results: [], drawn: 0 };
  function drawMore(focus) {
    var from = shown.drawn, to = Math.min(shown.results.length, from + PAGE), first = null;
    for (var i = from; i < to; i++) {
      var li = item(shown.results[i], shown.q);
      if (!first) first = li.querySelector('a');
      listEl.appendChild(li);
    }
    shown.drawn = to;
    if (moreEl) moreEl.hidden = shown.drawn >= shown.results.length;
    if (focus && first) first.focus();
  }

  function msg(name) { return region.getAttribute('data-msg-' + name) || ''; }
  function say(text) { if (statusEl.textContent !== text) statusEl.textContent = text; }
  function show(state, raw, found) {
    var label = String(raw == null ? '' : raw).replace(/\s+/g, ' ').replace(/^ | $/g, '');
    if (label.length > 80) label = label.slice(0, 80) + '…';
    var results = (found && found.results) || [];
    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
    shown = { q: found ? found.q : null, results: results, drawn: 0 };
    if (state === 'results') {
      say(msg(results.length === 1 ? 'one' : 'many').replace('{n}', String(results.length)).replace('{q}', function () { return label; }));
      listEl.hidden = false;
      drawMore(false);
    } else {
      listEl.hidden = true;
      if (moreEl) moreEl.hidden = true;
      say(state === 'none' ? msg('none').replace('{q}', function () { return label; }) : msg(state === 'error' ? 'failed' : state));
    }
    if (helpEl) helpEl.hidden = !(state === 'empty' || state === 'none' || state === 'error');
    region.setAttribute('data-state', state);
    region.setAttribute('data-query', label);
    region.setAttribute('data-count', String(results.length));
  }

  // ---- the query, the field and the address stay in step ------------------------------------------
  var current = null;
  function readQuery() {
    try {
      var sp = new URLSearchParams(location.search);
      return sp.get('q') || sp.get('s') || '';
    } catch (e) { return ''; }
  }
  function writeQuery(raw) {
    try {
      var url = location.pathname + (raw ? '?q=' + encodeURIComponent(raw).replace(/%20/g, '+') : '') + location.hash;
      if (url !== location.pathname + location.search + location.hash) history.replaceState(history.state, '', url);
    } catch (e) { /* an address that cannot be rewritten is not a reason to stop searching */ }
  }

  function run(raw, opts) {
    raw = String(raw == null ? '' : raw).slice(0, MAX_QUERY);
    var trimmed = raw.replace(/\s+/g, ' ').replace(/^ | $/g, '');
    current = trimmed;
    if (!opts || opts.write !== false) writeQuery(trimmed);
    if (!trimmed) { show('empty', ''); return; }
    if (!entries) {
      show('loading', trimmed);
      load().then(function () { if (current === trimmed) run(trimmed, { write: false }); }, function () { if (current === trimmed) show('error', trimmed); });
      return;
    }
    var found;
    try { found = search(trimmed); } catch (e) { show('error', trimmed); return; }
    show(found.results.length ? 'results' : 'none', trimmed, found);
  }

  var timer = null;
  if (form && field) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      clearTimeout(timer);
      run(field.value);
    });
    field.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { run(field.value); }, 220);
    });
    // the index is on its way by the time the first word is typed
    field.addEventListener('focus', function () { load().catch(function () {}); }, { once: true });
  }
  if (moreEl) moreEl.addEventListener('click', function (ev) { if (ev.target && ev.target.closest && ev.target.closest('button')) drawMore(true); });
  window.addEventListener('popstate', function () {
    var q = readQuery();
    if (field) field.value = q;
    run(q, { write: false });
  });

  var first = readQuery().slice(0, MAX_QUERY);
  if (field && first) field.value = first;
  run(first, { write: false });
})();
