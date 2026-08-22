
(function () {
  "use strict";

  const DATA_URL = "data/courses.json";

  const CATEGORY_ACCENT = {
    "Python": "#2F5D9E",
    "C++": "#00549C",
    "PostgreSQL": "#1E5B8C",
    "Java": "#A6192E",
    "TypeScript": "#0033A0",
    "HTML & CSS": "#C9A227",
    "ReactJS": "#0A2A55"
  };

  const els = {
    list: document.getElementById("course-list"),
    empty: document.getElementById("empty-state"),
    resultsMeta: document.getElementById("results-meta"),
    languageSelect: document.getElementById("filter-language"),
    levelSelect: document.getElementById("filter-level"),
    priceSelect: document.getElementById("filter-price"),
    searchInput: document.getElementById("course-search"),
    sortBtn: document.getElementById("sort-toggle")
  };

  let allCourses = [];
  let state = {
    language: "all",
    level: "all",
    price: "all",
    query: "",
    sort: "default" // 'default' | 'price-asc' | 'price-desc'
  };

  init();

  async function init() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error("Failed to load courses (" + res.status + ")");
      allCourses = await res.json();
      populateFilters(allCourses);
      bindEvents();
      render();
    } catch (err) {
      console.error(err);
      if (els.list) {
        els.list.innerHTML = "";
      }
      if (els.empty) {
        els.empty.hidden = false;
        els.empty.querySelector("h3").textContent = "Couldn't load courses";
        els.empty.querySelector("p").textContent =
          "Something went wrong fetching the catalogue. Please refresh the page.";
      }
    }
  }

  function populateFilters(courses) {
    const languages = uniqueSorted(courses.map((c) => c.category));
    const levels = uniqueSorted(courses.map((c) => c.level));

    if (els.languageSelect) {
      appendOptions(els.languageSelect, languages);
    }
    if (els.levelSelect) {
      appendOptions(els.levelSelect, levels);
    }
  }

  function appendOptions(selectEl, values) {
    values.forEach((value) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      selectEl.appendChild(opt);
    });
  }

  function uniqueSorted(arr) {
    return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
  }

  function bindEvents() {
    if (els.languageSelect) {
      els.languageSelect.addEventListener("change", (e) => {
        state.language = e.target.value;
        render();
      });
    }
    if (els.levelSelect) {
      els.levelSelect.addEventListener("change", (e) => {
        state.level = e.target.value;
        render();
      });
    }
    if (els.priceSelect) {
      els.priceSelect.addEventListener("change", (e) => {
        state.price = e.target.value;
        render();
      });
    }
    if (els.searchInput) {
      let debounceId;
      els.searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceId);
        const value = e.target.value;
        debounceId = setTimeout(() => {
          state.query = value.trim().toLowerCase();
          render();
        }, 150);
      });
    }
    if (els.sortBtn) {
      els.sortBtn.addEventListener("click", () => {
        state.sort =
          state.sort === "price-asc"
            ? "price-desc"
            : state.sort === "price-desc"
            ? "default"
            : "price-asc";
        els.sortBtn.setAttribute("data-sort", state.sort);
        els.sortBtn.setAttribute(
          "aria-label",
          state.sort === "price-asc"
            ? "Sorted by price: low to high"
            : state.sort === "price-desc"
            ? "Sorted by price: high to low"
            : "Sort by price"
        );
        render();
      });
    }
  }

  function getFiltered() {
    let results = allCourses.filter((c) => {
      const matchesLanguage = state.language === "all" || c.category === state.language;
      const matchesLevel = state.level === "all" || c.level === state.level;
      const matchesPrice =
        state.price === "all" ||
        (state.price === "free" && c.price === 0) ||
        (state.price === "paid" && c.price > 0);
      const matchesQuery =
        state.query === "" ||
        c.title.toLowerCase().includes(state.query) ||
        c.description.toLowerCase().includes(state.query) ||
        c.instructor.toLowerCase().includes(state.query) ||
        c.category.toLowerCase().includes(state.query);

      return matchesLanguage && matchesLevel && matchesPrice && matchesQuery;
    });

    if (state.sort === "price-asc") {
      results = results.slice().sort((a, b) => a.price - b.price);
    } else if (state.sort === "price-desc") {
      results = results.slice().sort((a, b) => b.price - a.price);
    }

    return results;
  }

  function render() {
    const results = getFiltered();

    if (els.resultsMeta) {
      els.resultsMeta.textContent =
        results.length + (results.length === 1 ? " course found" : " courses found");
    }

    if (!els.list) return;

    if (results.length === 0) {
      els.list.innerHTML = "";
      if (els.empty) els.empty.hidden = false;
      return;
    }

    if (els.empty) els.empty.hidden = true;
    els.list.innerHTML = results.map(courseRowTemplate).join("");
  }

  function courseRowTemplate(course) {
    const accent = CATEGORY_ACCENT[course.category] || "var(--up-navy)";
    const initial = course.category ? course.category.trim().charAt(0) : "?";
    const priceLabel = course.price === 0 ? "Free" : "R " + course.price;
    const levelKey = course.level.toLowerCase();

    return `
      <li class="course-row">
        <a class="course-row-link" href="course-detail.html?id=${encodeURIComponent(course.id)}">
          <span class="course-row-icon" style="background:${accent}" aria-hidden="true">
            <span class="course-row-icon-fallback">${escapeHtml(initial)}</span>
            <img
              src="${escapeHtml(course.image)}"
              alt=""
              loading="lazy"
              onerror="this.style.display='none'"
            />
          </span>
          <span class="course-row-info">
            <h3>
              ${escapeHtml(course.title)}
              <span class="badge-level" data-level="${levelKey}">${escapeHtml(course.level)}</span>
            </h3>
            <span class="course-row-meta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              ${course.durationHours}h
              <span class="dot">&bull;</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${escapeHtml(course.instructor)}
            </span>
          </span>
          <span class="course-row-price" data-free="${course.price === 0}">${priceLabel}</span>
          <span class="course-row-chevron" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </span>
        </a>
      </li>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();