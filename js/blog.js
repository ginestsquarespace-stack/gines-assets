// Ejemplo simple para animar las tarjetas al aparecer
function iniciarBlog() {
  const cards = document.querySelectorAll(".blog-card");
  cards.forEach((card, i) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {
      card.style.transition =
        "opacity .6s ease, transform .6s ease";

      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, i * 200);

  });

}