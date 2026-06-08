/* ======================================================
   KM Corporation — Site Behaviors
   ====================================================== */

(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---- Loader ---------------------------------------- */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    if (!loader) return;
    setTimeout(() => loader.classList.add("is-hidden"), 700);
  });

  /* ---- Header scroll state + progress bar ------------ */
  const header = $("#header");
  const progress = $("#scrollProgress > i");
  const onScroll = () => {
    const sy = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", sy > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(sy / max, 1) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---- Hamburger menu -------------------------------- */
  const hamburger = $("#hamburger");
  const nav = $(".nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      hamburger.classList.toggle("is-active", open);
      hamburger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$(".nav__list a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        hamburger.classList.remove("is-active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Reveal on scroll ------------------------------ */
  const targets = [
    ".section__head",
    ".voice__head",
    ".voice__statement",
    ".about__lead",
    ".about__pillars",
    ".svc__media",
    ".svc__body",
    ".flowmap",
    ".flowmap__legend",
    ".flow__features",
    ".roles",
    ".clients__list",
    ".company__list",
    ".contact__cards",
    ".hero__title",
    ".hero__lead",
    ".hero__actions",
    ".hero__meta",
    ".hero__eyebrow",
  ];
  $$(targets.join(",")).forEach(el => {
    el.classList.add("reveal");
    if (el.matches(".about__pillars, .flow__features, .clients__list, .contact__cards, .company__list, .roles")) {
      el.classList.add("reveal-stagger");
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

  $$(".reveal").forEach(el => io.observe(el));

  /* ---- Scrollspy: active nav link -------------------- */
  const navLinks = $$(".nav__list a");
  const spyTargets = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (spyTargets.length) {
    const setActive = (id) => {
      navLinks.forEach(a => {
        const on = a.getAttribute("href") === id;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive("#" + e.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spyTargets.forEach(s => spy.observe(s));
  }

  /* ---- Smooth scroll for in-page anchors ------------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---- Year stamp ------------------------------------ */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Subtle parallax on hero bg --------------------- */
  const heroBg = $(".hero__bg");
  if (heroBg) {
    let raf = 0;
    window.addEventListener("scroll", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.18, 240);
        heroBg.style.transform = `translateY(${y}px) scale(${1 + Math.min(window.scrollY / 4500, 0.06)})`;
      });
    }, { passive: true });
  }
})();
