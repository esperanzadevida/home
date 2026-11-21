export type ChurchGalleryItem = {
  id: string;
  title: string;
  album: string;
  description: string;
  src: string;
  alt: string;
  year: string;
};

export const churchGalleryItems: ChurchGalleryItem[] = [
  {
    id: "culto-dominical",
    title: "Un domingo para compartir",
    album: "Encuentros",
    description: "Celebraciones y conversaciones alrededor de la fe, la música y la bienvenida.",
    src: "/images/esperanza-de-vida/culto-dominical.webp",
    alt: "La comunidad reunida mientras el pastor comparte una enseñanza.",
    year: "2026",
  },
  {
    id: "embajadores",
    title: "Conversaciones que fortalecen",
    album: "Juventud",
    description: "Jóvenes que hacen amistad, conversan y encuentran formas de servir juntos.",
    src: "/images/esperanza-de-vida/embajadores-jovenes.webp",
    alt: "Jóvenes conversan en una reunión de comunidad junto a una guitarra.",
    year: "2026",
  },
  {
    id: "exploradores",
    title: "Aprender creando",
    album: "Niñez",
    description: "Un espacio para descubrir historias, hacer preguntas y aprender jugando.",
    src: "/images/esperanza-de-vida/exploradores.webp",
    alt: "Una líder acompaña a niñas y niños mientras dibujan alrededor de una mesa.",
    year: "2026",
  },
  {
    id: "equipo-pastoral",
    title: "Escuchar también es acompañar",
    album: "Equipo pastoral",
    description: "Personas que sirven, escuchan y acompañan a la comunidad.",
    src: "/images/esperanza-de-vida/equipo-pastoral.webp",
    alt: "Dos integrantes del equipo pastoral conversan en un jardín.",
    year: "2026",
  },
  {
    id: "servicio-comunitario",
    title: "Servir con cercanía",
    album: "Servicio",
    description: "Jornadas y gestos cotidianos para cuidar a las personas del entorno.",
    src: "/images/esperanza-de-vida/servicio-comunitario.webp",
    alt: "Voluntarios organizan alimentos para una jornada de servicio comunitario.",
    year: "2026",
  },
];
