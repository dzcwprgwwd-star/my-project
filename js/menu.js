/* Smash & Stack — menu filtering */
(function () {
  "use strict";

  var filters = document.getElementById("filters");
  if (!filters) return;

  var chips = Array.prototype.slice.call(filters.querySelectorAll(".chip"));
  var items = Array.prototype.slice.call(document.querySelectorAll(".menu-item"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".menu-section"));
  var noResults = document.getElementById("noResults");

  function apply(filter) {
    items.forEach(function (item) {
      var tags = (item.getAttribute("data-tags") || "").split(/\s+/);
      var show = filter === "all" || tags.indexOf(filter) !== -1;
      item.style.display = show ? "" : "none";
    });

    // Hide section headers that have no visible items
    var anyVisible = false;
    sections.forEach(function (section) {
      var visible = section.querySelectorAll('.menu-item:not([style*="display: none"])').length;
      // recompute robustly
      var count = Array.prototype.filter.call(
        section.querySelectorAll(".menu-item"),
        function (i) { return i.style.display !== "none"; }
      ).length;
      section.style.display = count > 0 ? "" : "none";
      if (count > 0) anyVisible = true;
    });

    if (noResults) noResults.style.display = anyVisible ? "none" : "";
  }

  filters.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    chips.forEach(function (c) { c.classList.remove("active"); });
    chip.classList.add("active");
    apply(chip.getAttribute("data-filter"));
  });
})();
