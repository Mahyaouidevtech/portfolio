/* ==========================================================================
   TUS PROYECTOS
   --------------------------------------------------------------------------
   Van en el orden en que los hiciste: el primero de la lista sale arriba.
   Para añadir uno nuevo: copia un bloque { ... }, pégalo al FINAL de la
   lista y rellena los campos.

   titulo       (obligatorio)  Nombre del proyecto.
   descripcion  (obligatorio)  Una o dos frases: qué es y qué problema resuelve.
   tecnologias  (obligatorio)  Lista de tecnologías: ["Angular", "Laravel"].
   fecha        (obligatorio)  Año o mes: "2026" o "Sep 2026".
   enlace       (opcional)     URL de la demo o web publicada. "" si no hay.
   repositorio  (opcional)     URL del repo en GitHub. "" si no hay.
   imagen       (opcional)     Captura del proyecto. Guárdala en
                               /images/proyectos/ (ideal 960×600). "" si no hay.

   No olvides la coma entre bloques: }, {
   ========================================================================== */

window.PROYECTOS = [
  {
    titulo: "Este portfolio",
    descripcion: "Diseñado en Framer, exportado a HTML estático y reorganizado a mano: CSS y JS separados, maquetación legible y una sección de proyectos propia.",
    tecnologias: ["Framer", "HTML", "CSS", "JavaScript"],
    fecha: "2026",
    enlace: "", // cuando publiques la web, pon aquí su dirección
    repositorio: "",
    imagen: "/images/proyectos/portfolio.jpg",
  },
  {
    titulo: "CineScope",
    descripcion: "Buscador de películas que consume la API de TMDB en tiempo real: búsqueda instantánea, resultados en tarjetas y ficha de detalle con sinopsis, valoración y géneros. Angular moderno con signals (zoneless).",
    tecnologias: ["Angular", "TypeScript", "Bootstrap", "API REST"],
    fecha: "Ago 2026",
    enlace: "https://cinescope-elias.netlify.app",
    repositorio: "https://github.com/Mahyaouidevtech",
    imagen: "/images/proyectos/cinescope.jpg",
  },
  {
    titulo: "Noticias automatizadas con IA",
    descripcion: "Flujo que rastrea fuentes oficiales y envía por email a cada usuario las noticias que le interesan. Entrevisté a los usuarios para definir sus palabras clave y construí la búsqueda, el filtrado y el envío.",
    tecnologias: ["n8n", "IA", "APIs"],
    fecha: "2026",
    enlace: "",
    repositorio: "",
    imagen: "/images/proyectos/noticias.jpg",
  },
  {
    titulo: "MisGastos",
    descripcion: "App full stack de gestión de gastos: registro e inicio de sesión, CRUD de gastos por categorías y un panel con los totales. En desarrollo.",
    tecnologias: ["Laravel", "PHP", "MySQL"],
    fecha: "2026",
    enlace: "",
    repositorio: "",
    imagen: "/images/proyectos/misgastos.jpg",
  },
];
