function inicializarCarrusel() {
  const track = document.getElementById('track');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.slide'));
  const puntosContenedor = document.getElementById('puntos');
  const carrusel = document.getElementById('carrusel');

  if (slides.length === 0) {
    console.warn("No hay slides en el carrusel");
    return;
  }

  let actual = 0;
  let intervalo;
  const DURACION = 4500;

  // Crear puntos
  slides.forEach((_, i) => {
    const punto = document.createElement('button');
    punto.classList.add('punto');
    if (i === 0) punto.classList.add('activo');
    punto.addEventListener('click', () => irASlide(i));
    puntosContenedor.appendChild(punto);
  });

  const puntos = Array.from(puntosContenedor.querySelectorAll('.punto'));

  function mostrarSlide(indice) {
    slides.forEach((s, i) => s.classList.toggle('activa', i === indice));
    puntos.forEach((p, i) => p.classList.toggle('activo', i === indice));
    actual = indice;
  }

  function siguiente() {
    mostrarSlide((actual + 1) % slides.length);
    console.log("Slide actual:", actual); // debug
  }

  function irASlide(i) {
    mostrarSlide(i);
    reiniciarIntervalo();
  }

  function reiniciarIntervalo() {
    clearInterval(intervalo);
    intervalo = setInterval(siguiente, DURACION);
  }

  // 🔑 Mostrar la primera slide y arrancar autoplay
  mostrarSlide(0);
  reiniciarIntervalo();

  carrusel.addEventListener('mouseenter', () => clearInterval(intervalo));
  carrusel.addEventListener('mouseleave', reiniciarIntervalo);
}
