/* P Cube Legals: shared behaviour for all three designs. No build step, no dependencies. */
(function () {
  var body = document.body;
  var design = body.getAttribute('data-design');
  var page = body.getAttribute('data-page') || 'home';

  function store(method, key, value) {
    try { return method === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, value); }
    catch (e) { return null; }
  }

  /* 1. Design switcher (top-right). Delete this block, or set SHOW_SWITCHER to false, once a design is chosen. */
  var SHOW_SWITCHER = true;
  var DESIGNS = {
    heritage: { label: 'A · Heritage', pages: { home: 'index.html', practice: 'practice.html', about: 'index.html#firm', contact: 'contact.html' } },
    verdict:  { label: 'B · Verdict',  pages: { home: 'index.html', practice: 'index.html#practice', about: 'about.html', contact: 'contact.html' } },
    counsel:  { label: 'C · Counsel',  pages: { home: 'index.html', practice: 'practice.html', about: 'index.html#how', contact: 'book.html' } },
    ledger:   { label: 'D · Ledger',   pages: { home: 'index.html', practice: 'practice.html', about: 'index.html#firm', contact: 'contact.html' } },
    monolith: { label: 'E · Monolith', pages: { home: 'index.html', practice: 'practice.html', about: 'index.html#firm', contact: 'contact.html' } }
  };
  if (SHOW_SWITCHER && design && DESIGNS[design]) {
    store('set', 'pcube-design', design);
    var bar = document.createElement('div');
    bar.className = 'design-bar';
    var options = Object.keys(DESIGNS).map(function (k) {
      return '<option value="' + k + '"' + (k === design ? ' selected' : '') + '>' + DESIGNS[k].label + '</option>';
    }).join('');
    bar.innerHTML = '<div class="container"><label for="design-select">Preview design</label>' +
      '<select id="design-select">' + options + '</select></div>';
    body.insertBefore(bar, body.firstChild);
    bar.querySelector('select').addEventListener('change', function (e) {
      var target = e.target.value;
      store('set', 'pcube-design', target);
      window.location.href = '../' + target + '/' + (DESIGNS[target].pages[page] || 'index.html');
    });
  }

  /* 2. Mobile navigation */
  document.querySelectorAll('.nav-toggle').forEach(function (btn) {
    var header = btn.closest('header');
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  });

  /* 3. Bar Council of India disclaimer, shown once per browser */
  var SHOW_DISCLAIMER = true;
  if (SHOW_DISCLAIMER && store('get', 'pcube-bci-agreed') !== 'yes') {
    var modal = document.createElement('div');
    modal.className = 'bci-modal';
    modal.innerHTML =
      '<div class="bci-dialog" role="dialog" aria-modal="true" aria-labelledby="bci-title">' +
      '<h2 id="bci-title">Before you continue</h2>' +
      '<p>The Bar Council of India does not permit advocates to advertise or solicit work. By clicking “I agree”, you confirm that you are seeking information about P Cube Legals of your own accord, and that nothing on this website is an advertisement, solicitation or legal advice. Using this website does not create an advocate–client relationship.</p>' +
      '<div class="bci-actions"><button type="button" class="bci-agree">I agree</button>' +
      '<a class="bci-leave" href="https://www.google.com">Leave website</a></div></div>';
    body.appendChild(modal);
    var agree = modal.querySelector('.bci-agree');
    agree.focus();
    agree.addEventListener('click', function () {
      store('set', 'pcube-bci-agreed', 'yes');
      modal.hidden = true;
    });
  }

  /* 4. Choice groups (booking page): buttons with aria-pressed, summary updates */
  document.querySelectorAll('[data-choice-group]').forEach(function (group) {
    var key = group.getAttribute('data-choice-group');
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-value]');
      if (!btn || btn.disabled) return;
      group.querySelectorAll('button[data-value]').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      updateSummary();
    });
  });
  function chosen(key) {
    var b = document.querySelector('[data-choice-group="' + key + '"] button[aria-pressed="true"]');
    return b ? b.getAttribute('data-value') : '';
  }
  function updateSummary() {
    var map = { matter: chosen('matter'), mode: chosen('mode'), when: [chosen('day'), chosen('time')].filter(Boolean).join(', ') };
    document.querySelectorAll('[data-summary]').forEach(function (el) {
      el.textContent = map[el.getAttribute('data-summary')] || '—';
    });
    var status = document.querySelector('.booking-status');
    if (status) status.hidden = true;
  }
  if (document.querySelector('[data-summary]')) updateSummary();

  /* 5. Static forms. GitHub Pages cannot process forms. Until a form service
        (Formspree, Getform, Web3Forms…) is connected via the form's action URL,
        show a clear message instead of submitting. */
  document.querySelectorAll('form[data-static-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (form.getAttribute('action')) return; // a real endpoint is configured
      e.preventDefault();
      var status = form.querySelector('.form-status') || document.querySelector('.booking-status');
      if (status) { status.hidden = false; status.focus && status.focus(); }
    });
  });
})();
