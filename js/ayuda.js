/**
 * ayuda.js
 * Ruta: js/ayuda.js
 *
 * Página "Preguntas frecuentes":
 * - Filtro por categorías (botones .ayuda-chip)
 * - Buscador ampliado:
 *     · busca palabra por palabra y en cualquier orden ("pagar reserva", "reserva pago")
 *     · sin distinguir tildes ni mayúsculas
 *     · ignora palabras vacías (de, la, el, que, como...)
 *     · entiende singular/plural y variantes ("citas" = "cita", "doloroso" ≈ "duele")
 *     · sinónimos de la clínica (regla = menstruación = periodo, botox = toxina...)
 *     · si ninguna pregunta tiene todas las palabras, enseña las que tengan alguna
 *     · resalta las palabras encontradas en la pregunta
 * - Abrir una pregunta desde la URL: ayuda#reserva-25
 * - Datos estructurados FAQPage para Google (se generan desde el HTML)
 *
 * El navbar, el footer y la animación fade-up los carga js/ginecologia.js.
 */

// -----------------------------------------------------------
// SINÓNIMOS: cada línea es un grupo de palabras equivalentes.
// 👉 Añade aquí las palabras que usen tus pacientes (sin tildes, en minúscula).
// -----------------------------------------------------------
const AYUDA_SINONIMOS = [
  ['cita', 'consulta', 'visita', 'reserva', 'reservar', 'pedir', 'turno', 'hora'],
  ['pago', 'pagar', 'cobro', 'cobrar', 'tarjeta', 'bizum', 'efectivo', 'dinero', 'transferencia'],
  ['precio', 'precios', 'cuesta', 'coste', 'costo', 'tarifa', 'vale', 'cuanto', 'caro', 'barato', 'euros'],
  ['cancelar', 'anular', 'cambiar', 'modificar', 'mover', 'aplazar', 'devolucion', 'devolver', 'reembolso'],
  ['seguro', 'mutua', 'aseguradora', 'sanitas', 'adeslas', 'dkv', 'asisa', 'mapfre', 'cobertura'],
  ['regla', 'menstruacion', 'periodo', 'sangrado', 'mestruacion'],
  ['revision', 'chequeo', 'control', 'reconocimiento', 'citologia', 'papanicolau', 'vph', 'cribado'],
  ['laser', 'radiofrecuencia', 'regenerativa', 'rejuvenecimiento'],
  ['menopausia', 'sofocos', 'climaterio', 'hormonas', 'hormonal'],
  ['sequedad', 'seca', 'atrofia', 'lubricacion'],
  ['embarazo', 'embarazada', 'gestacion', 'bebe', 'lactancia', 'pecho'],
  ['botox', 'toxina', 'botulinica', 'arrugas'],
  ['hialuronico', 'relleno', 'rellenos', 'labios', 'ojeras', 'volumen'],
  ['dolor', 'duele', 'doloroso', 'molestia', 'molesta', 'anestesia', 'pinchazo'],
  ['recuperacion', 'baja', 'reposo', 'cicatrizacion', 'hematoma', 'moraton'],
  ['duracion', 'dura', 'tiempo', 'minutos', 'tarda', 'efecto'],
  ['natural', 'naturales', 'exagerado', 'resultado', 'resultados'],
  ['llevar', 'traer', 'documentos', 'dni', 'informes', 'pruebas', 'analitica'],
  ['acompanada', 'acompanante', 'pareja', 'madre', 'amiga'],
  ['privacidad', 'confidencial', 'confidencialidad', 'datos', 'secreto'],
  ['direccion', 'donde', 'llegar', 'ubicacion', 'mapa', 'metro', 'autobus', 'bus', 'parking', 'aparcar', 'aparcamiento', 'coche'],
  ['horario', 'abierto', 'abris', 'cerrado', 'sabado', 'domingo', 'manana', 'tarde'],
  ['edad', 'anos', 'adolescente', 'joven', 'primera'],
  ['lgtbiq', 'lgtb', 'lgbt', 'trans', 'lesbiana', 'bisexual', 'queer'],
  ['doctora', 'medica', 'medico', 'ginecologa', 'especialista', 'profesional'],
  ['incontinencia', 'orina', 'escapes', 'perdidas'],
  ['telefono', 'llamar', 'whatsapp', 'email', 'correo', 'contacto', 'contactar']
];

// Palabras que no aportan nada a la búsqueda
const AYUDA_PALABRAS_VACIAS = new Set([
  'a', 'al', 'algo', 'con', 'como', 'cual', 'de', 'del', 'el', 'ella', 'en', 'es', 'esta', 'este',
  'ha', 'hay', 'la', 'las', 'le', 'lo', 'los', 'me', 'mi', 'mis', 'muy', 'no', 'o', 'os', 'para',
  'pero', 'por', 'que', 'se', 'si', 'sin', 'su', 'sus', 'te', 'tengo', 'tu', 'un', 'una', 'unos',
  'unas', 'vosotras', 'vuestro', 'vuestra', 'y', 'ya', 'yo', 'puedo', 'quiero', 'necesito', 'hacer'
]);

