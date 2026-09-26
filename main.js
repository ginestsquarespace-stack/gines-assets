/**
 * main.js
 * Carga cada componente HTML dentro de su contenedor en index.html
 * y arranca el comportamiento del menú móvil una vez todo está cargado.
 */

async function cargarComponente(idContenedor, ruta) {
  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) {
      throw new Error('No se pudo cargar ' + ruta + ' (' + respuesta.status + ')');
    }
    const html = await respuesta.text();
    document.getElementById(idContenedor).innerHTML = html;
  } catch (error) {
    console.error('Error cargando componente:', error);
  }
}

async function iniciarPagina() {
  await Promise.all([
    cargarComponente('navbar', 'components/navbar.html'),
    cargarComponente('especialistas', 'components/especialistas.html'),
    cargarComponente('presentación', 'components/presentación.html'),
    cargarComponente('three-cards', 'components/three-cards.html'),
    cargarComponente('carrusel-contenedor', 'components/carrusel.html'),
    cargarComponente('blog', 'components/blog.html'),
    cargarComponente('ubicacion', 'components/ubicacion.html'),
    cargarComponente('footer', 'components/footer.html'),
  ]);

  inicializarNavbar();
  iniciarBlog();
  inicializarCarrusel();
  inicializarUbicacion();
}

document.addEventListener('DOMContentLoaded', iniciarPagina);
