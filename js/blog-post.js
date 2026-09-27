/**
 * blog-post.js
 * Ruta: js/blog-post.js
 *
 * Script unificado para los blogs unitarios (blog-01, blog-02 y todos
 * los que vengan después).
 *
 * - Carga navbar y footer
 * - Barra de progreso de lectura
 * - Botón "volver arriba"
 * - Copiar enlace del artículo (no hace nada si no hay botón en la página)
 * - Filtro simple del buscador sobre "Posts más leídos" (no hace nada si
 *   no hay input de buscador en la página)
 */

document.addEventListener('DOMContentLoaded', async () => {

  /* ---- Cargar navbar y footer ---- */
  try {
    const [navRes, footRes] = await Promise.all([
      fetch('components/navbar.html'),
      fetch('components/footer.html'),
    ]);
    document.getElementById('navbar').innerHTML = await navRes.text();
    document.getElementById('footer').innerHTML = await footRes.text();

    if (typeof inicializarNavbar === 'function') {
      inicializarNavbar();
    }
  } catch (error) {
    console.error('Error cargando componentes del blog:', error);
  }

  inicializarProgresoLectura();
  inicializarBotonSubir();
  inicializarCopiarEnlace();
  inicializarBuscadorSidebar();
});

/* ---------------------------------------------
   BARRA DE PROGRESO DE LECTURA
--------------------------------------------- */
function inicializarProgresoLectura() {
  const barra = document.getElementById('progreso-lectura');
  if (!barra) return;

  function actualizarProgreso() {
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
    barra.style.width = progreso + '%';
  }

  window.addEventListener('scroll', actualizarProgreso, { passive: true });
  actualizarProgreso();
}

/* ---------------------------------------------
   BOTÓN VOLVER ARRIBA
--------------------------------------------- */
function inicializarBotonSubir() {
  const boton = document.getElementById('btn-subir');
  if (!boton) return;

  function toggleVisibilidad() {
    boton.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', toggleVisibilidad, { passive: true });
  toggleVisibilidad();

  boton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------
   COPIAR ENLACE DEL ARTÍCULO
--------------------------------------------- */
function inicializarCopiarEnlace() {
  const boton = document.getElementById('btn-copiar-enlace');
  if (!boton) return;

  const textoOriginal = boton.textContent;

  boton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      boton.textContent = '✓ Enlace copiado';
      boton.classList.add('copiado');
    } catch (error) {
      boton.textContent = 'No se pudo copiar';
    }

    setTimeout(() => {
      boton.textContent = textoOriginal;
      boton.classList.remove('copiado');
    }, 2000);
  });
}

/* ---------------------------------------------
   BUSCADOR (filtra la lista de "Posts más leídos")
--------------------------------------------- */
function inicializarBuscadorSidebar() {
  const input = document.getElementById('buscador-input');
  if (!input) return;

  const items = document.querySelectorAll('.posts-leidos li');

  input.addEventListener('input', () => {
    const texto = input.value.trim().toLowerCase();

    items.forEach((item) => {
      const contenido = item.textContent.toLowerCase();
      const coincide = contenido.includes(texto);
      item.classList.toggle('oculto', !coincide);
    });
  });
}
