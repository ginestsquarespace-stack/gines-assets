/* ==========================================================
   RESERVAR CITA — GINEST
   Ruta: js/cita-extended.js
   ========================================================== */

// -----------------------------------------------------------
// 1) SERVICIOS POR CATEGORÍA
//    (sacados de ginecologia.html y estetica.html)
// -----------------------------------------------------------
const SERVICIOS = {
  ginecologia: [
    "Revisión ginecológica rutinaria",
    "Citología y toma de muestras",
    "Ecografía ginecológica y mamaria",
    "Exploración mamaria",
    "Control anticonceptivo",
    "Asesoramiento en fertilidad",
    "Embarazo de bajo riesgo",
    "Menopausia y trastornos hormonales",
    "Sequedad vaginal",
    "Laxitud vaginal posparto",
    "Incontinencia urinaria leve",
    "Atrofia vulvovaginal en la menopausia",
    "Molestias en las relaciones sexuales",
    "Síndrome del ovario poliquístico",
    "Diagnóstico y tratamiento de infecciones",
    "Patologías del cuello uterino, vagina y vulva",
    "Otros trastornos genitales",
    "Segunda opinión ginecológica"
  ],
  estetica: [
    "Ácido hialurónico",
    "Botox",
    "Rellenos dérmicos",
    "Exosomas",
    "Inductores de colágeno",
    "Láseres de última generación",
    "Remodelación corporal",
    "Tratamiento de la flacidez",
    "Mejora de la textura de la piel",
    "Valoración nutricional personalizada",
    "Probioterapia",
    "Seguimiento nutricional",
    "Otro motivo de estética"
  ]
};

const TITULOS = {
  ginecologia: { badge: "Ginecología", titulo: "Reserva tu consulta de Ginecología" },
  estetica:    { badge: "Estética",    titulo: "Reserva tu consulta de Estética" }
};

// -----------------------------------------------------------
// 2) STRIPE PAYMENT LINKS (uno por categoría, 25 € cada uno)
//    👉 Sustituye cada URL por tu Payment Link real de Stripe.
//       Puedes usar el mismo enlace en los dos si no quieres separarlos.
//    Mientras tengan "PEGA_AQUI", el formulario funciona como
//    solicitud de cita sin pago.
// -----------------------------------------------------------
const STRIPE_PAYMENT_LINKS = {
  ginecologia: "https://buy.stripe.com/PEGA_AQUI_TU_ENLACE_GINECOLOGIA",
  estetica:    "https://buy.stripe.com/PEGA_AQUI_TU_ENLACE_ESTETICA"
};

// -----------------------------------------------------------
// 3) EMAIL DE LA CLÍNICA: aquí llegan todas las reservas
//    Servicio: FormSubmit (https://formsubmit.co), gratuito y sin cuenta.
//    La PRIMERA reserva envía a este correo un email de activación:
//    hay que pulsar "Activate Form" una sola vez.
// -----------------------------------------------------------
const EMAIL_RESERVAS = "info@ginest.es";
const FORM_ENDPOINT = "https://formsubmit.co/ajax/" + EMAIL_RESERVAS;

