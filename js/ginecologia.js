/**
 * ginecologia.js
 * Ruta: js/ginecologia.js
 *
 * - Carga navbar y footer (mismo patrón que contacto-presencial.js)
 * - Anima la aparición de cada sección (.fade-up) al hacer scroll
 *
 * Nota: también lo usa components/estetica.html (misma estructura de
 * página, sin lógica propia), por eso no existe un js/estetica.js aparte.
 */

document.addEventListener('DOMContentLoaded', async () => {

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
    console.error('Error cargando componentes de ginecología:', error);
  }

  inicializarFadeUp();
});

function inicializarFadeUp() {
  const bloques = document.querySelectorAll('.fade-up');
  if (!bloques.length) return;

  if (!('IntersectionObserver' in window)) {
    bloques.forEach(el => el.classList.add('visible'));
    return;
  }

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

  bloques.forEach(el => observer.observe(el));
}
