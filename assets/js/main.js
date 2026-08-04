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

  /* Count a number up to whatever it already reads. Non-numeric content
     (the "翌日" stat) is left alone. */
  const countUp = (el, duration = 1500) => {
    const target = parseInt(el.textContent.trim(), 10);
    if (!Number.isFinite(target) || target <= 0) return;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.round(target * easeOut(p)));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  };

  if (!reduceMotion && "IntersectionObserver" in window) {
    // Headings wipe up; everything else fades up; groups cascade.
    const MASK = [".sechead__title", ".voice__title"];
    const FADE = [
      ".sechead__idx", ".sechead__desc",
      ".about__text p", ".biz__head", ".biz__desc", ".biz__stat",
      ".chart__label", ".chart__note",
      ".voice__quote p", ".voice__sign",
      ".ftr__brand", ".ftr__nav",
    ];
    const STAGGER = [
      ".trust__list", ".pillars", ".biz__points", ".chips",
      ".merits", ".clist", ".roles", ".spec", ".contact__cards",
    ];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          $$("[data-count]", entry.target).forEach((n) => countUp(n));
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );

    const watch = (el) => io.observe(el);

    // A clipped element reports intersectionRatio 0 even while fully on
    // screen, so the mask is triggered by its unclipped ancestor instead.
    $$(MASK.join(",")).forEach((el) => el.classList.add("reveal-mask"));
    $$(".sechead, .voice__quote").forEach(watch);

    $$(FADE.join(",")).forEach((el) => {
      el.classList.add("reveal");
      // Siblings in the same block trail each other slightly.
      const prev = el.previousElementSibling;
      el.style.setProperty("--i", prev && prev.classList.contains("reveal") ? 1 : 0);
      watch(el);
    });

    $$(STAGGER.join(",")).forEach((group) => {
      group.classList.add("stagger");
      Array.from(group.children).forEach((child, i) => child.style.setProperty("--i", i));
      watch(group);
    });

    // Supply-chain rows animate hop by hop, so index every node.
    $$(".chart__row").forEach((row) => {
      $$(".chain__node", row).forEach((n, i) => {
        n.style.setProperty("--i", i);
        n.classList.add("is-anim");
      });
      watch(row);
    });

    // The hero is deliberately absent from the observer: it animates from CSS
    // keyframes so it never flashes visible-then-hidden when this deferred
    // script parses. The count is held back to meet the stats' own fade-in.
    setTimeout(() => $$(".hero__stats b").forEach((el) => countUp(el)), 680);
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
