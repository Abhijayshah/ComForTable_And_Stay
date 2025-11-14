// Update footer year
(function(){
  var yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
})();

// Smooth scrolling for internal anchor links
(function(){
  var anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if(target){
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// Theme: Light/Dark/System with persistence
(function(){
  var root = document.documentElement;
  var KEY = 'cs_theme';
  var mm = window.matchMedia('(prefers-color-scheme: dark)');
  function get(){
    var t = localStorage.getItem(KEY);
    return (t === 'light' || t === 'dark' || t === 'system') ? t : 'system';
  }
  function apply(t){
    root.setAttribute('data-theme', t);
    render();
  }
  function set(t){
    localStorage.setItem(KEY, t);
    apply(t);
  }
  function render(){
    var t = get();
    var btn = document.getElementById('themeToggle');
    var sel = document.getElementById('themeSelect');
    if(btn){ btn.textContent = t === 'dark' ? '🌙 Dark' : (t === 'light' ? '🌞 Light' : '🖥 System'); }
    if(sel){ sel.value = t; }
  }
  function init(){
    apply(get());
    var btn = document.getElementById('themeToggle');
    if(btn){
      btn.addEventListener('click', function(){
        var t = get();
        var next = t === 'light' ? 'dark' : (t === 'dark' ? 'system' : 'light');
        set(next);
      });
    }
    var sel = document.getElementById('themeSelect');
    if(sel){
      sel.addEventListener('change', function(){ set(sel.value); });
    }
    mm.addEventListener('change', function(){ if(get() === 'system') apply('system'); });
  }
  init();
})();

(function(){
  var btn = document.getElementById('backToTop');
  if(!btn) return;
  function onScroll(){
    if(window.scrollY > 400){
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();

// Async contact support form submission via Formspree
(function(){
  var form = document.getElementById('supportForm');
  var statusEl = document.getElementById('formStatus');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(statusEl){ statusEl.textContent = 'Sending…'; }
    var data = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function(res){
      if(res.ok){
        if(statusEl){ statusEl.textContent = 'Thanks! We will contact you shortly.'; }
        form.reset();
      } else {
        return res.json().then(function(){
          if(statusEl){ statusEl.textContent = 'Something went wrong. Please try again or call us.'; }
        });
      }
    }).catch(function(){
      if(statusEl){ statusEl.textContent = 'Network error. Please try again later.'; }
    });
  });
})();



