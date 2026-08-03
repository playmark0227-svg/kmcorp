/* ======================================================
   KM Corporation — site behaviours
   Progressive enhancement only: every feature here is a
   nicety, and the page is fully usable without any of it.
   ====================================================== */

(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---- Measure the scrollbar so --edge lands exactly on the
          container's text edge (see :root in style.css). -------- */
  const setScrollbarWidth = () => {
    const w = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--sbw", `${Math.max(w, 0)}px`);
  };
  setScrollbarWidth();
  window.addEventListener("resize", setScrollbarWidth, { passive: true });

  /* ---- Header state + scroll progress --------------------- */
  const hdr = $("#hdr");
  const progress = $("#progress");

  const onScroll = () => {
    const y = window.scrollY;
    if (hdr) hdr.classList.toggle("is-stuck", y > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---------------------------------------- */
  const burger = $("#burger");
  const nav = $("#nav");

  if (burger && nav) {
    const setMenu = (open) => {
      nav.classList.toggle("is-open", open);
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      document.body.style.overflow = open ? "hidden" : "";
    };

    burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));

    // Any in-menu link closes it.
    $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        burger.focus();
      }
    });

    // Leaving the mobile breakpoint must not strand the page in a locked state.
    const mq = window.matchMedia("(min-width: 1001px)");
    const onBreakpoint = (e) => { if (e.matches) setMenu(false); };
    mq.addEventListener("change", onBreakpoint);
  }

  /* ---- Reveal on scroll ----------------------------------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealSelectors = [
      ".sechead",
      ".about__text",
      ".pillars",
      ".biz__item",
      ".chart__row",
      ".merits",
      ".clist",
      ".voice__quote",
      ".roles",
      ".spec",
      ".contact__cards",
    ];

    const items = $$(revealSelectors.join(","));
    items.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => io.observe(el));
    // The hero is deliberately absent from the list: it is the LCP block, and
    // fading it in after the deferred script parses would flash it away first.
  }

  /* ---- Scrollspy ------------------------------------------ */
  const navLinks = $$(".nav__list a");
  const sections = navLinks
    .map((a) => $(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const visible = new Set();

    const paint = () => {
      // Whichever tracked section sits highest on screen wins.
      const current = sections
        .filter((s) => visible.has(s))
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];

      navLinks.forEach((a) => {
        const on = !!current && a.getAttribute("href") === `#${current.id}`;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        });
        paint();
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => spy.observe(s));
  }

  /* ---- Year stamp ----------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
