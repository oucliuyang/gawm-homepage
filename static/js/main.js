document.addEventListener('DOMContentLoaded', () => {
  // Copy the BibTeX block to the clipboard.
  const btn = document.getElementById('copy-bibtex');
  const code = document.getElementById('bibtex-code');
  if (btn && code) {
    btn.addEventListener('click', async () => {
      const label = btn.querySelector('.label');
      try {
        await navigator.clipboard.writeText(code.innerText.trim());
        label.textContent = 'Copied!';
      } catch (e) {
        label.textContent = 'Copy failed';
      }
      setTimeout(() => { label.textContent = 'Copy'; }, 1500);
    });
  }

  // Teaser: key frames seek the video, and the current phase is highlighted.
  const video = document.querySelector('.teaser video');
  const phases = Array.from(document.querySelectorAll('.teaser .phase'));
  if (video && phases.length) {
    const starts = phases.map((p) => parseFloat(p.dataset.t));
    phases.forEach((p, i) => p.addEventListener('click', () => {
      video.currentTime = starts[i];
      video.play().catch(() => {});
    }));
    video.addEventListener('timeupdate', () => {
      let cur = 0;
      starts.forEach((t, i) => { if (video.currentTime >= t) cur = i; });
      phases.forEach((p, i) => p.classList.toggle('active', i === cur));
    });
  }

  // Highlight the nav link of the section currently in view.
  const links = Array.from(document.querySelectorAll('.topnav a.nav-link'));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => observer.observe(s));
});
