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

  /* ---- Header scroll state --------------------------- */
  const header = $("#header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
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
    ".about__lead",
    ".about__pillars",
    ".voice__media",
    ".voice__body",
    ".svc__media",
    ".svc__body",
    ".flow__col",
    ".flow__features",
    ".farmers__grid",
    ".team__grid",
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
    if (el.matches(".about__pillars, .flow__features, .clients__list, .contact__cards, .company__list, .farmers__grid, .team__grid")) {
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