document.addEventListener('DOMContentLoaded', () => {
  const grupos = Array.from(document.querySelectorAll('.ayuda-grupo'));
  const items = Array.from(document.querySelectorAll('.ayuda-item'));
  const chips = Array.from(document.querySelectorAll('.ayuda-chip'));
  const buscador = document.getElementById('ayuda-buscar');
  const vacio = document.getElementById('ayuda-vacio');
  if (!items.length) return;

  // --- Utilidades de texto ---
  const normalizar = (texto) =>
    texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ñ/g, 'n');

  // Raíz sencilla: quita plurales y terminaciones frecuentes para comparar
  function raiz(palabra) {
    let p = palabra;
    if (p.length > 5 && /(ciones|siones)$/.test(p)) p = p.slice(0, -5);   // revisiones -> revisi
    else if (p.length > 4 && /(cion|sion)$/.test(p)) p = p.slice(0, -3);  // revision -> revisi
    if (p.length > 4 && /es$/.test(p)) p = p.slice(0, -2);                // doctores -> doctor
    else if (p.length > 3 && /s$/.test(p)) p = p.slice(0, -1);            // citas -> cita
    if (p.length > 4 && /(ar|er|ir)$/.test(p)) p = p.slice(0, -2);        // pagar -> pag
    else if (p.length >= 4 && /[aeo]$/.test(p)) p = p.slice(0, -1);       // paga/pago -> pag, doctora -> doctor
    return p;
  }

  const palabrasDe = (texto) =>
    normalizar(texto).split(/[^a-z0-9]+/).filter((p) => p && !AYUDA_PALABRAS_VACIAS.has(p));

  // Mapa: raíz -> conjunto de raíces equivalentes (sinónimos)
  const sinonimos = new Map();
  AYUDA_SINONIMOS.forEach((grupo) => {
    const raices = grupo.map((p) => raiz(normalizar(p)));
    raices.forEach((r) => {
      if (!sinonimos.has(r)) sinonimos.set(r, new Set());
      raices.forEach((otra) => sinonimos.get(r).add(otra));
    });
  });
  const equivalentes = (r) => sinonimos.get(r) || new Set([r]);

  // Índice de cada pregunta: raíces de su pregunta + respuesta
  items.forEach((item) => {
    const summary = item.querySelector('summary');
    item.dataset.pregunta = summary.textContent;
    item._raices = new Set(palabrasDe(item.textContent).map(raiz));
    item._texto = normalizar(item.textContent);
  });

  // ¿La pregunta contiene este término (o un sinónimo, o empieza igual)?
  function contieneTermino(item, termino) {
    const r = raiz(termino);
    for (const eq of equivalentes(r)) {
      if (item._raices.has(eq)) return true;
    }
    // Coincidencia parcial mientras se escribe ("menop" -> menopausia)
    return termino.length >= 3 && item._texto.includes(termino);
  }

  function escaparHTML(texto) {
    return texto.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // Resalta en la pregunta las palabras buscadas (y sus variantes)
  function resaltar(item, terminos) {
    const summary = item.querySelector('summary');
    const original = item.dataset.pregunta;
    if (!terminos.length) { summary.textContent = original; return; }

    const buscadas = new Set();
    terminos.forEach((t) => equivalentes(raiz(t)).forEach((eq) => buscadas.add(eq)));

    // Recorremos las palabras del texto original y marcamos las que coinciden
    summary.innerHTML = original.split(/(\s+)/).map((trozo) => {
      const limpio = normalizar(trozo).replace(/[^a-z0-9]/g, '');
      if (!limpio) return escaparHTML(trozo);
      const r = raiz(limpio);
      const coincide = buscadas.has(r) || terminos.some((t) => t.length >= 3 && limpio.startsWith(t));
      return coincide ? '<mark>' + escaparHTML(trozo) + '</mark>' : escaparHTML(trozo);
    }).join('');
  }

  let categoria = 'todas';

  function aplicarFiltros() {
    const terminos = palabrasDe(buscador ? buscador.value : '');

    const enCategoria = (item) =>
      categoria === 'todas' || item.closest('.ayuda-grupo').dataset.cat === categoria;

    // 1º: preguntas con TODAS las palabras. 2º (si no hay): con ALGUNA.
    let coinciden = items.filter((item) =>
      enCategoria(item) && terminos.every((t) => contieneTermino(item, t)));
    if (terminos.length > 1 && coinciden.length === 0) {
      coinciden = items.filter((item) =>
        enCategoria(item) && terminos.some((t) => contieneTermino(item, t)));
    }
    const visibles = new Set(coinciden);

    items.forEach((item) => {
      const mostrar = visibles.has(item);
      item.hidden = !mostrar;
      resaltar(item, mostrar ? terminos : []);
    });
    grupos.forEach((grupo) => {
      grupo.hidden = !grupo.querySelector('.ayuda-item:not([hidden])');
    });
    if (vacio) vacio.hidden = visibles.size !== 0;
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
