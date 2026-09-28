/**
 * menu-flotante.js
 * Ruta: js/menu-flotante.js
 *
 * - Ya NO crea ningún botón flotante visible en pantalla.
 * - Crea el popup (modal centrado) y lo deja listo para que cualquier
 *   elemento con el atributo data-abrir-cita lo abra al hacer click
 *   (por ejemplo, el enlace "Cambiar categoría de consulta" de
 *   cita-extended.html).
 *
 * Autocontenido: no necesita ningún <div> extra en el HTML de cada
 * página. Solo incluye este script (y su CSS) una vez por página.
 */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------
  // 1) Crear el popup (modal centrado)
  // -----------------------------------------------------------
  const overlay = document.createElement('div');
  overlay.id = 'cita-modal-overlay';
  overlay.className = 'cita-modal-overlay hidden';
  overlay.innerHTML = `
    <div class="cita-modal" role="dialog" aria-modal="true">
      <button id="cita-modal-cerrar" class="cita-modal-cerrar" aria-label="Cerrar">&times;</button>

      <div class="cita-modal-opciones">
        <!--
          👉 Para poner una foto real de fondo en cada opción, sustituye
          el gradiente de --img-fondo por tu imagen, por ejemplo:
          style="--img-fondo:url('img/ginecologia-fondo.jpg')"
        -->
        <a href="/cita-extended?tipo=ginecologia"
           class="cita-modal-opcion"
           style="--img-fondo:linear-gradient(150deg, #cbb0d0 0%, #a87ca5 55%, #6b4568 100%);">
          <span class="cita-modal-opcion-icono">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20c-2.8-1.8-4.3-4.6-4.3-7.6S9.3 6.6 12 4.2c2.7 2.4 4.3 5.2 4.3 8.2s-1.5 5.8-4.3 7.6Z"/>
              <path d="M12 20c-4.2 0-8.1-2.6-9.7-7.2 2.4-.6 4.9 0 6.9 1.6"/>
              <path d="M12 20c4.2 0 8.1-2.6 9.7-7.2-2.4-.6-4.9 0-6.9 1.6"/>
            </svg>
          </span>
          <span class="cita-modal-opcion-texto">Ginecología</span>
        </a>

        <a href="/cita-extended?tipo=estetica"
           class="cita-modal-opcion"
           style="--img-fondo:linear-gradient(150deg, #d8c9a3 0%, #d9af6c 55%, #a87f3e 100%);">
          <span class="cita-modal-opcion-icono">
            <svg viewBox="0 0 25 32" fill="currentColor">
              <path d="M23.92,17.774c1.42-3.653,1.896-7.274-1.415-9.918c-3.477-2.777-5.737-4.801-6.888-6.17c-0.053-0.074-0.108-0.136-0.163-0.205c-0.074-0.093-0.159-0.193-0.222-0.279c-0.007-0.01-0.02-0.014-0.028-0.023c-0.329-0.359-0.669-0.626-0.994-0.765c-0.646-0.274-1.274-0.413-1.866-0.413c-1.779,0-3.032,1.2-4.12,2.497c-0.946,1.126-3.162,3.01-4.78,4.383c-0.853,0.724-1.59,1.352-1.962,1.713c-1.647,1.599-2.741,5.179,1.407,13.127c0.002,0.005,0.008,0.007,0.01,0.011c0.309,0.639,4.935,10.072,9.086,10.262C12.071,31.998,12.157,32,12.243,32c4.327,0,7.329-5.009,9.47-9.405l0.271-0.555c0.671-1.372,1.362-2.795,1.916-4.214C23.909,17.808,23.914,17.792,23.92,17.774z M21.882,8.637c2.541,2.029,2.471,4.787,1.479,7.764c-1.326-1.997-3.902-3.945-4.03-4.04c-0.22-0.164-0.533-0.121-0.7,0.1c-0.165,0.221-0.12,0.534,0.101,0.7c0.033,0.025,3.248,2.453,4.178,4.463c-0.353,0.881-0.761,1.774-1.19,2.668c-0.791-1.117-2.317-2.806-4.168-4.389c-0.016-0.014-0.03-0.03-0.049-0.042c-1.223-1.041-2.585-2.032-3.969-2.779c3.336-2.412,3.656-5.524,3.53-7.231c-0.04-0.532-0.138-1.038-0.263-1.524C18.07,5.509,19.755,6.939,21.882,8.637z M2.179,9.307C2.526,8.968,3.251,8.353,4.09,7.641c1.737-1.475,3.899-3.31,4.899-4.501C9.922,2.028,10.974,1,12.344,1c0.463,0,0.945,0.109,1.476,0.334c0.132,0.056,0.277,0.166,0.425,0.298c-0.072,0.192-0.144,0.378-0.218,0.587C13.396,4,12.613,6.214,9.472,7.882c-3.06,1.625-5.165,5.471-5.253,5.634c-0.132,0.243-0.041,0.546,0.201,0.678c0.242,0.128,0.547,0.042,0.678-0.202c0.021-0.037,2.048-3.742,4.843-5.227c3.485-1.85,4.378-4.371,5.029-6.211c0.002-0.005,0.003-0.01,0.005-0.015c0.529,0.847,0.992,2.042,1.092,3.386c0.146,1.951-0.394,4.712-3.784,6.791c-5.518,3.382-7.977,6.354-8.913,7.734C0.672,15.014,0.258,11.17,2.179,9.307z M20.814,22.157c-2.049,4.208-4.888,9.049-8.784,8.838c-2.916-0.133-6.75-6.693-8.131-9.498c0.337-0.574,1.493-2.305,4.188-4.566c0.258-0.086,1.091-0.317,1.752,0.013c0.072,0.036,0.148,0.053,0.224,0.053c0.183,0,0.359-0.101,0.447-0.276c0.123-0.247,0.023-0.547-0.224-0.671c-0.26-0.13-0.529-0.198-0.793-0.236c0.892-0.671,1.913-1.374,3.078-2.098c1.079,0.529,2.138,1.218,3.13,1.975c-0.69,0.104-1.027,0.385-1.081,0.434c-0.2,0.181-0.215,0.483-0.04,0.689c0.097,0.115,0.238,0.174,0.38,0.174c0.112,0,0.226-0.037,0.318-0.11c0.005-0.004,0.512-0.379,1.714-0.139c2.123,1.837,3.74,3.771,4.217,4.604c-0.042,0.085-0.083,0.171-0.125,0.256L20.814,22.157z"/>
              <path d="M13.733,24.252c-0.469,0-0.847,0.123-1.078,0.222c-0.34-0.122-0.686-0.184-1.028-0.184c-1.386,0-2.264,1.004-2.301,1.046c-0.16,0.188-0.16,0.465,0.001,0.652c1.012,1.174,2.115,1.769,3.28,1.769c1.966,0,3.322-1.716,3.379-1.789c0.15-0.193,0.139-0.467-0.027-0.646C15.141,24.438,14.297,24.252,13.733,24.252z M12.607,26.758c-0.742,0-1.476-0.356-2.186-1.059c0.418-0.297,1.245-0.577,2.056-0.22c0.146,0.065,0.323,0.052,0.463-0.031c0.003-0.002,0.332-0.196,0.793-0.196c0.402,0,0.79,0.146,1.154,0.435C14.458,26.102,13.618,26.758,12.607,26.758z"/>
            </svg>
          </span>
          <span class="cita-modal-opcion-texto">Estética</span>
        </a>
      </div>
    </div>
  `;
  (document.querySelector('.sq-app')||document.body).appendChild(overlay);

  // -----------------------------------------------------------
  // 2) Abrir / cerrar
  // -----------------------------------------------------------
  function abrirModal() {
    overlay.classList.remove('hidden');
    document.body.classList.add('cita-modal-abierto');
  }
  // Para poder abrirlo desde otros scripts (p. ej. cita-extended.js sin ?tipo=)
  window.abrirModalCita = abrirModal;

  function cerrarModal() {
    overlay.classList.add('hidden');
    document.body.classList.remove('cita-modal-abierto');
  }

  // Cualquier elemento con data-abrir-cita abre el popup
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-abrir-cita]');
    if (trigger) {
      e.preventDefault();
      abrirModal();
    }
  });

  document.getElementById('cita-modal-cerrar').addEventListener('click', cerrarModal);

  // Cerrar al hacer click fuera de la tarjeta
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });
});

// -----------------------------------------------------------
// 3) Emails con asunto según la página
//    - Página de Ginecología (o formulario ?tipo=ginecologia) -> "Cita de Ginecología"
//    - Página de Estética   (o formulario ?tipo=estetica)     -> "Cita de Estética"
//    - Cualquier otra página                                  -> "Consulta"
//    Funciona también con los enlaces que se cargan después (navbar, footer, ubicación).
// -----------------------------------------------------------
function asuntoEmailSegunPagina() {
  const ruta = decodeURIComponent(window.location.pathname).toLowerCase();
  const tipo = new URLSearchParams(window.location.search).get('tipo');
  if (tipo === 'ginecologia' || ruta.includes('ginecologia')) return 'Cita de Ginecología';
  if (tipo === 'estetica' || ruta.includes('estetica')) return 'Cita de Estética';
  return 'Consulta';
}

document.addEventListener('click', (e) => {
  const enlace = e.target.closest('a[href^="mailto:"]');
  if (!enlace) return;
  const email = enlace.getAttribute('href').slice(7).split('?')[0];
  enlace.setAttribute('href', 'mailto:' + email + '?subject=' + encodeURIComponent(asuntoEmailSegunPagina()));
});
