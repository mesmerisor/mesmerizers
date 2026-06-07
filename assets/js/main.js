/* ============================================================
   MESMERIZERS — interactions
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar scroll state ---------- */
  var nav = document.querySelector('.nav');
  var prog = document.querySelector('.scroll-prog');
  var totop = document.querySelector('.totop');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (totop) totop.classList.toggle('show', y > 600);
    if (prog) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.nav__burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
      var open = nav.classList.contains('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-count').split('.')[1] || '').length;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var dur = 1600, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(dec);
      el.textContent = prefix + Number(val).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      el.textContent = prefix + parseFloat(el.getAttribute('data-count')).toLocaleString('en-IN') + suffix;
    });
  }

  /* ---------- Hero parallax (pointer) ---------- */
  var hero = document.querySelector('.hero');
  if (hero && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var layers = hero.querySelectorAll('[data-parallax]');
    hero.addEventListener('mousemove', function (e) {
      var cx = (e.clientX / window.innerWidth - 0.5);
      var cy = (e.clientY / window.innerHeight - 0.5);
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute('data-parallax')) || 14;
        l.style.transform = 'translate3d(' + (cx * d) + 'px,' + (cy * d) + 'px,0)';
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + mx * 0.25 + 'px,' + my * 0.35 + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Contact form (no backend; graceful) ---------- */
  var form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        if (!f.value.trim()) { ok = false; f.style.borderColor = '#ef4444'; }
        else { f.style.borderColor = ''; }
      });
      var email = form.querySelector('input[type=email]');
      if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        ok = false; email.style.borderColor = '#ef4444';
      }
      if (!ok) return;
      var msg = form.querySelector('#formMessageBody') ? form.querySelector('#formMessageBody').value : '';
      var name = (form.querySelector('#firstName') || {}).value || '';
      var last = (form.querySelector('#lastName') || {}).value || '';
      var from = (form.querySelector('#email') || {}).value || '';
      var body = encodeURIComponent('Name: ' + name + ' ' + last + '\nEmail: ' + from + '\n\n' + msg);
      var success = form.querySelector('.form__success');
      if (success) success.classList.add('show');
      // Open user's mail client pre-filled to the org address
      window.location.href = 'mailto:connect@mesmerizers.org?subject=' +
        encodeURIComponent('Website enquiry from ' + name) + '&body=' + body;
      form.reset();
      setTimeout(function () { if (success) success.classList.remove('show'); }, 6000);
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Active nav link by path ---------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === 'index.html' && href === 'index.html')) a.classList.add('active');
  });
})();
