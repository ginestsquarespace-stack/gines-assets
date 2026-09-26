/**
 * ubicacion.js
 * Inserta el iframe de Google Maps solo cuando el bloque de ubicación
 * entra en la pantalla, para no cargar el mapa si el usuario nunca
 * llega a verlo (igual de necesario aquí que el resto de componentes
 * con comportamiento propio, como carrusel.js o blog.js).
 */

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
    const observador = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          cargarMapa();
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observador.observe(contenedor);
  } else {
    // Navegadores sin soporte: cargamos directamente.
    cargarMapa();
  }
}
