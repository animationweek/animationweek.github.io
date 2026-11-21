{
const S = window.SITE || {}, W = window.WORKS || [];
const E = S.event || {};
const app = document.getElementById('app');
const BRAND = 'Animation Week';

const fa = v => String(v ?? '').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mediaOf = w => (w.videos || (w.video ? [{ src: w.video, poster: w.poster }] : [])).map(v => ({ type: 'video', ...v }))
  .concat((w.images || []).map(src => ({ type: 'image', src })));
const isVideo = w => mediaOf(w).some(m => m.type === 'video');
const coverOf = w => w.cover || (w.images || [])[0] || ((w.videos || [])[0] || {}).poster || '';
const hashOf = w => 'work-' + w.id;
const label = w => w.name ? w.name : `اثر ${fa(w.id)}`;
const paras = t => String(t || '').trim().split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');

const ICON = {
  video: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4.2v7.6L16.4 12 10 8.2Z"/></svg>',
  multi: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M3 7v13a1 1 0 0 0 1 1h13" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m15 6-6 6 6 6"/></svg>'
};
const GHOST = (id = 'g') => `<svg viewBox="0 0 120 150" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf8fd"/><stop offset=".65" stop-color="#ece4f3"/><stop offset="1" stop-color="#c7b4dc"/></linearGradient></defs><path fill="url(#${id})" d="M34 62C32 30 54 9 76 10c25 1 37 24 34 55l-2 64c-1 11-10 12-12 0l-4-16c-2-8-8-8-10 2l-4 21c-2 10-12 10-12-2l-2-15c-2-10-10-10-12 0l-4 9c-4 10-14 8-12-4l2-26c-9-2-21-5-29-11-7-5-4-13 4-11 7 2 15 4 21 4Z"/><ellipse cx="69" cy="58" rx="4.6" ry="7.4" fill="#1d1428"/><ellipse cx="87" cy="60" rx="4.2" ry="7" fill="#1d1428"/></svg>`;
const spk = (x, y, s, c, d = 0, cls = '') => `<i class="spk ${cls}" style="inset-inline-start:${x};top:${y};--s:${s}px;--c:${c};--d:${d}s"></i>`;
let returnTo = null;

function header() {
  const s = (E.sessions || []).map(x => `<div class="sess"><b>${esc(x.date)}</b><span>${esc(x.place)}</span></div>`)
    .join(`<i class="sep" aria-hidden="true"></i>`);
  return `<header class="hero">
    <div class="sill"></div>
    ${spk('49%', 'clamp(46px,9.6vw,112px)', 22, '#fff', .4, 'm-hide')}
    ${spk('88%', '30%', 26, 'var(--pink)', 1.1)}
    ${spk('7%', '42%', 18, 'var(--violet)', 2)}
    <h1 class="title" aria-label="Animation Week — انیمیشن و معماری"><span>ANIMATION</span><span class="row2"><span>WEEK</span><span class="fa">انیمیشن و معماری</span></span><span class="ghost" aria-hidden="true">${GHOST('gh')}</span></h1>
    <div class="when">${s}</div>
  </header>`;
}

function footer() {
  return `<footer class="foot"><div class="inner small"><span>${esc(E.title || 'هفته‌ی انیمیشن')}</span><span class="mini">ANIMATION WEEK</span></div></footer>`;
}

function tile(w) {
  const m = mediaOf(w);
  const badge = m.length > 1 ? ICON.multi : (isVideo(w) ? ICON.video : '');
  return `<a class="tile" id="t-${esc(w.id)}" href="#${hashOf(w)}" aria-label="${esc(label(w))}">
    <img src="${esc(coverOf(w))}" alt="" loading="lazy" decoding="async">${badge ? `<span class="badge">${badge}</span>` : ''}
    <span class="cap">${isVideo(w) ? `<span class="pl">${ICON.play}</span>` : ''}${w.name ? `<span>${esc(w.name)}</span>` : ''}</span></a>`;
}

function renderHome() {
  document.title = `${BRAND} · انیمیشن و معماری`;
  app.innerHTML = `${header()}
  <div class="inner">
    <div class="tabs"><span class="tab">${ICON.grid}<span>آثار</span><span class="n">${fa(W.length)}</span></span></div>
    <section class="grid" id="grid">${W.map(tile).join('') || '<p class="empty">هنوز اثری اضافه نشده.</p>'}</section>
  </div>${footer()}`;
  if (returnTo) {
    const t = document.getElementById('t-' + returnTo);
    if (t) { t.scrollIntoView({ block: 'center' }); t.classList.add('flash'); }
    returnTo = null;
  } else window.scrollTo(0, 0);
}

function bar() {
  return `<div class="bar"><div class="inner"><a class="back" href="#">${ICON.back}همه‌ی آثار</a><a class="mini" href="#">ANIMATION WEEK</a></div></div>`;
}

function one(m, w, i, lazy) {
  if (m.type === 'image') return `<img src="${esc(m.src)}" alt="${esc(label(w))} — ${fa(i + 1)}" ${lazy ? 'loading="lazy"' : ''}>`;
  return `<video src="${esc(m.src)}${m.poster ? '' : '#t=0.1'}"${m.poster ? ` poster="${esc(m.poster)}"` : ''} controls controlslist="nodownload" playsinline preload="${lazy ? 'none' : 'metadata'}"></video>`;
}

function media(w) {
  const ms = mediaOf(w);
  if (w.embed) return `<div class="view embed"><iframe src="${esc(w.embed)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(label(w))}"></iframe></div>`;
  if (ms.length < 2) return `<div class="view">${ms[0] ? one(ms[0], w, 0, false) : ''}</div>`;
  return `<div class="view gal"><div class="slides" tabindex="0" aria-label="${esc(label(w))}">${ms.map((m, i) => `<div class="slide">${one(m, w, i, i > 0)}</div>`).join('')}</div>
    <button class="nav-btn prev" aria-label="قبلی" disabled>${ICON.right}</button><button class="nav-btn next" aria-label="بعدی">${ICON.left}</button></div>`;
}

function renderWork(w) {
  const i = W.indexOf(w), prev = W[(i - 1 + W.length) % W.length], next = W[(i + 1) % W.length];
  const n = mediaOf(w).length;
  const ar = w.ar || (isVideo(w) ? '9/16' : '1/1');
  const wide = (() => { const [a, b] = ar.split('/').map(Number); return b ? a / b > 1 : false; })();
  document.title = `${label(w)} · ${BRAND}`;
  app.innerHTML = `${bar()}
  <div class="inner">
    <article class="work${wide ? ' wide' : ''}">
      <div class="stage"><div class="frame" style="--ar:${esc(ar)}">${media(w)}</div>
        ${n > 1 ? `<div class="dots">${Array.from({ length: n }, (_, j) => `<button aria-label="${fa(j + 1)} از ${fa(n)}" aria-current="${!j}"></button>`).join('')}</div>` : ''}
      </div>
      <div class="info">
        <div class="text">${paras(w.text)}</div>
        ${w.name ? `<p class="name">${esc(w.name)}</p>` : ''}
      </div>
    </article>
    ${W.length > 1 ? `<nav class="pn" aria-label="آثار دیگر">
      <a href="#${hashOf(prev)}"><img src="${esc(coverOf(prev))}" alt=""><span><small>اثر قبلی</small><b>اثر ${fa(prev.id)}</b></span></a>
      <a class="nx" href="#${hashOf(next)}"><img src="${esc(coverOf(next))}" alt=""><span><small>اثر بعدی</small><b>اثر ${fa(next.id)}</b></span></a>
    </nav>` : ''}
    <div class="all"><a class="btn ghosty" href="#">${ICON.grid.replace('<svg', '<svg width="18" height="18"')}دیدن همه‌ی آثار</a></div>
  </div>${footer()}`;
  returnTo = w.id;
  window.scrollTo(0, 0);
  const sl = app.querySelector('.slides');
  if (sl) {
    const dots = [...app.querySelectorAll('.dots button')], pv = app.querySelector('.nav-btn.prev'), nx = app.querySelector('.nav-btn.next');
    const cur = () => Math.round(Math.abs(sl.scrollLeft) / sl.clientWidth);
    const go = k => sl.children[Math.max(0, Math.min(n - 1, k))].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    let last = 0;
    const sync = () => {
      const c = cur();
      dots.forEach((d, j) => d.setAttribute('aria-current', j === c));
      pv.disabled = c === 0; nx.disabled = c === n - 1;
      if (c !== last) { sl.querySelectorAll('video').forEach((v, j) => { if (j !== c) v.pause(); }); last = c; }
    };
    sl.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    dots.forEach((d, j) => d.addEventListener('click', () => go(j)));
    pv.addEventListener('click', () => go(cur() - 1));
    nx.addEventListener('click', () => go(cur() + 1));
    sl.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(cur() + 1); if (e.key === 'ArrowRight') go(cur() - 1); });
  }
}

function route() {
  app.querySelectorAll('video').forEach(v => v.pause());
  const h = decodeURIComponent(location.hash.slice(1));
  if (h.startsWith('work-')) {
    const w = W.find(x => hashOf(x) === h);
    if (w) return renderWork(w);
    document.title = BRAND;
    app.innerHTML = `${bar()}<div class="inner missing"><h1>این اثر پیدا نشد</h1><p>همه‌ی آثار را از صفحه‌ی اصلی ببینید.</p><a class="btn" href="#">صفحه‌ی اصلی</a></div>${footer()}`;
    return;
  }
  renderHome();
}

document.addEventListener('contextmenu', e => { if (e.target.closest && e.target.closest('video, .view')) e.preventDefault(); });
window.addEventListener('hashchange', route);
route();
}
