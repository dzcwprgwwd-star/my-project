/* Smash & Stack — interactions */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav: shadow on scroll ---- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Scroll progress bar + hero scroll cue ---- */
  var progress = document.getElementById("progress");
  var scrollCue = document.getElementById("scrollCue");
  if (progress || scrollCue) {
    var ticking = false;
    var updateScrollFx = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var y = window.scrollY || doc.scrollTop;
      if (progress) {
        var pct = max > 0 ? y / max : 0;
        progress.style.transform = "scaleX(" + pct + ")";
      }
      if (scrollCue) {
        scrollCue.classList.toggle("hidden", y > 120);
      }
      ticking = false;
    };
    var onScrollFx = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollFx);
      }
    };
    updateScrollFx();
    window.addEventListener("scroll", onScrollFx, { passive: true });
    window.addEventListener("resize", onScrollFx, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var toggleIcon = document.getElementById("toggleIcon");
  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (toggleIcon) toggleIcon.setAttribute("href", open ? "#i-close" : "#i-menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!links.classList.contains("open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Active section in nav ---- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Highlight today's opening hours ---- */
  var today = new Date().getDay(); // 0 = Sunday
  var todayRow = document.querySelector('#hours li[data-day="' + today + '"]');
  if (todayRow) {
    todayRow.classList.add("today");
    var label = todayRow.querySelector("span");
    if (label) {
      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "Today";
      label.appendChild(badge);
    }
  }

  /* ---- Reservation form: min date = today ---- */
  var dateInput = document.getElementById("r-date");
  if (dateInput) {
    var t = new Date();
    var iso = t.getFullYear() + "-" +
      String(t.getMonth() + 1).padStart(2, "0") + "-" +
      String(t.getDate()).padStart(2, "0");
    dateInput.min = iso;
    if (!dateInput.value) dateInput.value = iso;
  }

  /* ---- Reservation form validation ---- */
  var form = document.getElementById("reserve");
  if (!form) return;

  var status = document.getElementById("formStatus");
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var validators = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your name."; },
    email: function (v) { return emailRe.test(v.trim()) ? "" : "Enter a valid email address."; },
    date: function (v) { return v ? "" : "Pick a date."; },
    time: function (v) { return v ? "" : "Pick a time."; },
    guests: function (v) { return v ? "" : "Choose your party size."; }
  };

  function fieldWrap(input) { return input.closest(".field"); }
  function errorEl(input) {
    var wrap = fieldWrap(input);
    return wrap ? wrap.querySelector(".error-msg") : null;
  }
  function showError(input, msg) {
    var wrap = fieldWrap(input);
    var err = errorEl(input);
    if (wrap) wrap.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  function validateField(input) {
    var fn = validators[input.name];
    if (!fn) return true;
    return showError(input, fn(input.value));
  }

  // Validate on blur (not on every keystroke)
  Object.keys(validators).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    input.addEventListener("blur", function () { validateField(input); });
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validateField(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("success");

    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      var input = form.elements[name];
      if (input && !validateField(input) && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      status.textContent = "Please fix the highlighted fields.";
      firstInvalid.focus();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Sending…";

    // Simulated async submit (no backend in this static demo)
    setTimeout(function () {
      var name = form.elements.name.value.trim().split(" ")[0];
      form.reset();
      Object.keys(validators).forEach(function (n) {
        var input = form.elements[n];
        if (input) showError(input, "");
      });
      if (dateInput) dateInput.value = dateInput.min;
      btn.disabled = false;
      btn.textContent = "Request reservation";
      status.classList.add("success");
      status.textContent = "Thanks, " + name + "! Your table request is in — we'll confirm by email shortly.";
    }, 900);
  });
})();
