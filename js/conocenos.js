/**
 * conocenos.js  –  Lógica de la página Conócenos · GINES
 * Destino: js/conocenos.js
 * Depende de: js/navbar.js (inicializarNavbar)
 */

/* ---- Carga dinámica del navbar ---- */
async function cargarNavbar() {
  try {
    const r = await fetch('components/navbar.html');
    if (!r.ok) throw new Error('No se pudo cargar navbar: ' + r.status);
    const html = await r.text();
    document.getElementById('navbar').innerHTML = html;
    inicializarNavbar();
  } catch (e) {
    console.error('Error cargando navbar:', e);
  }
}

/* ---- Carga dinámica de la ubicación (componente compartido) ---- */
async function cargarUbicacion() {
  try {
    const r = await fetch('components/ubicacion.html');
    if (!r.ok) throw new Error('No se pudo cargar ubicacion: ' + r.status);
    const html = await r.text();
    document.getElementById('ubicacion').innerHTML = html;
  } catch (e) {
    console.error('Error cargando ubicación:', e);
  }
}

/* ---- Mapa de ubicación (lazy load igual que en index) ---- */
function inicializarUbicacion() {
  const contenedor = document.getElementById('ubicacion-mapa-contenedor');
  if (!contenedor) return;

  function cargarMapa() {
    if (contenedor.dataset.cargado === 'true') return;
    const src = contenedor.getAttribute('data-mapa-src');
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.loading = 'lazy';
    iframe.title = 'Mapa de ubicación de la clínica';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.setAttribute('allowfullscreen', '');
    contenedor.appendChild(iframe);
    contenedor.dataset.cargado = 'true';
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { cargarMapa(); o.disconnect(); } });
    }, { threshold: 0.2 });
    obs.observe(contenedor);
  } else {
    cargarMapa();
  }
}

/* ---- Animaciones fade-up al hacer scroll ---- */
function inicializarFadeUp() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10 }
  );
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ---- Punto de entrada ---- */
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([cargarNavbar(), cargarUbicacion()]);
  inicializarFadeUp();
  inicializarUbicacion();
});
