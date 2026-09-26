/**
 * navbar.js
 * – Shrink al hacer scroll
 * – Hamburguesa toggle
 * Se llama desde main.js DESPUÉS de inyectar el navbar.
 */
function inicializarNavbar() {
  const nav    = document.getElementById('navbar-main');
  const boton  = document.getElementById('hamburguesa');
  const menu   = document.getElementById('menu-movil');

  if (!nav) return;

  /* ---- Shrink on scroll ---- */
  function onScroll() {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  /* ---- Hamburguesa ---- */
  if (boton && menu) {
    boton.addEventListener('click', () => {
      const abierto = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden', abierto);
      boton.classList.toggle('abierto', !abierto);
    });
  }
}