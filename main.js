/**
 * main.js
 * Carga cada componente HTML dentro de su contenedor en index.html
 * y arranca el comportamiento del menú móvil una vez todo está cargado.
 */

async function cargarComponente(idContenedor, ruta) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return; // esta página no tiene ese hueco: no se carga
  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) {
      throw new Error('No se pudo cargar ' + ruta + ' (' + respuesta.status + ')');
    }
    const html = await respuesta.text();
    contenedor.innerHTML = html;
  } catch (error) {
    console.error('Error cargando componente:', error);
  }
}

async function iniciarPagina() {
  await Promise.all([
    cargarComponente('navbar', 'components/navbar.html'),
    cargarComponente('especialistas', 'components/especialistas.html'),
    cargarComponente('presentacion', 'components/presentacion.html'),
    cargarComponente('three-cards', 'components/three-cards.html'),
    cargarComponente('carrusel-contenedor', 'components/carrusel.html'),
    cargarComponente('blog', 'components/blog.html'),
    cargarComponente('ubicacion', 'components/ubicacion.html'),
    cargarComponente('footer', 'components/footer.html'),
  ]);

  // Solo se arranca lo que esté incluido en la página
  if (typeof inicializarNavbar === 'function') inicializarNavbar();
  if (typeof iniciarBlog === 'function') iniciarBlog();
  if (typeof inicializarCarrusel === 'function') inicializarCarrusel();
  if (typeof inicializarUbicacion === 'function') inicializarUbicacion();
}

document.addEventListener('DOMContentLoaded', iniciarPagina);
