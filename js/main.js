/* ==========================================================================
   Interacciones de la web
   1. Aparición al hacer scroll
   2. Foto arrastrable
   3. Tarjetas del stack: parallax suave y brillo bajo el ratón
   4. Botón magnético
   ========================================================================== */

const conRaton = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- 1. Aparición al hacer scroll ---------- */

// Cuando un elemento con [data-reveal] entra en pantalla, recibe la clase
// .is-visible (el CSS hace la animación). Se revela una vez y se olvida.
const observador = new IntersectionObserver((entradas) => {
  for (const entrada of entradas) {
    if (!entrada.isIntersecting) continue;
    entrada.target.classList.add("is-visible");
    observador.unobserve(entrada.target);
  }
}, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

// La uso también desde proyectos.js para las filas que se crean después.
function revelar(elementos) {
  elementos.forEach((el, i) => {
    el.style.setProperty("--i", i % 6); // escalonado entre hermanos
    observador.observe(el);
  });
}
window.revelar = revelar;

revelar(document.querySelectorAll("[data-reveal]"));

// Red de seguridad: si el observador no avisa (pestaña en segundo plano,
// capturas automáticas...), revela lo que ya está a la vista.
function revelarLoVisible() {
  for (const el of document.querySelectorAll("[data-reveal]:not(.is-visible), #proyectos:not(.is-visible)")) {
    const caja = el.getBoundingClientRect();
    if (caja.top < innerHeight * 0.9 && caja.bottom > 0) el.classList.add("is-visible");
  }
}
setTimeout(revelarLoVisible, 2500);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) revelarLoVisible();
});


/* ---------- 2. Foto arrastrable ---------- */

// Se puede arrastrar la foto; al soltarla vuelve a su sitio con un muelle.
const retrato = document.querySelector(".retrato");

if (retrato && !menosMovimiento) {
  let inicioX = 0, inicioY = 0, x = 0, y = 0, arrastrando = false;

  retrato.addEventListener("animationend", (e) => {
    if (e.target === retrato) retrato.style.animation = "none"; // libera el transform para poder moverla
  });

  retrato.addEventListener("pointerdown", (e) => {
    arrastrando = true;
    inicioX = e.clientX - x;
    inicioY = e.clientY - y;
    retrato.setPointerCapture(e.pointerId);
    retrato.classList.add("is-arrastrando");
    retrato.style.transition = "box-shadow 0.28s";
  });

  retrato.addEventListener("pointermove", (e) => {
    if (!arrastrando) return;
    x = e.clientX - inicioX;
    y = e.clientY - inicioY;
    const giro = Math.max(-8, Math.min(8, x / 25)); // se inclina según hacia dónde va
    retrato.style.transform = `translate(${x}px, ${y}px) rotate(${giro}deg)`;
  });

  const soltar = () => {
    if (!arrastrando) return;
    arrastrando = false;
    x = 0;
    y = 0;
    retrato.classList.remove("is-arrastrando");
    retrato.style.transition = "transform 0.9s cubic-bezier(0.34, 1.35, 0.5, 1), box-shadow 0.28s";
    retrato.style.transform = "";
  };
  retrato.addEventListener("pointerup", soltar);
  retrato.addEventListener("pointercancel", soltar);
}


/* ---------- 3. Tarjetas del stack ---------- */

const tarjetas = document.querySelectorAll(".tarjeta");

// Brillo que sigue al ratón: paso la posición al CSS como --x y --y
if (conRaton) {
  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("pointermove", (e) => {
      const caja = tarjeta.getBoundingClientRect();
      tarjeta.style.setProperty("--x", `${e.clientX - caja.left}px`);
      tarjeta.style.setProperty("--y", `${e.clientY - caja.top}px`);
    });
  });
}

if (!menosMovimiento && tarjetas.length) {
  // a) Entran por su lado al aparecer y se van al salir, cada vez
  //    (a diferencia de [data-reveal], que solo se anima una vez)
  const observadorTarjetas = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      entrada.target.classList.toggle("is-visible", entrada.intersectionRatio >= 0.35);
    }
  }, { threshold: [0, 0.35] });
  tarjetas.forEach((tarjeta) => observadorTarjetas.observe(tarjeta));

  // b) Ligado al scroll: mientras bajas, la azul sube y la clara baja,
  //    y las dos se hacen un poco más pequeñas y más opacas
  const stack = document.getElementById("stack");
  let pendiente = false;

  const moverTarjetas = () => {
    pendiente = false;
    const recorrido = innerHeight + 1330; // px de scroll que dura el efecto
    const progreso = Math.max(0, Math.min(1, (scrollY - stack.offsetTop + innerHeight) / recorrido));

    tarjetas.forEach((tarjeta) => {
      const sentido = Number(tarjeta.dataset.parallax) || 0; // -1 sube, 1 baja
      tarjeta.style.setProperty("--scroll-y", `${sentido * 18 * (1 - progreso)}px`);
      tarjeta.style.setProperty("--scroll-escala", 1.02 - 0.02 * progreso);
      tarjeta.style.setProperty("--scroll-opacidad", 0.5 + 0.5 * progreso);
    });
  };

  addEventListener("scroll", () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(moverTarjetas);
    }
  }, { passive: true });
  addEventListener("resize", moverTarjetas);
  moverTarjetas();
} else {
  tarjetas.forEach((tarjeta) => tarjeta.classList.add("is-visible"));
}


/* ---------- 4. Botón magnético ---------- */

// El botón se deja atraer un poco por el ratón (máximo 10px)
const boton = document.querySelector(".boton");

if (boton && conRaton && !menosMovimiento) {
  boton.addEventListener("pointermove", (e) => {
    const caja = boton.getBoundingClientRect();
    const dx = (e.clientX - (caja.left + caja.width / 2)) / (caja.width / 2);
    const dy = (e.clientY - (caja.top + caja.height / 2)) / (caja.height / 2);
    boton.style.transform = `translate(${dx * 10}px, ${dy * 6}px)`;
  });
  boton.addEventListener("pointerleave", () => {
    boton.style.transform = "";
  });
}
