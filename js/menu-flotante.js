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
        <a href="/reservar-cita?tipo=ginecologia"
           class="cita-modal-opcion"
           style="--img-fondo:linear-gradient(150deg, #cbb0d0 0%, #a87ca5 55%, #6b4568 100%);">
          <span class="cita-modal-opcion-icono">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"/>
            </svg>
          </span>
          <span class="cita-modal-opcion-texto">Ginecología</span>
        </a>

        <a href="/reservar-cita?tipo=estetica"
           class="cita-modal-opcion"
           style="--img-fondo:linear-gradient(150deg, #d8c9a3 0%, #d9af6c 55%, #a87f3e 100%);">
          <span class="cita-modal-opcion-icono">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a5 5 0 0 0-5 5c0 3 5 10 5 10s5-7 5-10a5 5 0 0 0-5-5Z"/>
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
