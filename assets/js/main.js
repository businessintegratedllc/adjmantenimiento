/* ============================================================
   ADJ Mantenimiento — main.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Año en footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Lista de imágenes de la galería ---------- */
  const images = [
    "Foto1","Foto2","Foto3","Foto5","Foto6","Foto7","Foto8","Foto9",
    "Foto10","Foto11","Foto12","Foto13","Foto14","Foto15","Foto16","Foto17",
    "Foto18","Foto19","Foto20","Foto21","Foto22","Foto23","Foto24","Foto25",
    "Foto26","Foto29","Foto32","Foto33"
  ];

  const THUMB = "assets/img/thumbs/";
  const FULL  = "assets/img/full/";

  /* ---------- Render de la galería ---------- */
  const grid = document.getElementById("galleryGrid");
  const zoomIcon =
    '<span class="zoom"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg></span>';

  const frag = document.createDocumentFragment();
  images.forEach((name, i) => {
    const fig = document.createElement("button");
    fig.className = "gallery-item reveal";
    fig.type = "button";
    fig.setAttribute("data-index", i);
    fig.setAttribute("aria-label", "Ver imagen " + (i + 1));
    fig.innerHTML =
      '<img src="' + THUMB + name + '.jpg" alt="Trabajo ADJ ' + (i + 1) + '" loading="lazy" />' +
      zoomIcon;
    fig.addEventListener("click", () => openLightbox(i));
    frag.appendChild(fig);
  });
  grid.appendChild(frag);

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCounter = document.getElementById("lightboxCounter");
  const lbClose = document.getElementById("lightboxClose");
  const lbPrev = document.getElementById("lightboxPrev");
  const lbNext = document.getElementById("lightboxNext");
  let current = 0;

  function showImage(i) {
    current = (i + images.length) % images.length;
    lbImg.src = FULL + images[current] + ".jpg";
    lbImg.alt = "Trabajo ADJ " + (current + 1);
    lbCounter.textContent = (current + 1) + " / " + images.length;
  }
  function openLightbox(i) {
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("show"));
    document.body.style.overflow = "hidden";
    showImage(i);
  }
  function closeLightbox() {
    lb.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => (lb.hidden = true), 300);
  }
  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => showImage(current - 1));
  lbNext.addEventListener("click", () => showImage(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(current - 1);
    if (e.key === "ArrowRight") showImage(current + 1);
  });

  /* ---------- Header scroll ---------- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Formulario de cotización ---------- */
  const form = document.getElementById("quoteForm");
  const success = document.getElementById("formSuccess");

  function setInvalid(el, bad) {
    el.classList.toggle("invalid", bad);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = form.name;
    const phone = form.phone;
    const service = form.service;
    const message = form.message;

    let ok = true;
    [name, phone, service, message].forEach((f) => {
      const bad = !f.value.trim();
      setInvalid(f, bad);
      if (bad) ok = false;
    });
    if (!ok) {
      success.hidden = true;
      const firstBad = form.querySelector(".invalid");
      if (firstBad) firstBad.focus();
      return;
    }

    const email = form.email.value.trim();
    const subject = "Solicitud de cotización ADJ - " + service.value;
    const body =
      "Nombre: " + name.value.trim() + "\n" +
      "Teléfono / WhatsApp: " + phone.value.trim() + "\n" +
      "Correo: " + (email || "(no proporcionado)") + "\n" +
      "Servicio: " + service.value + "\n\n" +
      "Detalles:\n" + message.value.trim() + "\n\n" +
      "-- Enviado desde el sitio web de ADJ Mantenimiento --";

    const mailto =
      "mailto:info@adjmantenimiento.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);

    success.hidden = false;
    window.location.href = mailto;
    form.reset();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
