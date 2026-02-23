// Footer Year
document.getElementById("year").textContent = new Date().getFullYear();

// Config (folders)
const TIMETABLE_FOLDER = "assets/timetable/";
const CAROUSEL_FOLDER = "assets/carousel/";
const JSON_PATH = "./data.json";

// Helper so browser shows new uploads quickly
function withCacheBust(url) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${Date.now()}`;
}

async function loadImagesConfig() {
  const res = await fetch(JSON_PATH, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`Failed to load ${JSON_PATH} (HTTP ${res.status})`);
  return await res.json();
}

function renderTimetable(fileName) {
  const container = document.getElementById("timetableContainer");
  if (!container) return;

  if (!fileName) {
    container.innerHTML = `<div class="alert alert-warning mb-0">No timetable set in JSON.</div>`;
    return;
  }

  const img = document.createElement("img");
  img.src = withCacheBust(TIMETABLE_FOLDER + fileName);
  img.className = "img-fluid rounded-3 border";
  img.alt = "Tournament Timetable";
  img.loading = "eager";
  img.fetchPriority = "high";

  container.innerHTML = "";
  container.appendChild(img);
}

function renderCarousel(fileNames) {
  const inner = document.getElementById("carouselInner");
  if (!inner) return;

  if (!Array.isArray(fileNames) || fileNames.length === 0) {
    inner.innerHTML = `
      <div class="carousel-item active">
        <div class="alert alert-warning m-3">No carousel images set in JSON.</div>
      </div>`;
    return;
  }

  // Convert file names → full URLs
  const urls = fileNames.map((name) => CAROUSEL_FOLDER + name);

  // Build slides with 4 images per slide
  const perSlide = 4;
  const slideCount = Math.ceil(urls.length / perSlide);

  inner.innerHTML = "";

  for (let s = 0; s < slideCount; s++) {
    const item = document.createElement("div");
    item.className = `carousel-item ${s === 0 ? "active" : ""}`;

    const container = document.createElement("div");
    container.className = "container";

    const row = document.createElement("div");
    row.className = "row g-3 justify-content-center";

    for (let j = 0; j < perSlide; j++) {
      const idx = s * perSlide + j;
      if (idx >= urls.length) break;

      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-3";

      const frame = document.createElement("div");
      frame.className = "border rounded-3 overflow-hidden";

      const img = document.createElement("img");
      img.src = withCacheBust(urls[idx]);
      img.className = "w-100";
      img.alt = "Game";
      img.loading = "lazy";

      frame.appendChild(img);
      col.appendChild(frame);
      row.appendChild(col);
    }

    container.appendChild(row);
    item.appendChild(container);
    inner.appendChild(item);
  }
}

(async function init() {
  try {
    const config = await loadImagesConfig();
    renderTimetable(config.timetable);
    renderCarousel(config.carousel);
  } catch (e) {
    console.error(e);

    const tt = document.getElementById("timetableContainer");
    if (tt)
      tt.innerHTML = `<div class="alert alert-danger mb-0">Cannot load images config JSON.</div>`;

    const ci = document.getElementById("carouselInner");
    if (ci)
      ci.innerHTML = `
      <div class="carousel-item active">
        <div class="alert alert-danger m-3">Cannot load images config JSON.</div>
      </div>`;
  }
})();
