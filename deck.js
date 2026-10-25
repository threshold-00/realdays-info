// RealDays partner pitch: keys move between slides, a counter and progress bar
// follow along, and ?for=Business%20Name fills in the business's name.
(function () {
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var counter = document.getElementById('counter'), progress = document.getElementById('progress');
  var last = slides.length - 1, current = 0;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ?for=Indigo%20Woodworks: "for Indigo Woodworks" on the cover, and in the email subject.
  var name = (new URLSearchParams(location.search).get('for') || '').trim().slice(0, 80);
  if (name) {
    [].forEach.call(document.querySelectorAll('[data-for]'), function (el) { el.textContent = 'for ' + name; });
    var talk = document.getElementById('talkBtn');
    if (talk) talk.href = 'mailto:rowena@getrealdays.com?subject=' + encodeURIComponent('Founding partner: ' + name);
    document.title = 'RealDays partner pitch for ' + name;
  }

  // The slide whose top is nearest the top of the screen.
  function nearest() {
    var best = 0, bestD = Infinity;
    slides.forEach(function (s, i) {
      var d = Math.abs(s.getBoundingClientRect().top);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }
  // updateUrl is false on load, so a link like …/#money isn't overwritten before the
  // browser has jumped to it.
  function render(updateUrl) {
    current = nearest();
    // The cover is slide 0, so the count runs 1 / 11 to 11 / 11 after it.
    counter.textContent = current === 0 ? '' : current + ' / ' + last;
    progress.style.width = (current / last) * 100 + '%';
    var id = slides[current].id;
    if (updateUrl && location.hash.slice(1) !== id) history.replaceState(null, '', (current === 0 ? location.pathname + location.search : '#' + id));
  }
  function go(i) {
    i = Math.max(0, Math.min(last, i));
    slides[i].scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
  }

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target;
    var onControl = t && t.closest && t.closest('a, button, input, textarea, select, [contenteditable]');
    var k = e.key;
    var step = 0;
    if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown') step = 1;
    else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp') step = -1;
    else if (k === ' ' && !onControl) step = e.shiftKey ? -1 : 1;
    else if (k === 'Home') { e.preventDefault(); go(0); return; }
    else if (k === 'End') { e.preventDefault(); go(last); return; }
    if (!step) return;
    e.preventDefault();
    go(nearest() + step);
  });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; render(true); });
  }, { passive: true });
  window.addEventListener('resize', function () { render(false); });
  // A link straight to a slide: go there once the page (and its fonts) have laid out.
  var start = location.hash && document.getElementById(location.hash.slice(1));
  if (start) window.addEventListener('load', function () { start.scrollIntoView({ behavior: 'instant', block: 'start' }); render(false); });
  render(false);
})();
