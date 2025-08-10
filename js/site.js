<script>
// ---- Single source of truth for page URLs (all plural) ----
const PAGES = {
  home: 'index.html',
  projects: 'projects.html',
  labs: 'labs.html',
  writings: 'writings.html',
};

// Helper: build a link, optionally with #slug
function pageLink(pageKey, slug) {
  const base = PAGES[pageKey];
  return slug ? `${base}#${slug}` : base;
}

// ---- Header / Footer renderer (keeps your existing look) ----
function renderHeader(activeKey = '') {
  const header = document.getElementById('site-header');
  if (!header) return;
  header.innerHTML = `
    <div id="bar" style="position:fixed;top:0;left:0;height:3px;background:var(--accent);width:0;z-index:70"></div>
    <header>
      <div class="bar">
        <div class="brand">
          <img class="brand-icon" alt="Sun polyhedron icon" src="images/Kepler_Dodecahedron_Universe.png">
          <div><h1>Christopher Rager</h1></div>
        </div>
        <nav id="topnav" class="nav" aria-label="Primary">
          <a href="${pageLink('home')}" ${activeKey==='home'?'class="active"':''}>Home</a>
          <a href="${pageLink('projects')}" ${activeKey==='projects'?'class="active"':''}>Projects</a>
          <a href="${pageLink('labs')}" ${activeKey==='labs'?'class="active"':''}>Lab Notes</a>
          <a href="${pageLink('writings')}" ${activeKey==='writings'?'class="active"':''}>Writing</a>
          <button id="theme" class="icon-btn" aria-label="Toggle theme" aria-pressed="false" title="Toggle theme">
            <svg id="icon-moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
            </svg>
          </button>
          <a class="icon-btn" href="https://github.com/basis-spline" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.65 0 8.15c0 3.6 2.29 6.64 5.47 7.72.4.07.55-.18.55-.4 0-.2-.01-.87-.01-1.58-2.01.44-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.52 0-.53.63-.01 1.08.6 1.23.85.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.91-3.64-4.05 0-.9.31-1.64.82-2.22-.08-.21-.36-1.05.08-2.18 0 0 .67-.22 2.2.85.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.07 2.2-.85 2.2-.85.44 1.13.16 1.97.08 2.18.51.58.82 1.32.82 2.22 0 3.15-1.87 3.84-3.65 4.05.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .22.15.48.55.4A8.13 8.13 0 0016 8.15C16 3.65 12.42 0 8 0z"/></svg>
          </a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <footer>
      <hr>
      <div style="max-width:1100px;margin:0 auto;padding:0 calc(var(--space)*1.2) 32px;color:var(--muted);font-size:var(--step--1)">
        © <span id="year"></span> Christopher Rager.
      </div>
    </footer>
    <button id="totop" class="btn" aria-label="Back to top" title="Back to top" style="position:fixed;right:16px;bottom:16px;display:none">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  `;
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // Progress bar + to-top
  const topBtn = document.getElementById('totop');
  addEventListener('scroll', ()=>{
    const sc = document.getElementById('bar');
    if (sc) {
      const y=scrollY, h=document.body.scrollHeight-innerHeight;
      sc.style.width=(y/Math.max(h,1)*100)+'%';
    }
    if (topBtn) topBtn.style.display = scrollY>400 ? 'inline-flex' : 'none';
  });
  if (topBtn) topBtn.onclick = ()=>scrollTo({top:0,behavior:'smooth'});
}

// Minimal theme toggle hookup (uses your CSS vars)
function initThemeToggle(){
  const key="theme"; const root=document.documentElement;
  const btn=document.getElementById('theme');
  const ICONS={sun:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>`,
               moon:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`};
  function setTheme(t){
    root.setAttribute('data-theme', t); localStorage.setItem(key,t);
    if (btn) { btn.innerHTML = t==='dark'?ICONS.sun:ICONS.moon; btn.setAttribute('aria-pressed', t==='dark'); }
    const metaLight=document.querySelector('meta[name="theme-color"][media*="light"]');
    const metaDark=document.querySelector('meta[name="theme-color"][media*="dark"]');
    if(t==='dark'){ metaDark?.setAttribute('content','#0F1210'); }
    else { metaLight?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim() || '#FFF7E8'); }
  }
  const saved=localStorage.getItem(key);
  setTheme(saved ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  if (btn) btn.addEventListener('click', ()=> setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));
}
</script>
