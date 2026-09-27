/**
 * contacto-presencial.js
 * Ruta: js/contacto-presencial.js
 *
 * Anima la aparición del bloque .contacto-hero al hacer scroll,
 * igual que el resto de bloques ".fade-up" del proyecto (conocenos.js).
 * Los componentes (navbar, footer, ubicación) ya se cargan desde main.js.
 */
document.addEventListener('DOMContentLoaded', () => {
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
});
