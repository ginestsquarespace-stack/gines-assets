/**
 * ayuda.js
 * Ruta: js/ayuda.js
 *
 * Página "Preguntas frecuentes":
 * - Filtro por categorías (botones .ayuda-chip)
 * - Buscador (sin distinguir tildes ni mayúsculas) con resaltado
 * - Abrir una pregunta desde la URL: ayuda#reserva-25
 * - Datos estructurados FAQPage para Google (se generan desde el HTML)
 *
 * El navbar, el footer y la animación fade-up los carga js/ginecologia.js.
 */
document.addEventListener('DOMContentLoaded', () => {
  const grupos = Array.from(document.querySelectorAll('.ayuda-grupo'));
  const items = Array.from(document.querySelectorAll('.ayuda-item'));
  const chips = Array.from(document.querySelectorAll('.ayuda-chip'));
  const buscador = document.getElementById('ayuda-buscar');
  const vacio = document.getElementById('ayuda-vacio');
  if (!items.length) return;

  // Guardamos el texto original de cada pregunta para poder resaltar
  items.forEach((item) => {
    const summary = item.querySelector('summary');
    item.dataset.pregunta = summary.textContent;
  });

  let categoria = 'todas';

  const normalizar = (texto) =>
    texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function escaparHTML(texto) {
    return texto.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // Resalta en la pregunta el texto buscado (respetando tildes del original)
  function resaltar(item, termino) {
    const summary = item.querySelector('summary');
    const original = item.dataset.pregunta;
    if (!termino) { summary.textContent = original; return; }

    const pos = normalizar(original).indexOf(termino);
    if (pos === -1) { summary.textContent = original; return; }

    summary.innerHTML =
      escaparHTML(original.slice(0, pos)) +
      '<mark>' + escaparHTML(original.slice(pos, pos + termino.length)) + '</mark>' +
      escaparHTML(original.slice(pos + termino.length));
  }

  function aplicarFiltros() {
    const termino = normalizar((buscador && buscador.value || '').trim());
    let visibles = 0;

    grupos.forEach((grupo) => {
      const enCategoria = categoria === 'todas' || grupo.dataset.cat === categoria;
      let visiblesGrupo = 0;

      grupo.querySelectorAll('.ayuda-item').forEach((item) => {
        const coincide = !termino || normalizar(item.textContent).includes(termino);
        const mostrar = enCategoria && coincide;
        item.hidden = !mostrar;
        resaltar(item, mostrar ? termino : '');
        if (mostrar) visiblesGrupo++;
      });

      grupo.hidden = visiblesGrupo === 0;
      visibles += visiblesGrupo;
    });

    if (vacio) vacio.hidden = visibles !== 0;
  }

  // Categorías
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      categoria = chip.dataset.cat;
      chips.forEach((c) => c.classList.toggle('activa', c === chip));
      aplicarFiltros();
    });
  });

  // Buscador (al escribir)
  if (buscador) buscador.addEventListener('input', aplicarFiltros);

  // Abrir una pregunta desde la URL (#id)
  function abrirDesdeHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const item = document.getElementById(id);
    if (!item || !item.classList.contains('ayuda-item')) return;
    item.hidden = false;
    item.closest('.ayuda-grupo').hidden = false;
    item.open = true;
    setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }
  abrirDesdeHash();
  window.addEventListener('hashchange', abrirDesdeHash);

  // Datos estructurados FAQPage (Google puede mostrar las preguntas en los resultados)
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.dataset.pregunta.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.querySelector('.ayuda-respuesta').textContent.replace(/\s+/g, ' ').trim()
      }
    }))
  };
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify(faq);
  document.head.appendChild(ld);
});
