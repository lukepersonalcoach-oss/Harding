// ==========================================================================
// Harding — shared site behaviour
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header: solid background once scrolled ---- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Homepage: greeting splash auto-scrolls into the hero ---- */
  const splash = document.getElementById('splash');
  const firstPhrase = document.querySelector('.sentence-section[data-phrase="1"]');
  if (splash && firstPhrase) {
    let userHasScrolled = false;
    const markScrolled = () => { userHasScrolled = true; };
    window.addEventListener('scroll', markScrolled, { passive: true });
    window.addEventListener('wheel', markScrolled, { passive: true });
    window.addEventListener('touchmove', markScrolled, { passive: true });

    // "Professional learning" appears at 0.2s, "for schools" at 1.3s,
    // each takes 0.9s to fade in — give it a beat after that, then move on.
    setTimeout(() => {
      if (!userHasScrolled) {
        firstPhrase.scrollIntoView({ behavior: 'smooth' });
      }
      window.removeEventListener('scroll', markScrolled);
      window.removeEventListener('wheel', markScrolled);
      window.removeEventListener('touchmove', markScrolled);
    }, 2900);
  }

  /* ---- Homepage: scroll-built sentence ---- */
  const phraseSections = document.querySelectorAll('.sentence-section');
  if (phraseSections.length) {
    const progress = document.getElementById('sentenceProgress');
    const dots = [];

    phraseSections.forEach((section, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('is-active');
      progress.appendChild(dot);
      dots.push(dot);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const phrase = entry.target.querySelector('.sentence-phrase');
        const index = Array.from(phraseSections).indexOf(entry.target);
        if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
          phrase && phrase.classList.add('is-active');
          dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
        } else {
          phrase && phrase.classList.remove('is-active');
        }
      });
    }, { threshold: [0, 0.55, 1] });

    phraseSections.forEach(section => observer.observe(section));
  }

  /* ---- Solutions page: vignette reveal on scroll ---- */
  const vignettes = document.querySelectorAll('.vignette');
  if (vignettes.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    vignettes.forEach(v => revealObserver.observe(v));
  }

});
