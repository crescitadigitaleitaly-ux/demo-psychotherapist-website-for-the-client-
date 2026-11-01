/* The Relational Practice — Concept. Progressive enhancement only:
   every page and link works without this file. No tracking, no storage, no network requests. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var desktop = window.matchMedia('(min-width: 1000px)');

  function setHeaderOffset() {
    if (!header) return;
    var bottom = header.getBoundingClientRect().bottom;
    root.style.setProperty('--header-h', Math.max(0, Math.round(bottom)) + 'px');
  }

  /* Mobile menu */
  function openMenu() {
    setHeaderOffset();
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('.nav-toggle__text').textContent = 'Close';
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
    var first = nav.querySelector('a, button');
    if (first) first.focus();
  }
  function closeMenu(returnFocus) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.nav-toggle__text').textContent = 'Menu';
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    if (returnFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      toggle.getAttribute('aria-expanded') === 'true' ? closeMenu(false) : openMenu();
    });
    desktop.addEventListener('change', function (e) { if (e.matches) closeMenu(false); });
  }

  /* Therapy sub-menu (disclosure pattern, works for keyboard and touch) */
  var parents = Array.prototype.slice.call(document.querySelectorAll('.nav__parent'));
  function setSub(btn, open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var sub = document.getElementById(btn.getAttribute('aria-controls'));
    if (sub) sub.classList.toggle('is-open', open);
  }
  parents.forEach(function (btn) {
    btn.addEventListener('click', function () { setSub(btn, btn.getAttribute('aria-expanded') !== 'true'); });
    var li = btn.closest('li');
    li.addEventListener('focusout', function (e) {
      if (desktop.matches && !li.contains(e.relatedTarget)) setSub(btn, false);
    });
  });
  document.addEventListener('click', function (e) {
    if (!desktop.matches) return;
    parents.forEach(function (btn) { if (!btn.closest('li').contains(e.target)) setSub(btn, false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openParent = parents.filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; })[0];
    if (openParent && (desktop.matches || openParent.closest('li').contains(document.activeElement))) {
      setSub(openParent, false);
      openParent.focus();
      return;
    }
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });

  /* Enquiry form preview: shows a confirmation message only. Nothing is collected or sent. */
  var previewBtn = document.getElementById('preview-confirmation');
  var status = document.getElementById('form-status');
  if (previewBtn && status) {
    previewBtn.addEventListener('click', function () {
      status.textContent = '';
      window.setTimeout(function () { status.textContent = 'Demo only — no enquiry has been sent.'; }, 50);
    });
  }

  window.addEventListener('resize', setHeaderOffset, { passive: true });
})();
