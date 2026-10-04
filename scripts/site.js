/* site.js — York Eye Associates ("Large Print" redesign). No dependencies, no third-party calls. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  // Where this build lives. Resolved from this script's own URL, so the site works at a domain
  // root, in a subdirectory, or from a file path — nothing about the host is assumed.
  var me = d.currentScript || d.querySelector('script[src$="site.js"]');
  var ROOT = new URL('../', me ? me.src : location.href);
  var each = function (sel, fn, root) { [].forEach.call((root || d).querySelectorAll(sel), fn); };

  /* the reader's control: text size (three steps, remembered on this device) */
  each('[data-reader]', function (box) { box.hidden = false; });
  function showText(v) { each('[data-text-set]', function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-text-set') === v ? 'true' : 'false'); }); }
  showText(html.getAttribute('data-text') || '0');
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-text-set]');
    if (!b) return;
    var v = b.getAttribute('data-text-set');
    if (v === '0') html.removeAttribute('data-text'); else html.setAttribute('data-text', v);
    try { if (v === '0') localStorage.removeItem('yea-text'); else localStorage.setItem('yea-text', v); } catch (err) { /* private mode: the choice lasts for this page */ }
    showText(v);
  });

  /* desktop menus: opened by click, Enter or Space; one at a time */
  var items = [].slice.call(d.querySelectorAll('[data-menu]'));
  function closeAll(except) {
    items.forEach(function (it) { if (it !== except) { it.classList.remove('is-open'); var b = it.querySelector('.nav__trigger'); if (b) b.setAttribute('aria-expanded', 'false'); } });
  }
  items.forEach(function (it) {
    var btn = it.querySelector('.nav__trigger');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = !it.classList.contains('is-open');
      closeAll(it);
      it.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // keyboard: a panel closes when focus moves on past it, so it never covers what is focused next
    it.addEventListener('focusout', function (e) { if (e.relatedTarget && !it.contains(e.relatedTarget)) { it.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); } });
  });
  d.addEventListener('click', function (e) { if (!e.target.closest('[data-menu]')) closeAll(); });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = d.querySelector('[data-menu].is-open');
    closeAll();
    if (open) open.querySelector('.nav__trigger').focus({ preventScroll: true });
    closeDrawer();
  });

  /* drawer */
  var drawer = d.querySelector('[data-drawer]');
  var opener = d.querySelector('[data-drawer-open]');
  var lastFocus = null;
  function openDrawer() {
    if (!drawer) return;
    lastFocus = d.activeElement;
    drawer.hidden = false; drawer.classList.add('is-open');
    d.body.style.overflow = 'hidden';
    if (opener) opener.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('button, a'); if (f) f.focus({ preventScroll: true });
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open'); drawer.hidden = true;
    d.body.style.overflow = '';
    if (opener) opener.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  if (opener) opener.addEventListener('click', openDrawer);
  each('[data-drawer-close]', function (b) { b.addEventListener('click', closeDrawer); });
  if (drawer) drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = [].slice.call(drawer.querySelectorAll('a[href],button,summary')).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* The Line draws itself once as it comes into view (the only moving thing on the page besides the
     loops). Without the observer — or under reduced motion, where the head script never sets .motion-ok —
     it is simply there. */
  var lines = [].slice.call(d.querySelectorAll('.the-line'));
  if ('IntersectionObserver' in window && html.classList.contains('motion-ok')) {
    var lio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-drawn'); lio.unobserve(e.target); } });
    }, { threshold: 0.3 });
    lines.forEach(function (el) { lio.observe(el); });
    // a failsafe: whatever happens, every line is drawn two seconds after load
    setTimeout(function () { lines.forEach(function (el) { el.classList.add('is-drawn'); }); }, 2000);
  } else lines.forEach(function (el) { el.classList.add('is-drawn'); });

  /* video loops (lib.mjs loop()): decorative, silent and not interactive — no controls, no pause or
     play button, nothing a click, tap, key or the browser's own video menu can pause (the operator's
     standing instruction). A loop plays only while it is on screen and motion is welcome — never under
     prefers-reduced-motion or Save-Data, re-checked live — so otherwise its poster is the picture. It
     uses the smallest rendition that covers its box. A loop marked data-loop-once plays one pass each
     time it comes into view and then rests on its poster. */
  var calm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var loops = [].map.call(d.querySelectorAll('[data-loop]'), function (box) {
    var srcs = box.getAttribute('data-loop').split(',').map(function (x) { var i = x.indexOf(':'); return { w: +x.slice(0, i), u: x.slice(i + 1) }; }).sort(function (a, b) { return a.w - b.w; });
    var once = box.hasAttribute('data-loop-once');
    var video = null, host = null, onScreen = false, refused = false, undone = [], retry = 0, rested = false;
    function pick() {
      var need = box.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 2);
      for (var i = 0; i < srcs.length; i++) if (srcs[i].w >= need) return srcs[i].u;
      return srcs[srcs.length - 1].u;
    }
    function wanted() { return onScreen && !refused && !rested && !d.hidden && !calm.matches && !saveData; }
    function ensure() {
      if (video) return video;
      video = d.createElement('video');
      video.muted = true; video.defaultMuted = true; video.loop = !once; video.playsInline = true; video.controls = false;
      video.disablePictureInPicture = true; video.disableRemotePlayback = true;
      ['muted', 'playsinline', 'disablepictureinpicture', 'disableremoteplayback'].forEach(function (a) { video.setAttribute(a, ''); });
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback noplaybackrate');
      video.setAttribute('aria-hidden', 'true'); video.setAttribute('tabindex', '-1');
      ['display:block', 'width:100%', 'height:100%', 'object-fit:cover', 'pointer-events:none', 'user-select:none', '-webkit-user-select:none', '-webkit-touch-callout:none']
        .forEach(function (x) { var i = x.indexOf(':'); video.style.setProperty(x.slice(0, i), x.slice(i + 1)); });
      video.preload = 'auto';
      video.src = new URL(pick(), ROOT).href;
      video.addEventListener('playing', function () { box.classList.add('is-playing'); });
      if (once) video.addEventListener('ended', function () { rested = true; box.classList.remove('is-playing'); });
      // Firefox's right-click menu reaches a video under other elements and can pause it, change its
      // speed, show its controls, stop its looping or open it picture-in-picture (whose window has a
      // pause button); all of it is put back. A pause this script did not make is undone at once. When
      // pauses keep coming (more than 10 in 10 s) the undo waits, doubling up to 2 s: the loop always
      // comes back, and the two never fight in a tight loop.
      video.addEventListener('pause', function () {
        if (retry || !wanted() || video.ended) return;
        var now = Date.now();
        undone = undone.filter(function (t) { return now - t < 10000; });
        undone.push(now);
        var over = undone.length - 10;
        retry = setTimeout(function () { retry = 0; play(); }, over > 0 ? Math.min(2000, 125 * Math.pow(2, over - 1)) : 0);
      });
      video.addEventListener('ratechange', function () { if (video.playbackRate !== 1) video.playbackRate = 1; });
      if (window.MutationObserver) new MutationObserver(function () {
        if (video.controls) video.controls = false;
        if (!once && !video.loop) video.loop = true;
      }).observe(video, { attributes: true, attributeFilter: ['controls', 'loop'] });
      // inside a shadow root, so a "picture-in-picture the video on this page" shortcut cannot find it
      host = d.createElement('span');
      host.className = 'loop__video';
      host.setAttribute('aria-hidden', 'true');
      (host.attachShadow ? host.attachShadow({ mode: 'open' }) : host).appendChild(video);
      box.appendChild(host);
      return video;
    }
    function play() {
      if (!wanted()) return;
      var p = ensure().play();
      if (p && p.catch) p.catch(function (err) { if (err && err.name === 'NotAllowedError') { refused = true; release(); } });
    }
    function stop() { if (video) video.pause(); box.classList.remove('is-playing'); }
    // the device refuses to play video by itself (iOS Low Power Mode, a browser setting): the poster
    // stays the picture for the rest of the visit, and the video is let go so nothing more downloads
    function release() {
      stop();
      if (!video) return;
      video.removeAttribute('src'); video.load();
      if (host.parentNode) host.parentNode.removeChild(host);
      video = host = null;
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          onScreen = e.isIntersecting;
          if (onScreen) { if (once && rested && video) { rested = false; video.currentTime = 0; } play(); }
          else if (video) video.pause();
        });
      }, { rootMargin: '160px 0px' }).observe(box);
    } else { onScreen = true; play(); }
    return { play: play, stop: stop };
  });
  function playAll() { loops.forEach(function (l) { l.play(); }); }
  // reduced motion switched on mid-visit stops every loop at once (the poster returns); off, they resume
  var onCalm = function () { if (calm.matches) loops.forEach(function (l) { l.stop(); }); else playAll(); };
  if (calm.addEventListener) calm.addEventListener('change', onCalm); else if (calm.addListener) calm.addListener(onCalm);
  // back from another tab, a frozen tab or the back/forward cache: loops on screen carry on. Chrome
  // resumes its own players first — a play() in that same moment can leave one stuck on a frame — so wait.
  function wake() { setTimeout(playAll, 250); }
  d.addEventListener('visibilitychange', function () { if (!d.hidden) wake(); });
  window.addEventListener('pageshow', wake);

  /* The line kept behind a frame (a video, the map) is for the time before the frame is there. Once the frame
     has loaded and covers it, its link leaves the tab order: focus must not land on something out of sight. */
  each('.embed iframe, .map-embed iframe', function (f) {
    f.addEventListener('load', function () {
      [].forEach.call(f.parentNode.querySelectorAll('.embed__fallback a, .map-embed__fallback a'), function (a) { a.setAttribute('tabindex', '-1'); });
    });
  });

  /* "On this page": built from the article's own section headings, then kept in sync */
  var tocBox = d.querySelector('[data-toc]');
  if (tocBox) {
    var hs = [].slice.call(d.querySelectorAll('.prose > h2[id], .prose > .mfold__more > h2[id]')).slice(0, 12);
    if (hs.length >= 3) {
      var ul = tocBox.querySelector('ul');
      hs.forEach(function (h) { var li = d.createElement('li'), a = d.createElement('a'); a.href = '#' + h.id; a.textContent = h.textContent.trim(); li.appendChild(a); ul.appendChild(li); });
      tocBox.hidden = false;
      var toc = [].slice.call(ul.querySelectorAll('a'));
      /* The entry marked is the section being read: the last heading that has reached the top of the
         screen. (Read from the scroll position, so an entry that is clicked is marked when its heading lands
         at the top, where a band in the middle of the screen never saw it.) */
      var map = {};
      toc.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      var mark = function (a) {
        toc.forEach(function (x) { if (x !== a) { x.classList.remove('is-active'); x.removeAttribute('aria-current'); } });
        if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); }
      };
      var syncToc = function () {
        var line = 96, cur = null;
        hs.forEach(function (h) { if (h.getClientRects().length && h.getBoundingClientRect().top <= line) cur = h; });
        mark(cur ? map[cur.id] : null);
      };
      var tocTick = false;
      window.addEventListener('scroll', function () { if (!tocTick) { tocTick = true; requestAnimationFrame(function () { tocTick = false; syncToc(); }); } }, { passive: true });
      syncToc();
    }
  }

  /* today's hours: the practice's own table, read for today's weekday in Gainesville (Central time).
     It restates the table and never says "open": the practice closes on most holidays. */
  var day;
  try { day = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'America/Chicago' }).format(new Date()); }
  catch (err) { day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]; }
  each('tr[data-day="' + day + '"]', function (tr) {
    tr.classList.add('is-today'); tr.setAttribute('aria-current', 'date');
    var th = tr.querySelector('th');
    if (th && !th.querySelector('.hours__today')) { var s = d.createElement('span'); s.className = 'hours__today'; s.textContent = 'Today'; th.appendChild(s); }
  });
  function clock(s) { var m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(s.trim()); return m ? (+m[1] % 12) + (/pm/i.test(m[3]) ? 12 : 0) + (+m[2]) / 60 : null; }
  each('[data-today]', function (a) {
    var hours; try { hours = JSON.parse(a.getAttribute('data-today')); } catch (err) { return; }
    if (!hours[day]) return;
    a.textContent = day + ': ' + hours[day];
    var bar = a.getAttribute('data-today-bar') && d.getElementById(a.getAttribute('data-today-bar'));
    if (bar) {
      var parts = hours[day].split(/\s+-\s+/), o = clock(parts[0] || ''), c = clock(parts[1] || '');
      if (o != null && c != null) { bar.style.setProperty('--o', Math.max(0, (o - 7) / 11 * 100).toFixed(1) + '%'); bar.style.setProperty('--w', Math.max(0, (c - o) / 11 * 100).toFixed(1) + '%'); }
      /* a day without opening hours has no bar to draw */
      else bar.hidden = true;
    }
  });

  /* a long review on a phone: its opening lines, and a button for the rest (every word is in the page) */
  each('.review--long', function (fig) {
    var text = fig.querySelector('.review__text');
    if (!text || text.scrollHeight <= text.clientHeight + 4) { fig.classList.add('is-open'); return; }
    var b = d.createElement('button');
    b.type = 'button'; b.className = 'review__toggle'; b.setAttribute('aria-expanded', 'false');
    /* the same label and mark as the other disclosures: words, then a chevron that turns over */
    var label = d.createElement('span'); label.textContent = 'Read more'; b.appendChild(label);
    var NS = 'http://www.w3.org/2000/svg', svg = d.createElementNS(NS, 'svg'), use = d.createElementNS(NS, 'use');
    svg.setAttribute('class', 'icon'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false'); use.setAttribute('href', '#i-chevron'); svg.appendChild(use); b.appendChild(svg);
    b.addEventListener('click', function () { var open = fig.classList.toggle('is-open'); b.setAttribute('aria-expanded', open ? 'true' : 'false'); label.textContent = open ? 'Show less' : 'Read more'; });
    text.parentNode.insertBefore(b, text.nextSibling);
  });

  /* the phone's action bar: shown once the page's first actions have scrolled away, hidden over the
     booking band and the footer (which carry the same actions) and while the drawer is open */
  var bar = d.querySelector('[data-actionbar]');
  if (bar && 'IntersectionObserver' in window) {
    var firstActions = d.querySelector('main .btn-row'), endZone = [].slice.call(d.querySelectorAll('.cta-band, .footer'));
    var seen = { top: !!firstActions, end: false };
    var sync = function () { bar.classList.toggle('is-shown', !seen.top && !seen.end && !(drawer && !drawer.hidden)); };
    var bio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.target === firstActions) seen.top = e.isIntersecting; else e.target._in = e.isIntersecting; });
      seen.end = endZone.some(function (z) { return z._in; });
      sync();
    });
    if (firstActions) bio.observe(firstActions);
    endZone.forEach(function (z) { bio.observe(z); });
    if (opener) opener.addEventListener('click', sync);
    each('[data-drawer-close]', function (b) { b.addEventListener('click', sync); });
    sync();
  }

  /* forms: nothing is sent until the practice connects an endpoint (see docs/DEPLOY.md) */
  // Submit buttons ship disabled so nothing can post without this script; enable them now.
  each('[data-js-enable]', function (b) { b.disabled = false; });
  function valueOf(f, name) {
    var els = f.querySelectorAll('[name="' + name + '"]'), v = '';
    [].forEach.call(els, function (el) { if (el.type === 'radio' || el.type === 'checkbox') { if (el.checked) v = el.value; } else v = el.value; });
    return v;
  }
  // A group of checkboxes: every box has a name of its own ("x[]", "x-2[]", "x-3[]" …) and a rule names the
  // group by its first box. The ticked values of the whole group, or null when the name is not such a group.
  function groupValues(f, name) {
    var m = /^(.*)\[\]$/.exec(name); if (!m) return null;
    var out = [], found = false;
    [].forEach.call(f.querySelectorAll('input[type="checkbox"]'), function (el) {
      if (el.name === name || (el.name.indexOf(m[1] + '-') === 0 && /^-\d+\[\]$/.test(el.name.slice(m[1].length)))) { found = true; if (el.checked) out.push(el.value); }
    });
    return found ? out : null;
  }
  function holds(f, r) {
    var g = groupValues(f, r[0]);
    if (!g) return test(valueOf(f, r[0]), r[1], r[2]);
    return r[1] === 'isnot' ? g.every(function (v) { return test(v, 'isnot', r[2]); }) : g.some(function (v) { return test(v, r[1], r[2]); });
  }
  function test(a, op, b) {
    var na = parseFloat(a), nb = parseFloat(b), num = !isNaN(na) && !isNaN(nb);
    if (op === 'is') return String(a) === String(b);
    if (op === 'isnot') return String(a) !== String(b);
    if (op === '>') return num && na > nb;
    if (op === '<') return num && na < nb;
    if (op === 'contains') return String(a).indexOf(b) > -1;
    return false;
  }
  /* a repeating line (a list of medications): "Add" puts an empty row under the row it is on, "Remove"
     takes its row away; the last row always stays */
  each('[data-list]', function (list) {
    function sync() {
      var rows = list.querySelectorAll('[data-list-row]');
      [].forEach.call(rows, function (r, k) {
        var acts = r.querySelector('[data-list-actions]'), rm = r.querySelector('[data-list-remove]');
        if (acts) acts.hidden = false;
        if (rm) { rm.hidden = rows.length < 2; rm.setAttribute('aria-label', 'Remove row ' + (k + 1)); }
      });
    }
    list.addEventListener('click', function (e) {
      var add = e.target.closest && e.target.closest('[data-list-add]'), rm = e.target.closest && e.target.closest('[data-list-remove]');
      if (add) {
        var row = add.closest('[data-list-row]'), copy = row.cloneNode(true);
        [].forEach.call(copy.querySelectorAll('input'), function (i) { i.value = ''; });
        row.parentNode.insertBefore(copy, row.nextSibling); sync();
        var first = copy.querySelector('input'); if (first) first.focus();
      } else if (rm) {
        var gone = rm.closest('[data-list-row]'), near = gone.previousElementSibling || gone.nextElementSibling;
        gone.parentNode.removeChild(gone); sync();
        var box = near && near.querySelector('input'); if (box) box.focus();
      }
    });
    sync();
  });
  /* "Other": writing in its box chooses it */
  d.addEventListener('focusin', function (e) {
    var t = e.target;
    if (!t || !t.matches || !t.matches('[data-other]')) return;
    var lab = t.closest('label'), pick = lab && lab.querySelector('input[type="radio"], input[type="checkbox"]');
    if (pick && !pick.checked) { pick.checked = true; pick.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  each('form.vf', function (f) {
    var shell = f.parentNode;
    if (f.getAttribute('data-endpoint')) { var off = shell && shell.querySelector('[data-form-offline]'); if (off) off.remove(); }
    // the plugin's own sum: the chosen answers of the questions its formula names
    var terms = null; try { terms = JSON.parse(f.getAttribute('data-calc') || 'null'); } catch (err) { terms = null; }
    function total() {
      var sum = 0;
      (terms || []).forEach(function (t) {
        if (t.v != null) { [].forEach.call(f.querySelectorAll('[name="' + t.n + '"]'), function (el) { if (el.checked && el.value === String(t.v)) sum += parseFloat(el.value) || 0; }); }
        else sum += parseFloat(valueOf(f, t.n)) || 0;
      });
      return sum;
    }
    var out = f.querySelector('[data-calc-out]');
    // conditional parts, by the plugin's own rules: shown or hidden as the answers (or the score) say
    var parts = [].slice.call(f.querySelectorAll('[data-logic]'));
    function apply() {
      if (out && terms) out.value = String(total());
      parts.forEach(function (p) {
        var rule; try { rule = JSON.parse(p.getAttribute('data-logic')); } catch (err) { return; }
        var hits = rule.r.map(function (r) { return holds(f, r); });
        var met = rule.t === 'any' ? hits.some(Boolean) : hits.every(Boolean);
        var score = f.querySelector('[data-score]');
        // a part that reads the score stays out of sight while there is no score
        if (score && score.value === '' && rule.r.every(function (r) { return r[0] === score.name; })) { p.hidden = true; return; }
        p.hidden = rule.a === 'hide' ? met : !met;
      });
    }
    // a result page: the score arrives in the page address (?score=12)
    var scoreField = f.querySelector('[data-score]');
    if (scoreField) {
      var sc = new URLSearchParams(location.search).get('score');
      if (sc != null && /^\d{1,3}$/.test(sc)) scoreField.value = sc;
      else { var none = shell && shell.querySelector('[data-noscore]'); if (none) none.hidden = false; }
    }
    apply();
    f.addEventListener('change', apply);
    f.addEventListener('input', function (e) { var c = e.target; if (c.getAttribute && c.getAttribute('aria-invalid') === 'true' && c.checkValidity()) c.removeAttribute('aria-invalid'); apply(); });
    f.addEventListener('change', function (e) { var c = e.target; if (c.name) [].forEach.call(f.querySelectorAll('[name="' + c.name + '"]'), function (x) { if (x.checkValidity()) x.removeAttribute('aria-invalid'); }); });
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      if (!f.checkValidity()) {
        e.preventDefault();
        // every invalid control is marked (announced and outlined), and the first one is brought to
        // the middle of the screen with its label
        var bad = [].filter.call(f.elements, function (x) { return x.willValidate && !x.checkValidity(); });
        bad.forEach(function (x) { x.setAttribute('aria-invalid', 'true'); });
        var first = bad[0], field = first && first.closest('.field');
        if (field && field.scrollIntoView) field.scrollIntoView({ block: 'center' });
        if (first) first.focus({ preventScroll: true });
        f.reportValidity();
        return;
      }
      if (endpoint) { f.setAttribute('action', endpoint); return; }
      e.preventDefault();
      // a questionnaire: its result page, with the score worked out here. Nothing is sent anywhere.
      var result = f.getAttribute('data-result');
      var s = f.querySelector('[data-form-status]') || (shell && shell.querySelector('[data-form-status]'));
      if (result && terms) {
        // a score for a questionnaire nobody answered would be a verdict about nothing ("0, low risk"):
        // with no scored question answered the visitor stays here and is asked for the answers
        var answered = terms.some(function (t) {
          return [].some.call(f.querySelectorAll('[name="' + t.n + '"]'), function (el) { return el.type === 'radio' || el.type === 'checkbox' ? el.checked : (el.type !== 'hidden' && el.value !== ''); });
        });
        if (!answered) {
          // said beside the button that was pressed, where the visitor is looking; the message takes the focus
          // so that a screen reader reads it (jumping to the first question left it out of sight)
          if (s) { s.textContent = 'Please answer the questions above to see your score.'; s.classList.add('is-shown'); s.setAttribute('tabindex', '-1'); s.focus({ preventScroll: true }); if (s.scrollIntoView) s.scrollIntoView({ block: 'nearest' }); }
          return;
        }
        location.href = new URL(result, ROOT).href + '?score=' + encodeURIComponent(total()); return;
      }
      if (s) {
        s.textContent = 'Online submission is not available yet. Please call us at ';
        var tel = d.createElement('a'); tel.href = 'tel:9406122020'; tel.textContent = '940-612-2020'; tel.style.whiteSpace = 'nowrap'; s.appendChild(tel);
        s.appendChild(d.createTextNode(' to complete this request.'));
        s.classList.add('is-shown'); s.setAttribute('tabindex', '-1'); s.focus();
      }
    });
  });

  /* site search (reads search-index.json next to this build) */
  var results = d.querySelector('[data-search-results]');
  if (results) {
    var q = (new URLSearchParams(location.search).get('q') || '').trim();
    var input = d.querySelector('[data-search-input]');
    if (input) input.value = q;
    var status = d.querySelector('[data-search-status]');
    /* A search reads folded text: lower case, accents and apostrophes dropped, anything else that is not a
       letter or a digit a space, so "children's" finds "children’s" and "bajio" finds "Bajío". The index
       holds each page's distinct words folded the same way (x); titles and lines are folded here. */
    var fold = function (s) {
      s = String(s || '');
      if (s.normalize) s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return s.toLowerCase().replace(/[\u2018\u2019'`]/g, '').replace(/[^a-z0-9]+/g, ' ').replace(/^ | $/g, '');
    };
    /* a word typed with a hyphen ("ray-ban", "ortho-k") is one token, as the index keeps it */
    var words = [];
    q.split(/\s+/).forEach(function (raw) {
      if (/[A-Za-z0-9]-[A-Za-z0-9]/.test(raw)) { var joined = fold(raw).replace(/ /g, ''); if (joined) words.push(joined); }
      else fold(raw).split(' ').forEach(function (w) { if (w) words.push(w); });
    });
    if (!words.length) { status.textContent = 'Type a word or two above to search the site.'; return; }
    fetch(new URL('search-index.json', ROOT)).then(function (r) { return r.json(); }).then(function (idx) {
      var phrase = fold(q);
      /* a word is found at the start of a word ("eye" finds "eyewear"; "form" does not find "performance");
         a plural also finds its singular ("forms" finds "form") */
      var has = function (hay, w) {
        var at = function (x) { return (' ' + hay).indexOf(' ' + x) > -1; };
        return at(w) || (w.length > 4 && w.charAt(w.length - 1) === 's' && at(w.slice(0, -1)));
      };
      var hits = idx.map(function (p, i) {
        var t = fold(p.t), line = fold(p.d), names = (p.k || '').split(' | '), all = names.join(' '), hay = t + ' ' + all + ' ' + line + ' ' + p.x, score = 0;
        if (!words.every(function (w) { return has(hay, w); })) return null;
        words.forEach(function (w) { score += 1 + (has(t, w) ? 5 : 0) + (has(all, w) ? 5 : 0) + (has(line, w) ? 2 : 0); });
        /* the name a menu gives the page counts most: the query IS the name ("insurance", "reviews"), opens or
           closes it ("about" for "About Us", "doctors" for "Our Eye Doctors"), or is part of it */
        var best = 0;
        names.forEach(function (n) {
          if (!n) return;
          if (n === phrase) best = Math.max(best, 25);
          else if (n.indexOf(phrase + ' ') === 0 || (n.length > phrase.length && n.lastIndexOf(' ' + phrase) === n.length - phrase.length - 1)) best = Math.max(best, 20);
          else if ((' ' + n + ' ').indexOf(' ' + phrase + ' ') > -1) best = Math.max(best, 10 * phrase.length / n.length);
        });
        score += best;
        /* the whole query in a title, and more the more of the title it is */
        if (t.indexOf(phrase) > -1) score += 10 + 10 * phrase.length / Math.max(t.length, 1);
        /* (a plural finds a title's singular: "forms" and "Patient Registration Form") */
        else if (phrase.length > 4 && phrase.charAt(phrase.length - 1) === 's' && (' ' + t + ' ').indexOf(' ' + phrase.slice(0, -1) + ' ') > -1) score += 10 + 10 * (phrase.length - 1) / Math.max(t.length, 1);
        /* a page whose own address is the query ("/insurance/" for "insurance") is the page about it */
        var slug = fold(p.u.split('/').filter(Boolean).pop() || '');
        if (slug === phrase) score += 15; else if ((' ' + slug + ' ').indexOf(' ' + phrase + ' ') > -1) score += 6;
        /* a section's main page (other pages live under its address) before the articles of the section */
        if (p.u !== '/' && idx.some(function (o) { return o !== p && o.u.indexOf(p.u) === 0; })) score += 6;
        /* and, among pages that fit alike, the one nearer the top of the site */
        score += 2 * Math.max(0, 4 - p.u.split('/').filter(Boolean).length);
        return { p: p, s: score, i: i, depth: p.u.split('/').length };
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s || a.depth - b.depth || a.i - b.i; });
      var total = hits.length, CAP = 60;
      hits = hits.slice(0, CAP);
      status.textContent = (total > CAP ? 'Showing ' + CAP + ' of ' + total + ' results' : total + ' result' + (total === 1 ? '' : 's')) + ' for “' + q + '”';
      results.innerHTML = '';
      /* nothing found: a way on (the sitemap lists every page) */
      if (!total) {
        var none = d.createElement('li'), way = d.createElement('a');
        none.className = 'results__none';
        way.href = new URL('sitemap/', ROOT).href; way.textContent = 'sitemap';
        none.appendChild(d.createTextNode('Try a shorter word or another spelling, or look through the '));
        none.appendChild(way); none.appendChild(d.createTextNode('.'));
        results.appendChild(none);
      }
      hits.forEach(function (h) {
        var li = d.createElement('li'), a = d.createElement('a'), s = d.createElement('strong'), sp = d.createElement('span');
        a.href = new URL(h.p.u.replace(/^\//, ''), ROOT).href;
        /* (a class of its own: the rules for links in running text must not restyle a result) */
        a.className = 'result';
        /* two words joined by a dash stay together, so no line of a title opens with the dash */
        h.p.t.split(/([A-Za-z0-9\u2019']{2,}[\u2014\u2013][A-Za-z0-9\u2019']{2,})/).forEach(function (part, k) {
          if (k % 2 && part.length <= 26) { var nb = d.createElement('span'); nb.className = 'nowrap'; nb.textContent = part; s.appendChild(nb); }
          else if (part) s.appendChild(d.createTextNode(part.replace(/ ([\u2014\u2013]) /g, '\u00a0$1 ')));
        });
        sp.textContent = h.p.d;
        a.appendChild(s); if (h.p.d) a.appendChild(sp); li.appendChild(a); results.appendChild(li);
      });
    }).catch(function () { status.textContent = 'Search is unavailable right now.'; });
  }
})();
