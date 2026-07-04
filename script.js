// ==========================================================================
// Harding — shared site behaviour
// ==========================================================================

// Slower, gentler scroll than the browser default — used for the
// homepage auto-scroll and the Solutions page answer reveal.
function smoothScrollTo(el, { duration = 1600, center = false } = {}) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startY = window.scrollY || window.pageYOffset;
  const rect = el.getBoundingClientRect();
  let targetY = rect.top + startY;
  if (center) {
    targetY -= (window.innerHeight - rect.height) / 2;
  }

  if (prefersReduced) {
    window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
    return;
  }

  const distance = targetY - startY;
  let startTime = null;

  // easeInOutCubic — a smoother, more flowing curve than quad, with no
  // hard hand-off partway through
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // behavior: 'auto' here is essential — without it, the page's own
    // CSS scroll-behavior:smooth fights our animation frame-by-frame,
    // which is what caused the slow-then-jumpy stutter.
    window.scrollTo({ top: startY + distance * ease(progress), left: 0, behavior: 'auto' });
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

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
        smoothScrollTo(firstPhrase, { duration: 1900 });
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

  /* ---- Solutions page: problem tiles ---- */
  const problemGrid = document.getElementById('problemGrid');
  const answerPanel = document.getElementById('answerPanel');

  if (problemGrid && answerPanel) {
    const SOLUTIONS = [
      {
        title: "I need a compelling INSET keynote",
        body: "Your teachers have sat through polished INSET before… you need this one to have a real effect on classroom practice. I bring years of experience in building the keynote around your specific context, working with you so it speaks directly to where your school is right now. Staff are actively engaged with new ideas and leave energised and clear on what to do differently.",
        cta: "Discuss INSET now"
      },
      {
        title: "I want to develop our professional learning culture",
        body: "Training days come and go, but little will change without a genuine culture of learning. I bring expertise, experience and extra capacity to embed structures and practices: coaching conversations, peer observation, a shared language around teaching. Staff start taking ownership of their own development so that improvement becomes self-sustaining.",
        cta: "Start a culture conversation now"
      },
      {
        title: "There's too much inconsistency in my classrooms",
        body: "You see wildly varying standards when you walk around your school: pupils get a different education depending on which room they're in. I help define a clear, shared standard for effective teaching, then close the gap through instructional coaching, teacher by teacher. Standards rise and teachers feel supported.",
        cta: "Bring consistency now"
      },
      {
        title: "I want to help a struggling teacher turn it around",
        body: "Asking a struggling teacher to follow a policy or observe their peers isn't going to cut it. Left unaddressed, this becomes a capability process nobody wants. I provide a clearly documented informal support plan and work closely with the teacher, identifying the specific barriers and coaching concrete, practical changes into their everyday practice. Their classroom stabilises, trust returns, and a difficult HR route is avoided.",
        cta: "Bring in help now"
      },
      {
        title: "A member of staff could be more effective in their role",
        body: "You know someone has the potential to do more, but internal line management isn't working. I provide focused, honest coaching that helps the individual see the gap and build a practical, achievable route to success. The colleague feels invested in, not criticised, and you see a genuine, lasting change in performance.",
        cta: "Arrange coaching now"
      },
      {
        title: "My middle leaders haven't had the training they need",
        body: "Middle leaders are the engine of school improvement. Too often, though, they're promoted for being excellent teachers and left to figure out leadership on their own. Overstretched SLT colleagues pick up the pieces. I deliver leadership development built specifically for middle leaders: practical, everyday leadership skills, not abstract theory. Middle leaders gain confidence and capability, and strength ripples outward through their departments.",
        cta: "Discuss middle leadership training now"
      },
      {
        title: "I'm looking for brilliant senior leadership training",
        body: "In the volatile, uncertain, complex and ambiguous world of education, senior leaders require something more than generic leadership training. My unique course, The Call to Leadership, teaches a coherent philosophy of leadership rather than a jumble of disconnected tools. Your SLT gains a shared understanding of excellence and profound ways to address the challenges ahead.",
        cta: "Hear more about The Call to Leadership now"
      },
      {
        title: "We need an outside perspective",
        body: "Some problems seem intractable from inside a school. I come in as an experienced, objective advisor, finding new data, offering clear diagnosis, and working alongside you to design a practical way through. I offer clarity, new perspectives, a workable plan; you gain an experienced outside view in your corner.",
        cta: "Get an outside view now"
      }
    ];

    const tiles = problemGrid.querySelectorAll('.problem-tile');

    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        const index = Number(tile.getAttribute('data-index'));
        const data = SOLUTIONS[index];
        if (!data) return;

        tiles.forEach(t => t.classList.remove('is-active'));
        tile.classList.add('is-active');

        answerPanel.classList.remove('is-visible');
        answerPanel.innerHTML =
          '<h3 class="answer-title">' + data.title + '</h3>' +
          '<p class="answer-body">' + data.body + '</p>' +
          '<a href="about.html#contact" class="btn btn-gold">' + data.cta + '</a>';

        // Force reflow so the entrance animation replays each time
        void answerPanel.offsetWidth;
        answerPanel.classList.add('is-visible');

        // Bring the answer gently into view, on any screen size
        smoothScrollTo(answerPanel, { duration: 1400, center: true });
      });
    });
  }

});
