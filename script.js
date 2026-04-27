(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("demoForm");
  var formMessage = document.getElementById("formMessage");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navMenu.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    }
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function animateCount(el, target, duration) {
    var start = performance.now();
    var from = 0;
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = String(target);
    }
    requestAnimationFrame(frame);
  }

  var statNums = document.querySelectorAll(".stat-num[data-count]");
  if (statNums.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var statsDone = false;
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || statsDone) return;
          statsDone = true;
          statNums.forEach(function (el) {
            var raw = el.getAttribute("data-count");
            var n = raw ? parseInt(raw, 10) : 0;
            if (el.getAttribute("data-suffix") === "decimal") {
              el.textContent = el.getAttribute("data-count") || "99";
              return;
            }
            animateCount(el, n, 1200 + Math.random() * 400);
          });
          statsObserver.disconnect();
        });
      },
      { threshold: 0.2 }
    );
    var heroStats = document.querySelector(".hero-stats");
    if (heroStats) statsObserver.observe(heroStats);
  } else {
    statNums.forEach(function (el) {
      var c = el.getAttribute("data-count");
      if (c) el.textContent = c;
    });
  }

  if (form && formMessage) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formMessage.classList.remove("is-error");
      var input = form.querySelector("#email");
      var email = input && input.value ? input.value.trim() : "";
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMessage.textContent = "Please enter a valid work email.";
        formMessage.classList.add("is-error");
        return;
      }
      formMessage.textContent = "Thanks — we’ll reach out within one business day.";
      if (input) input.value = "";
    });
  }
})();
