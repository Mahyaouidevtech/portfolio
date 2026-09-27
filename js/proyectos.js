/* ==========================================================================
   Sección "Proyectos"
   Pinta la lista a partir de window.PROYECTOS (js/proyectos-data.js).
   No hace falta tocar este archivo para añadir proyectos.
   ========================================================================== */

(() => {
  const lista = document.getElementById("proyectos-lista");
  const contador = document.getElementById("proyectos-contador");
  const seccion = document.getElementById("proyectos");
  if (!lista) return;

  const proyectos = window.PROYECTOS || [];
  const dosCifras = (n) => String(n).padStart(2, "0");

  // Crea un elemento: el("p", { class: "x" }, "texto")
  function el(etiqueta, atributos = {}, ...hijos) {
    const nodo = document.createElement(etiqueta);
    for (const [clave, valor] of Object.entries(atributos)) {
      if (valor !== undefined && valor !== "") nodo.setAttribute(clave, valor);
    }
    nodo.append(...hijos.filter(Boolean));
    return nodo;
  }

  function crearFila(proyecto, i) {
    const tieneEnlace = Boolean(proyecto.enlace);
    const nuevaPestana = { target: "_blank", rel: "noopener" };

    const titulo = tieneEnlace
      ? el("a", { class: "proyecto__enlace", href: proyecto.enlace, ...nuevaPestana }, proyecto.titulo)
      : proyecto.titulo;

    const etiquetas = el("ul", { class: "proyecto__tags" },
      ...(proyecto.tecnologias || []).map((t) => el("li", {}, t)));

    const repo = proyecto.repositorio
      ? el("a", { class: "proyecto__repo", href: proyecto.repositorio, ...nuevaPestana }, "Código")
      : null;

    const flecha = tieneEnlace
      ? el("span", { class: "proyecto__flecha", "aria-hidden": "true" }, el("span", { class: "icono icono--flecha" }))
      : null;

    return el("li", {
        class: "proyecto" + (tieneEnlace ? " proyecto--enlace" : ""),
        "data-reveal": "",
        "data-imagen": proyecto.imagen,
      },
      el("span", { class: "proyecto__num" }, dosCifras(i + 1)),
      el("h3", { class: "proyecto__titulo" }, titulo),
      el("div", { class: "proyecto__info" },
        el("p", { class: "proyecto__desc" }, proyecto.descripcion),
        etiquetas),
      el("div", { class: "proyecto__meta" },
        el("span", { class: "proyecto__fecha" }, proyecto.fecha),
        el("div", { class: "proyecto__acciones" }, repo, flecha))
    );
  }

  // Última fila: el hueco del siguiente proyecto
  function crearFilaProxima(numero) {
    return el("li", { class: "proyecto proyecto--proximo", "data-reveal": "" },
      el("span", { class: "proyecto__num" }, dosCifras(numero)),
      el("h3", { class: "proyecto__titulo" }, "Siguiente proyecto"),
      el("div", { class: "proyecto__info" },
        el("p", { class: "proyecto__estado" }, el("span", { class: "proyecto__punto" }), "En construcción")),
      el("div")
    );
  }

  lista.append(...proyectos.map(crearFila), crearFilaProxima(proyectos.length + 1));
  contador.textContent = `${dosCifras(proyectos.length)} / ${dosCifras(proyectos.length)}`;

  // Animaciones de entrada (función de main.js)
  if (window.revelar) {
    window.revelar(lista.querySelectorAll("[data-reveal]"));
    window.revelar([seccion]);
  }


  /* ---------- Imagen que sigue al cursor ---------- */

  const conRaton = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!conRaton || menosMovimiento) return;

  const preview = el("div", { class: "proyectos-preview", "aria-hidden": "true" }, el("img", { alt: "" }));
  const imagen = preview.querySelector("img");
  document.body.append(preview);

  let ratonX = 0, ratonY = 0, x = 0, y = 0, animando = false;

  // La imagen persigue al ratón con retraso (interpolación): da sensación de peso
  function seguir() {
    x += (ratonX - x) * 0.14;
    y += (ratonY - y) * 0.14;
    const inclinacion = Math.max(-6, Math.min(6, (ratonX - x) * 0.08));
    preview.style.transform = `translate(${x + 24}px, ${y - 100}px) rotate(${inclinacion}deg)`;
    if (preview.classList.contains("is-activa") || Math.abs(ratonX - x) > 0.5) {
      requestAnimationFrame(seguir);
    } else {
      animando = false;
    }
  }

  lista.addEventListener("pointermove", (e) => {
    ratonX = e.clientX;
    ratonY = e.clientY;
    if (!animando) {
      animando = true;
      requestAnimationFrame(seguir);
    }
  });

  lista.querySelectorAll(".proyecto[data-imagen]").forEach((fila) => {
    fila.addEventListener("pointerenter", (e) => {
      if (!preview.classList.contains("is-activa")) {
        x = ratonX = e.clientX; // aparece donde está el ratón, sin viajar desde (0,0)
        y = ratonY = e.clientY;
      }
      imagen.src = fila.dataset.imagen;
      preview.classList.add("is-activa");
    });
    fila.addEventListener("pointerleave", () => preview.classList.remove("is-activa"));
  });
})();