document.addEventListener("DOMContentLoaded", async () => {

  // --- Cargar navbar y footer (mismo patrón que ginecologia.js) ---
  try {
    const [navRes, footRes] = await Promise.all([
      fetch('components/navbar.html'),
      fetch('components/footer.html'),
    ]);
    document.getElementById('navbar').innerHTML = await navRes.text();
    document.getElementById('footer').innerHTML = await footRes.text();
    if (typeof inicializarNavbar === 'function') inicializarNavbar();
  } catch (err) {
    console.error('Error cargando navbar/footer:', err);
  }

  inicializarFadeUp();

  // --- Leer ?tipo= de la URL ---
  const params = new URLSearchParams(window.location.search);
  const tipo = params.get("tipo"); // "ginecologia" | "estetica" | null

  const formWrap = document.getElementById("reserva-form-wrap");
  const badge = document.getElementById("reserva-badge-tipo");
  const titulo = document.getElementById("reserva-titulo");
  const motivoSelect = document.getElementById("motivo-select");

  if (!tipo || !SERVICIOS[tipo]) {
    // Sin tipo válido -> se abre la ventana flotante para elegir Ginecología o Estética
    formWrap.classList.add("hidden");
    const intro = document.querySelector(".reserva-hero .ginec-intro");
    if (intro) intro.textContent = "Elige si tu consulta es de Ginecología o de Estética.";
    if (typeof window.abrirModalCita === "function") window.abrirModalCita();
    return;
  }

  // Tipo válido -> mostramos directamente el formulario
  formWrap.classList.remove("hidden");

  badge.textContent = TITULOS[tipo].badge;
  titulo.textContent = TITULOS[tipo].titulo;

  // Rellenar el desplegable de motivo según la categoría
  SERVICIOS[tipo].forEach((servicio) => {
    const opt = document.createElement("option");
    opt.value = servicio;
    opt.textContent = servicio;
    motivoSelect.appendChild(opt);
  });

  // --- Envío del formulario ---
  const form = document.getElementById("reserva-form");
  const errorBox = document.getElementById("reserva-error");

  // Mientras no esté el enlace de Stripe, el formulario es una solicitud de cita (sin pago)
  const STRIPE_PAYMENT_LINK = STRIPE_PAYMENT_LINKS[tipo];
  const SIN_PAGO = !STRIPE_PAYMENT_LINK || STRIPE_PAYMENT_LINK.includes("PEGA_AQUI");
  if (SIN_PAGO) {
    form.querySelector('button[type="submit"]').textContent = "Enviar solicitud de cita";
    const notaPago = form.querySelector(".reserva-nota-pago");
    if (notaPago) notaPago.classList.add("hidden");

    // Sin pago activo no se muestra ningún importe (evita prometer un pago de 25€ que no se cobra)
    const precio = form.querySelector(".reserva-resumen-precio");
    if (precio) precio.classList.add("hidden");
    form.querySelectorAll(".reserva-resumen-texto li").forEach((li) => {
      if (li.textContent.includes("25€")) li.classList.add("hidden");
    });
    const intro = document.querySelector(".reserva-hero .ginec-intro");
    if (intro) intro.textContent = "Completa el formulario y te contactaremos para confirmar tu cita.";
  }

  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const emailInput = document.getElementById("email");
  const comentariosInput = document.getElementById("comentarios");

  // -----------------------------------------------------------
  // Validación de campos: solo se permiten ciertos caracteres
  // -----------------------------------------------------------
  const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜüÇç\s'-]*$/;
  const REGEX_TELEFONO = /^\+?[0-9 ]*$/;
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const REGEX_COMENTARIOS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜüÇç0-9\s()"'¿?¡!,.;:\-\/€%@]*$/;

  // Filtrado en tiempo real: se eliminan los caracteres no permitidos según se escribe
  nombreInput.addEventListener("input", () => {
    nombreInput.value = nombreInput.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜüÇç\s'-]/g, "");
  });

  telefonoInput.addEventListener("input", () => {
    telefonoInput.value = telefonoInput.value.replace(/(?!^\+)[^0-9 ]/g, "");
  });

  comentariosInput.addEventListener("input", () => {
    comentariosInput.value = comentariosInput.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜüÇç0-9\s()"'¿?¡!,.;:\-\/€%@]/g, "");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";
    errorBox.classList.remove("ok");

    const motivo = motivoSelect.value;
    const nombre = nombreInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const email = emailInput.value.trim();
    const comentarios = comentariosInput.value.trim();

    if (!motivo || !nombre || !telefono || !email) {
      errorBox.textContent = "Por favor, completa todos los campos obligatorios.";
      return;
    }

    if (!REGEX_NOMBRE.test(nombre) || nombre.length < 3) {
      errorBox.textContent = "Introduce tu nombre y apellidos (solo letras, espacios, guiones y apóstrofos).";
      nombreInput.focus();
      return;
    }

    const digitosTelefono = telefono.replace(/\D/g, "");
    if (!REGEX_TELEFONO.test(telefono) || digitosTelefono.length < 9 || digitosTelefono.length > 15) {
      errorBox.textContent = "Introduce un teléfono válido (mínimo 9 cifras, ej. 600 000 000).";
      telefonoInput.focus();
      return;
    }

    if (!REGEX_EMAIL.test(email)) {
      errorBox.textContent = "Introduce un email con un formato válido (ej. tunombre@email.com).";
      emailInput.focus();
      return;
    }

    if (!REGEX_COMENTARIOS.test(comentarios)) {
      errorBox.textContent = "En información adicional hay caracteres no permitidos.";
      comentariosInput.focus();
      return;
    }

    // Referencia única: aparece en el email de la reserva y en el pago de Stripe,
    // así la clínica sabe qué pago corresponde a cada reserva.
    const referencia = (tipo === "ginecologia" ? "GIN" : "EST") + "-" + Date.now().toString(36).toUpperCase();
    const datos = { categoria: tipo, motivo, nombre, telefono, email, comentarios, referencia };

    // --- Enviar la reserva al email de la clínica ---
    const boton = form.querySelector('button[type="submit"]');
    boton.disabled = true;

    let emailEnviado = false;
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Nueva reserva web · ${TITULOS[tipo].badge} · ${nombre}`,
          _template: "table",
          _replyto: email,
          "Referencia": referencia,
          "Pago de la reserva": SIN_PAGO ? "Sin pago online (solicitud)" : "Pendiente: 25 € por Stripe",
          "Categoría": TITULOS[tipo].badge,
          "Motivo": motivo,
          "Nombre": nombre,
          "Teléfono": telefono,
          "email": email,
          "Información adicional": comentarios || "—"
        })
      });
      const respuesta = await res.json().catch(() => ({}));
      emailEnviado = res.ok && String(respuesta.success) !== "false";
      if (!emailEnviado) console.warn("FormSubmit:", respuesta.message || res.status);
    } catch (err) {
      console.warn("No se pudo enviar la reserva por email:", err);
    }

    try { sessionStorage.setItem("ginest_reserva", JSON.stringify(datos)); } catch (_) { /* modo privado: no pasa nada */ }

    if (!emailEnviado) {
      boton.disabled = false;
      errorBox.innerHTML =
        'No hemos podido enviar tu solicitud. Inténtalo de nuevo o llámanos al <a href="tel:+34629507929">629 50 79 29</a>.';
      return;
    }

    // Mientras no esté el enlace de Stripe: la reserva queda como solicitud
    if (SIN_PAGO) {
      boton.disabled = false;
      form.reset();
      errorBox.classList.add("ok");
      errorBox.textContent =
        "¡Hemos recibido tu solicitud! Te contactaremos en breve para confirmar tu cita.";
      return;
    }

    // Con Stripe: mensaje en la web + botón para pagar la reserva
    mostrarPasoPago({
      url: STRIPE_PAYMENT_LINK +
        (STRIPE_PAYMENT_LINK.includes("?") ? "&" : "?") +
        "prefilled_email=" + encodeURIComponent(email) +
        "&client_reference_id=" + encodeURIComponent(referencia),
      motivo,
      referencia
    });
  });

  // -----------------------------------------------------------
  // Paso de pago: sustituye el formulario por el aviso de pago
  // -----------------------------------------------------------
  function mostrarPasoPago({ url, motivo, referencia }) {
    const pago = document.getElementById("reserva-pago");
    if (!pago) { window.location.href = url; return; }

    document.getElementById("pago-motivo").textContent = motivo;
    document.getElementById("pago-referencia").textContent = referencia;
    document.getElementById("pago-boton").href = url;

    formWrap.classList.add("hidden");
    pago.classList.remove("hidden");
    pago.classList.add("visible");
    pago.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// -----------------------------------------------------------
// 4) Animación fade-up al hacer scroll (mismo patrón que ginecologia.js)
// -----------------------------------------------------------
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
