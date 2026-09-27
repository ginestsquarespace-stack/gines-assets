// Filtro de categorías
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Paginación
document.querySelectorAll('.pag-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.textContent === '→') return;
    document.querySelectorAll('.pag-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
