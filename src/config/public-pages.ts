import { churchProfile } from "@/config/church-profile";
import { fundamentalTruths } from "@/config/fundamental-truths";
import { churchGalleryItems } from "@/config/gallery";

export const publicNavigation = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/sermones", label: "Sermones" },
  { href: "/eventos", label: "Eventos" },
  { href: "/ministerios", label: "Ministerios" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const moreNavigation = [
  { href: "/blog", label: "Blog" },
  { href: "/tienda", label: "Recursos" },
  { href: "/galeria", label: "Galería" },
  { href: "/donaciones", label: "Generosidad" },
  { href: "/oracion", label: "Oración" },
  { href: "/en-vivo", label: "En vivo" },
] as const;

const discoverNavigationHrefs = new Set(["/blog", "/tienda", "/galeria"]);

export const desktopMegaMenuSections = [
  {
    label: "Descubre",
    items: moreNavigation.filter((item) => discoverNavigationHrefs.has(item.href)),
  },
  {
    label: "Participa",
    items: moreNavigation.filter((item) => !discoverNavigationHrefs.has(item.href)),
  },
] as const;

const mobilePrimaryHrefs = new Set(["/", "/servicios", "/eventos", "/en-vivo"]);
const mobileNavigationItems = [
  { href: "/", label: "Inicio" },
  ...publicNavigation,
  ...moreNavigation,
];

export const mobilePrimaryNavigation = mobileNavigationItems.filter((item) =>
  mobilePrimaryHrefs.has(item.href),
);

export const mobileMoreSections = [
  {
    label: "Explorar",
    items: publicNavigation.filter((item) => !mobilePrimaryHrefs.has(item.href)),
  },
  {
    label: "Comunidad",
    items: moreNavigation.filter((item) => !mobilePrimaryHrefs.has(item.href)),
  },
];

export type PublicPageCard = {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
  href?: string;
  actionLabel?: string;
  icon?: "location" | "phone" | "email" | "instagram" | "facebook" | "youtube";
  visual?: "gathering" | "generations" | "service";
  filterValues?: Record<string, string>;
  sortDate?: string;
  sortPrice?: number;
  sortWeight?: number;
  featured?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  calendarDate?: string;
  calendarCategory?: string;
  meeting?: string;
  leader?: string;
};

export type PublicPageSection = {
  eyebrow?: string;
  title: string;
  intro?: string;
  explorer?: "sermons" | "events" | "blog" | "shop" | "ministries";
  presentation?: "numbered-list" | "contact-methods" | "social-profiles" | "callout" | "image-gallery";
  source?: { label: string; href: string; note?: string };
  cards: PublicPageCard[];
};

export type PublicPageBlueprint = {
  title: string;
  eyebrow: string;
  intro: string;
  action?: { label: string; href: string };
  closingCta?: boolean;
  compactHero?: boolean;
  compactSections?: boolean;
  heroNote?: { eyebrow: string; title: string; description: string };
  faq?: { question: string; answer: string }[];
  sections: PublicPageSection[];
};

export const publicPageBlueprints = {
  nosotros: {
    title: "Una comunidad para caminar juntos",
    eyebrow: "Conócenos · Ambato",
    intro:
      `Somos ${churchProfile.name}, una familia de fe que aprende de Jesús, sirve a la ciudad y acompaña a las personas en cada etapa de la vida.`,
    action: { label: "Conoce nuestros encuentros", href: "/servicios" },
    sections: [
      {
        eyebrow: "Nuestra historia",
        title: "Una casa que creció alrededor de una mesa",
        intro:
          `En ${churchProfile.founded}, doce familias comenzaron a reunirse en Ambato para compartir la fe y apoyarse mutuamente. Con el tiempo, aquel encuentro cercano se convirtió en una comunidad abierta a nuevas generaciones.`,
        cards: [
          {
            title: "Una fe cotidiana",
            description:
              "Creemos que seguir a Jesús se expresa en la forma de tratar, escuchar y servir a quienes nos rodean.",
            meta: "Nuestra manera de vivir",
          },
          {
            title: "Un lugar para crecer",
            description:
              "Niños, jóvenes y familias encuentran espacios para aprender, hacer amistades y descubrir sus dones.",
            meta: "Todas las generaciones",
          },
          {
            title: "Una iglesia que sirve",
            description:
              "Queremos que la esperanza que compartimos también se convierta en gestos concretos de cuidado en Ambato.",
            meta: "Fe puesta en acción",
          },
        ],
      },
      {
        eyebrow: "Lo que nos guía",
        title: "Fe, comunidad y servicio",
        intro:
          "Nuestra vida como iglesia se construye en lo sencillo: escuchar la Palabra, orar, compartir la mesa y acompañarnos con generosidad.",
        cards: [
          {
            title: "Nuestra misión",
            description:
              "Compartir el amor de Jesús y ayudar a cada persona a crecer en una fe cercana, práctica y llena de esperanza.",
          },
          {
            title: "Nuestra visión",
            description:
              "Ser una comunidad donde cada generación encuentre pertenencia y una oportunidad para servir a los demás.",
          },
          {
            title: "Nuestros valores",
            description:
              "Fe, hospitalidad, servicio y crecimiento compartido orientan la forma en que vivimos como comunidad.",
          },
        ],
      },
      {
        eyebrow: "Equipo pastoral",
        title: "Personas que acompañan a la comunidad",
        intro:
          "El equipo pastoral sirve junto a los ministerios y acompaña a las personas en su vida de fe.",
        cards: [
          {
            eyebrow: "Pastor principal",
            title: churchProfile.leadPastor,
            description:
              "Acompaña la enseñanza bíblica, la vida comunitaria y la formación de nuevos equipos de servicio.",
            meta: "Enseñanza · Comunidad",
            imageSrc: "/images/esperanza-de-vida/samuel-andrade.webp",
            imageAlt: "Retrato del pastor Samuel Andrade en un espacio comunitario.",
          },
          {
            eyebrow: "Pastora de familias",
            title: "María Fernanda López",
            description:
              "Coordina espacios de acompañamiento para familias y ministerios de niñez en cada etapa.",
            meta: "Familias · Exploradores",
            imageSrc: "/images/esperanza-de-vida/maria-fernanda-lopez.webp",
            imageAlt: "Retrato de la pastora María Fernanda López en un espacio comunitario.",
          },
          {
            eyebrow: "Pastor de jóvenes y música",
            title: "David Mena",
            description:
              "Apoya a Embajadores y al equipo de adoración para que más personas puedan aportar sus dones.",
            meta: "Embajadores · Adoración",
            imageSrc: "/images/esperanza-de-vida/david-mena.webp",
            imageAlt: "Retrato del pastor de jóvenes David Mena.",
          },
        ],
      },
      {
        eyebrow: "Nuestra historia",
        title: "Una comunidad que sigue creciendo",
        intro:
          `Desde el primer encuentro hasta hoy, la historia de ${churchProfile.shortName} se ha escrito con personas que comparten fe y servicio.`,
        cards: [
          {
            eyebrow: "2014",
            title: "Un primer encuentro",
            description:
              "Doce familias comienzan a reunirse en Ambato para compartir la fe y apoyarse mutuamente.",
            meta: "Los primeros pasos",
          },
          {
            eyebrow: "2017",
            title: "Un espacio para nuevas generaciones",
            description:
              "La comunidad abre espacios para que niños, jóvenes y familias aprendan y participen juntos.",
            meta: "Niñez · Juventud · Familias",
          },
          {
            eyebrow: "2021",
            title: "Acompañarnos de nuevas maneras",
            description:
              "Los grupos de oración y conversación ayudan a mantener cercanía y cuidado en temporadas de cambio.",
            meta: "Oración · Comunidad",
          },
          {
            eyebrow: "2024",
            title: "Servir cerca de casa",
            description:
              "Los equipos fortalecen las jornadas de servicio y las oportunidades de colaboración en el sector Ficoa.",
            meta: "Servicio · Ambato",
          },
        ],
      },
      {
        eyebrow: "Declaración de fe",
        title: "Dieciséis verdades fundamentales",
        presentation: "numbered-list",
        intro:
          "Estos resúmenes presentan convicciones centrales de la tradición pentecostal de las Asambleas de Dios y sus referencias bíblicas.",
        source: {
          label: "Consultar la declaración completa de verdades fundamentales",
          href: "https://ag.org/es-ES/beliefs/Statement-of-Fundamental-Truths",
          note:
            "Referencia doctrinal publicada por Assemblies of God (EE. UU.). Los títulos siguen esa declaración; los resúmenes son editoriales.",
        },
        cards: [...fundamentalTruths],
      },
    ],
  },
  servicios: {
    title: "Hay un lugar para ti",
    eyebrow: "Planifica tu visita",
    intro:
      "Nos reunimos durante la semana para celebrar, aprender y acompañarnos. Elige el encuentro que mejor se adapte a tu ritmo.",
    heroNote: {
      eyebrow: "Tu primera visita",
      title: "Ven con calma",
      description:
        "No necesitas inscribirte; el equipo de bienvenida puede orientarte al llegar.",
    },
    faq: [
      {
        question: "¿Qué ocurre en una primera visita?",
        answer:
          "El equipo de bienvenida puede orientarte al llegar, contarte cómo se desarrolla el encuentro y señalarte los espacios para niños.",
      },
      {
        question: "¿Debo inscribirme antes de asistir?",
        answer:
          "No. Puedes llegar directamente a cualquiera de los encuentros semanales y participar a tu manera.",
      },
      {
        question: "¿Hay actividades para niños?",
        answer:
          "Durante las reuniones del domingo hay espacios para niños. Al llegar, el equipo de bienvenida te indicará dónde encontrarlos.",
      },
      {
        question: "¿Cómo debo vestirme?",
        answer:
          "No hay un código de vestimenta. Ven con ropa cómoda para ti.",
      },
    ],
    action: { label: "Ver ubicación y contacto", href: "/contacto" },
    sections: [
      {
        eyebrow: "Encuentros semanales",
        title: "Ven como eres; te recibiremos con gusto",
        intro:
          "Cada reunión tiene su propio ritmo, pero todas comparten el mismo deseo: hacer espacio para la fe y para las personas.",
        cards: [
          {
            eyebrow: "Domingos",
            title: "09:00 · 11:30",
            description:
              "Celebración, música y enseñanza para comenzar el día en comunidad. Hay espacios para niños durante las reuniones.",
            meta: "Celebración y enseñanza",
          },
          {
            eyebrow: "Miércoles",
            title: "19:30",
            description:
              "Una pausa a mitad de semana para orar, conversar y volver a lo esencial de la Palabra.",
            meta: "Oración y Palabra",
          },
          {
            eyebrow: "Viernes",
            title: "19:30",
            description:
              "Una noche para hacer amistades, conversar sobre la vida y crecer juntos en la fe.",
            meta: "Embajadores · Jóvenes",
          },
        ],
      },
      {
        eyebrow: "Tu primera visita",
        title: "No necesitas preparar nada",
        intro:
          "Puedes venir solo, con amigos o en familia. Nuestro equipo de bienvenida estará cerca para orientarte y ayudarte a encontrar tu espacio.",
        cards: [
          {
            title: "Al llegar",
            description:
              "Acércate al equipo de bienvenida en la entrada. Te indicaremos dónde reunirte y qué actividades hay para niños.",
            meta: "Bienvenida sencilla",
          },
          {
            title: "Durante el encuentro",
            description:
              "La música y la enseñanza son parte de la reunión. Puedes participar a tu manera; no hay un código de vestimenta.",
            meta: "Ven con confianza",
          },
        ],
      },
    ],
  },
  sermones: {
    title: "Palabras para llevar a la vida",
    eyebrow: "Mensajes · Fe cotidiana",
    intro:
      "Reflexiones sobre esperanza, propósito y vida en comunidad. Tómate un momento, escucha y encuentra una idea para llevar contigo.",
    action: { label: "Conoce nuestros servicios", href: "/servicios" },
    sections: [
      {
        eyebrow: "Serie · Una fe que permanece",
        title: "Mensajes recientes",
        explorer: "sermons",
        intro:
          "Una selección de temas compartidos en nuestros encuentros para seguir conversando durante la semana.",
        cards: [
          {
            eyebrow: "15 nov 2026 · Salmo 126:5–6",
            title: "Cuando la esperanza vuelve a florecer",
            description:
              "Una reflexión sobre seguir sembrando con confianza, incluso cuando todavía no vemos el fruto.",
            meta: "Esperanza · Vida diaria",
            href: "/sermones/cuando-la-esperanza-vuelve-a-florecer",
            filterValues: {
              serie: "Una fe que permanece",
              pastor: churchProfile.leadPastor,
              fecha: "15 nov 2026",
              etiqueta: "Esperanza",
            },
            sortDate: "2026-11-15",
          },
          {
            eyebrow: "8 nov 2026 · Lucas 14:15–24",
            title: "Una mesa con espacio para todos",
            description:
              "La invitación a construir una comunidad que recibe, escucha y comparte con generosidad.",
            meta: "Comunidad · Servicio",
            href: "/sermones/una-mesa-con-espacio-para-todos",
            filterValues: {
              serie: "Una fe que permanece",
              pastor: churchProfile.leadPastor,
              fecha: "8 nov 2026",
              etiqueta: "Comunidad",
            },
            sortDate: "2026-11-08",
          },
          {
            eyebrow: "1 nov 2026 · Isaías 40:28–31",
            title: "Fuerza para volver a comenzar",
            description:
              "Una mirada a la paciencia, el descanso y la fuerza que encontramos al caminar acompañados.",
            meta: "Ánimo · Confianza",
            href: "/sermones/fuerza-para-volver-a-comenzar",
            filterValues: {
              serie: "Una fe que permanece",
              pastor: churchProfile.leadPastor,
              fecha: "1 nov 2026",
              etiqueta: "Confianza",
            },
            sortDate: "2026-11-01",
          },
          {
            eyebrow: "25 oct 2026 · Santiago 1:2–4",
            title: "La paciencia también nos hace crecer",
            description:
              "Una invitación a atravesar los procesos con perseverancia y dejar que la comunidad nos acompañe.",
            meta: "Paciencia · Crecimiento",
            href: "/sermones/la-paciencia-tambien-nos-hace-crecer",
            filterValues: {
              serie: "Una fe que permanece",
              pastor: churchProfile.leadPastor,
              fecha: "25 oct 2026",
              etiqueta: "Paciencia",
            },
            sortDate: "2026-10-25",
          },
          {
            eyebrow: "18 oct 2026 · Mateo 11:28–30",
            title: "Un lugar para descansar",
            description:
              "Una reflexión sobre reconocer el cansancio, recibir compañía y recuperar un ritmo posible.",
            meta: "Descanso · Cuidado",
            href: "/sermones/un-lugar-para-descansar",
            filterValues: {
              serie: "Una fe que permanece",
              pastor: churchProfile.leadPastor,
              fecha: "18 oct 2026",
              etiqueta: "Cuidado",
            },
            sortDate: "2026-10-18",
          },
          {
            eyebrow: "11 oct 2026 · 2 Corintios 9:6–8",
            title: "La alegría de compartir",
            description:
              "La generosidad cotidiana se vuelve una forma de cuidar a las personas y sostener proyectos comunes.",
            meta: "Generosidad · Servicio",
            href: "/sermones/la-alegria-de-compartir",
            filterValues: {
              serie: "Una fe que permanece",
              pastor: churchProfile.leadPastor,
              fecha: "11 oct 2026",
              etiqueta: "Generosidad",
            },
            sortDate: "2026-10-11",
          },
        ],
      },
      {
        eyebrow: "Para conversar",
        title: "La reflexión continúa en comunidad",
        intro:
          "Los mensajes también son una invitación a escuchar otras experiencias y descubrir juntos cómo vivir la fe en lo cotidiano.",
        cards: [
          {
            title: "Escucha sin prisa",
            description:
              "Elige una idea del mensaje y piensa cómo se conecta con lo que estás viviendo hoy.",
          },
          {
            title: "Compártela con alguien",
            description:
              "Una conversación sencilla puede abrir espacio para el ánimo, la compañía y nuevas preguntas.",
          },
        ],
      },
    ],
  },
  eventos: {
    title: "La vida se comparte en comunidad",
    eyebrow: "Agenda · Encuentros",
    intro:
      "Además de nuestras reuniones semanales, buscamos momentos para encontrarnos, servir y celebrar juntos durante el año.",
    action: { label: "Ver horarios semanales", href: "/servicios" },
    sections: [
      {
        eyebrow: "Próximos encuentros",
        title: "Aparta un momento para compartir",
        explorer: "events",
        intro:
          "Estos encuentros forman parte de nuestra agenda comunitaria. Para conocer cambios de horario, consulta los canales de la iglesia.",
        cards: [
          {
            eyebrow: "Domingo · 22 nov 2026 · 09:00 y 11:30",
            title: "Domingo de bienvenida",
            description:
              "Un encuentro para conocernos, compartir la música y dar la bienvenida a quienes nos visitan por primera vez.",
            meta: "Reunión abierta",
            href: "/eventos/domingo-de-bienvenida",
            calendarDate: "2026-11-22",
            calendarCategory: "Comunidad",
          },
          {
            eyebrow: "Domingo · 6 dic 2026 · 15:00",
            title: "Una tarde para servir",
            description:
              "Familias y jóvenes se reúnen para preparar una jornada de acompañamiento y servicio en el barrio.",
            meta: "Comunidad · Servicio",
            href: "/eventos/una-tarde-para-servir",
            calendarDate: "2026-12-06",
            calendarCategory: "Servicio",
          },
          {
            eyebrow: "Domingo · 20 dic 2026 · 17:00",
            title: "Navidad en comunidad",
            description:
              "Una tarde de música, historias y mesa compartida para celebrar la esperanza de la Navidad.",
            meta: "Celebración familiar",
            href: "/eventos/navidad-en-comunidad",
            calendarDate: "2026-12-20",
            calendarCategory: "Celebración",
          },
        ],
      },
      {
        eyebrow: "Cada semana",
        title: "También puedes encontrarnos en nuestros servicios",
        cards: [
          {
            title: "Domingos",
            description: "Celebración y enseñanza a las 09:00 y 11:30.",
            meta: "Dos horarios",
          },
          {
            title: "Miércoles y viernes",
            description:
              "Oración y Palabra el miércoles; encuentro de jóvenes el viernes, ambos a las 19:30.",
            meta: "Entre semana",
          },
        ],
      },
    ],
  },
  ministerios: {
    title: "Hay muchas formas de pertenecer",
    eyebrow: "Ministerios · Cada generación",
    intro:
      "La comunidad crece cuando cada persona encuentra un lugar donde aprender, compartir sus dones y acompañar a los demás.",
    action: { label: "Escríbenos", href: "/contacto" },
    sections: [
      {
        eyebrow: "Encuentra tu espacio",
        title: "Caminamos juntos en cada etapa",
        explorer: "ministries",
        intro:
          "Nuestros equipos se reúnen alrededor de la fe, la amistad y el servicio. Pregunta en tu próxima visita para conocer sus actividades.",
        cards: [
          {
            eyebrow: "Niñez",
            title: "Exploradores",
            description:
              "Un espacio para descubrir historias de fe, hacer preguntas y aprender jugando en un ambiente cercano.",
            meta: "Aprender · Crear · Compartir",
            meeting: "Domingos · 09:00 y 11:30",
            leader: "María Fernanda López",
            imageSrc: "/images/esperanza-de-vida/exploradores.webp",
            imageAlt: "Una líder acompaña a niñas y niños en una actividad creativa de Exploradores.",
          },
          {
            eyebrow: "Juventud",
            title: "Embajadores",
            description:
              "Jóvenes que construyen amistades, conversan sobre su vida y buscan servir con propósito.",
            meta: "Viernes · 19:30",
            meeting: "Viernes · 19:30",
            leader: "David Mena",
            imageSrc: "/images/esperanza-de-vida/embajadores-jovenes.webp",
            imageAlt: "Jóvenes conversan en una reunión del ministerio Embajadores.",
          },
          {
            eyebrow: "Música",
            title: "Adoración",
            description:
              "Voces y músicos que acompañan a la iglesia en tiempos de alabanza, escucha y reflexión.",
            meta: "Música · Servicio",
            meeting: "Ensayo: jueves · 19:00. Servicio: domingos.",
            leader: "David Mena",
            imageSrc: "/images/esperanza-de-vida/culto-dominical.webp",
            imageAlt: "La comunidad se reúne para un culto dominical con enseñanza y música.",
          },
          {
            eyebrow: "Acompañamiento",
            title: "Oración",
            description:
              "Personas que reservan un tiempo para orar, escuchar y sostenerse mutuamente.",
            meta: "Fe · Cuidado",
            meeting: "Miércoles · 19:30",
            leader: "Samuel Andrade",
            imageSrc: "/images/esperanza-de-vida/equipo-pastoral.webp",
            imageAlt: "El equipo pastoral conversa en el jardín de la iglesia.",
          },
          {
            eyebrow: "Vida en familia",
            title: "Familias",
            description:
              "Encuentros para fortalecer vínculos y compartir ideas para la vida en casa y en comunidad.",
            meta: "Vínculos · Comunidad",
            meeting: "Segundo sábado del mes · 16:00",
            leader: "María Fernanda López",
            imageSrc: "/images/esperanza-de-vida/familias-encuentro.webp",
            imageAlt: "Una familia de varias generaciones comparte una actividad en comunidad.",
          },
          {
            eyebrow: "Servicio",
            title: "Bienvenida y cuidado",
            description:
              "Un equipo que ayuda a cada persona a sentirse orientada y recibida desde su primera visita.",
            meta: "Hospitalidad · Servicio",
            meeting: "Domingos · 08:30 y 11:00",
            leader: "Equipo pastoral",
            imageSrc: "/images/esperanza-de-vida/bienvenida-visita.webp",
            imageAlt: "Voluntarios reciben a una pareja visitante en la entrada de la iglesia.",
          },
          {
            eyebrow: "Servicio en la ciudad",
            title: "Servicio comunitario",
            description:
              "Personas que convierten la fe en acciones de apoyo y acompañamiento para el barrio.",
            meta: "Comunidad · Servicio",
            meeting: "Próximas jornadas · consulta la agenda",
            leader: "Equipo de servicio",
            imageSrc: "/images/esperanza-de-vida/servicio-comunitario.webp",
            imageAlt: "Voluntarios preparan alimentos para compartir durante una jornada comunitaria.",
          },
          {
            eyebrow: "Aprender juntos",
            title: "Formación bíblica",
            description:
              "Un espacio para leer las Escrituras, hacer preguntas y relacionar la fe con la vida diaria.",
            meta: "Biblia · Conversación",
            meeting: "Consulta las próximas fechas.",
            leader: "Equipo de formación",
            imageSrc: "/images/esperanza-de-vida/formacion-biblica.webp",
            imageAlt: "Un grupo de adultos conversa alrededor de Biblias abiertas y cuadernos.",
          },
          {
            eyebrow: "Comunicación",
            title: "Medios y comunicación",
            description:
              "Un equipo que sirve con fotografía, audio y video para compartir lo que vive la comunidad.",
            meta: "Foto · Audio · Video",
            meeting: "Según la agenda de encuentros.",
            leader: "Equipo de comunicación",
            imageSrc: "/images/esperanza-de-vida/comunicaciones-equipo.webp",
            imageAlt: "Voluntarios colaboran con una cámara y una consola de sonido durante un encuentro.",
          },
        ],
      },
    ],
  },
  blog: {
    title: "Ideas para la semana que comienza",
    eyebrow: "Lecturas · Reflexiones",
    intro:
      "Textos breves sobre la fe, la vida cotidiana y el valor de caminar junto a otras personas.",
    action: { label: "Ven a conocernos", href: "/servicios" },
    sections: [
      {
        eyebrow: "Desde la comunidad",
        title: "Lecturas para detenerse un momento",
        explorer: "blog",
        intro:
          "Un espacio editorial para compartir preguntas, aprendizajes y pequeñas prácticas que nos ayudan a vivir con esperanza.",
        cards: [
          {
            eyebrow: "Vida cotidiana · 12 nov 2026",
            title: "Hacer espacio para la esperanza",
            description:
              "A veces un nuevo comienzo no llega con ruido. Puede aparecer en una conversación, una pausa o una decisión pequeña.",
            meta: "5 min de lectura",
            href: "/blog/hacer-espacio-para-la-esperanza",
            filterValues: { categoría: "Vida cotidiana" },
            sortDate: "2026-11-12",
            featured: true,
          },
          {
            eyebrow: "Adoración · 5 nov 2026",
            title: "Adorar también es aprender a escuchar",
            description:
              "La gratitud y la atención transforman la manera en que miramos a las personas que están cerca.",
            meta: "4 min de lectura",
            href: "/blog/adorar-tambien-es-escuchar",
            filterValues: { categoría: "Adoración" },
            sortDate: "2026-11-05",
          },
          {
            eyebrow: "Familia · 29 oct 2026",
            title: "Una mesa para cada generación",
            description:
              "Crear momentos para escucharnos puede acercar a niños, jóvenes y adultos en medio de la rutina.",
            meta: "6 min de lectura",
            href: "/blog/una-mesa-para-cada-generacion",
            filterValues: { categoría: "Familia" },
            sortDate: "2026-10-29",
          },
        ],
      },
    ],
  },
  tienda: {
    title: "Recursos para crecer a tu ritmo",
    eyebrow: "Tienda · Lectura y comunidad",
    intro:
      "Libros y materiales pensados para acompañar la lectura, la conversación y los hábitos de fe durante la semana.",
    sections: [
      {
        eyebrow: "Punto de recursos",
        title: "Una selección para llevar contigo",
        explorer: "shop",
        intro:
          "Puedes consultar disponibilidad en el punto de recursos durante los encuentros dominicales. Las compras no se procesan desde esta página.",
        cards: [
          {
            eyebrow: "Lectura",
            title: "Biblia de estudio",
            description:
              "Una edición de lectura amplia para explorar pasajes, temas y referencias con más contexto.",
            meta: "Desde $28,00",
            href: "/tienda/biblia-de-estudio",
            filterValues: { categoría: "Lectura", precio: "Más de $20" },
            sortPrice: 28,
            sortDate: "2026-10-10",
            sortWeight: 3,
          },
          {
            eyebrow: "Hábitos",
            title: "Cuaderno de reflexión",
            description:
              "Páginas guiadas para anotar preguntas, gratitud y aprendizajes de cada semana.",
            meta: "$9,00",
            href: "/tienda/cuaderno-de-reflexion",
            filterValues: { categoría: "Hábitos", precio: "Menos de $10" },
            sortPrice: 9,
            sortDate: "2026-11-08",
            sortWeight: 2,
          },
          {
            eyebrow: "Comunidad",
            title: "Camiseta Esperanza de Vida",
            description:
              "Una prenda sencilla con la identidad visual de la comunidad, disponible en varias tallas.",
            meta: "$18,00",
            href: "/tienda/camiseta-esperanza-de-vida",
            filterValues: { categoría: "Comunidad", precio: "De $10 a $20" },
            sortPrice: 18,
            sortDate: "2026-11-12",
            sortWeight: 1,
          },
        ],
      },
      {
        eyebrow: "Consulta en persona",
        title: "Te contamos qué está disponible",
        intro:
          "El catálogo y las existencias pueden variar. Nuestro equipo de bienvenida te indicará dónde encontrar los recursos en la sede.",
        cards: [
          {
            title: "En los encuentros dominicales",
            description:
              "Acércate al punto de recursos al terminar la reunión para revisar títulos y materiales disponibles.",
            meta: "09:00 · 11:30",
          },
        ],
      },
    ],
  },
  galeria: {
    compactHero: true,
    title: "Momentos que compartimos",
    eyebrow: "Galería · Vida en comunidad",
    intro:
      "Celebraciones, encuentros y gestos cotidianos forman parte de la historia que seguimos construyendo juntos.",
    action: { label: "Conoce nuestros ministerios", href: "/ministerios" },
    sections: [
      {
        eyebrow: "Álbumes",
        title: "Imágenes de nuestra comunidad",
        intro:
          "La música, las conversaciones y el servicio aparecen en momentos cotidianos que compartimos como comunidad.",
        presentation: "image-gallery",
        cards: churchGalleryItems.map((item) => ({
          eyebrow: item.album,
          title: item.title,
          description: item.description,
          meta: `${item.album} · ${item.year}`,
          imageSrc: item.src,
          imageAlt: item.alt,
        })),
      },
    ],
  },
  contacto: {
    title: "Nos encantará conocerte",
    eyebrow: "Contacto · Ambato",
    intro:
      "Si quieres visitarnos, conversar con el equipo o saber qué encuentro puede servirte, aquí tienes la información para acercarte.",
    closingCta: false,
    compactSections: true,
    heroNote: {
      eyebrow: "Contacto y visitas",
      title: "Te recibimos en Ficoa",
      description:
        "Llámanos o escríbenos antes de venir. Con gusto te orientamos sobre el mejor encuentro para ti.",
    },
    faq: [
      {
        question: "¿En qué sector está la iglesia?",
        answer:
          "Estamos en Ficoa, en Ambato. La dirección completa aparece arriba en esta página.",
      },
      {
        question: "¿Puedo escribir antes de visitarlos?",
        answer:
          "Sí. Puedes llamar o escribir al correo de contacto para consultar sobre horarios, ministerios o una visita en grupo.",
      },
      {
        question: "¿Cuándo puedo encontrar al equipo de bienvenida?",
        answer:
          "El equipo está disponible durante los encuentros semanales y en el horario de atención indicado en esta página.",
      },
    ],
    action: { label: "Planifica tu primera visita", href: "/servicios" },
    sections: [
      {
        eyebrow: "Encuéntranos",
        title: `${churchProfile.name} en Ambato`,
        intro:
          "Estamos en el sector Ficoa. Puedes llegar a cualquiera de nuestros encuentros semanales; el equipo de bienvenida estará en la entrada.",
        presentation: "contact-methods",
        cards: [
          {
            icon: "location",
            eyebrow: "Dirección",
            title: "Sector Ficoa",
            description:
              churchProfile.address,
            meta: "Ecuador",
          },
          {
            icon: "phone",
            eyebrow: "Teléfono",
            title: churchProfile.phone,
            description:
              "Atención de lunes a viernes, de 09:00 a 17:00.",
            meta: "Equipo de bienvenida",
            href: `tel:${churchProfile.phone.replace(/[^\d+]/g, "")}`,
            actionLabel: "Llamar ahora",
          },
          {
            icon: "email",
            eyebrow: "Correo",
            title: churchProfile.email,
            description:
              "Para consultas generales, ministerios y visitas de grupo.",
            meta: "Respondemos durante la semana",
            href: `mailto:${churchProfile.email}`,
            actionLabel: "Escribir correo",
          },
        ],
      },
      {
        eyebrow: "Redes sociales",
        title: "Sigamos en contacto",
        intro:
          "Compartimos novedades, reflexiones y momentos de la comunidad durante la semana.",
        presentation: "social-profiles",
        cards: [
          {
            icon: "instagram",
            title: "Instagram",
            description: churchProfile.socialHandles[0].handle,
            meta: "Reflexiones y comunidad",
          },
          {
            icon: "facebook",
            title: "Facebook",
            description: churchProfile.socialHandles[1].handle,
            meta: "Agenda y novedades",
          },
          {
            icon: "youtube",
            title: "YouTube",
            description: churchProfile.socialHandles[2].handle,
            meta: "Mensajes y encuentros",
          },
        ],
      },
    ],
  },
  donaciones: {
    title: "La generosidad también acompaña",
    eyebrow: "Generosidad · Servicio",
    intro:
      "Creemos en una generosidad libre, informada y cercana. Compartimos recursos para sostener espacios de formación, comunidad y servicio.",
    sections: [
      {
        eyebrow: "Una manera de servir",
        title: "Aportes con propósito y transparencia",
        intro:
          "Cada contribución es voluntaria. El equipo de la iglesia comparte información sobre los proyectos y el uso de los recursos en los encuentros comunitarios.",
        cards: [
          {
            title: "Formación para cada generación",
            description:
              "Materiales y espacios de aprendizaje para niños, jóvenes y familias.",
            meta: "Comunidad · Aprendizaje",
          },
          {
            title: "Servicio en el barrio",
            description:
              "Iniciativas para acompañar a personas y familias a través de acciones cercanas.",
            meta: "Cuidado · Servicio",
          },
          {
            title: "Vida de la comunidad",
            description:
              "Recursos para mantener los encuentros y abrir espacios de bienvenida durante la semana.",
            meta: "Encuentros · Hospitalidad",
          },
        ],
      },
      {
        eyebrow: "Aportes presenciales",
        title: "Conversa con el equipo durante un encuentro",
        intro:
          "Por ahora, la información y recepción de aportes se realizan en persona. No compartimos datos bancarios ni procesamos pagos desde esta página.",
        presentation: "callout",
        cards: [
          {
            title: "¿Tienes preguntas?",
            description:
              "El equipo pastoral puede explicarte los propósitos comunitarios y responder tus consultas con claridad.",
            meta: "Domingos · 09:00 y 11:30",
            href: "/contacto",
            actionLabel: "Contactar al equipo",
          },
        ],
      },
    ],
  },
  oracion: {
    title: "No tienes que atravesarlo a solas",
    eyebrow: "Oración · Acompañamiento",
    intro:
      "Si estás viviendo un momento difícil o quieres compartir algo por lo que agradecer, hay personas dispuestas a escucharte y acompañarte.",
    action: { label: "Conoce los horarios", href: "/servicios" },
    sections: [
      {
        eyebrow: "Un espacio para conversar",
        title: "Podemos hacer una pausa contigo",
        intro:
          "El equipo de oración se reúne cada semana y está disponible para conversar en persona después de los encuentros.",
        cards: [
          {
            eyebrow: "Miércoles · 19:30",
            title: "Oramos en comunidad",
            description:
              "Un encuentro para poner en palabras lo que estamos viviendo, escuchar y acompañarnos con respeto.",
            meta: "Oración y Palabra",
          },
          {
            title: "Una conversación privada",
            description:
              "Si prefieres hablar en persona, puedes acercarte al equipo pastoral al terminar un servicio.",
            meta: "Acompañamiento cercano",
          },
          {
            title: "Con respeto y cuidado",
            description:
              "Tú decides qué compartir y con quién. No publicamos peticiones personales en esta página.",
            meta: "Privacidad · Escucha",
          },
        ],
      },
    ],
  },
  "en-vivo": {
    title: "Acompaña tu semana con un mensaje",
    eyebrow: "Mensajes · Comunidad",
    intro:
      "Consulta los horarios semanales y vuelve a reflexiones compartidas. La programación de transmisiones se anunciará en esta sección.",
    action: { label: "Ver mensajes", href: "/sermones" },
    sections: [
      {
        eyebrow: "Encuentros semanales",
        title: "Un espacio para encontrarnos",
        intro:
          "La vida de la comunidad también sucede en los encuentros de cada semana.",
        cards: [
          {
            eyebrow: "Domingo · 09:00 y 11:30",
            title: "Celebración y enseñanza",
            description:
              "Dos espacios para compartir música, una reflexión y tiempo en comunidad.",
            meta: "Ambato · Ecuador",
          },
          {
            eyebrow: "Miércoles · 19:30",
            title: "Oración y Palabra",
            description:
              "Un encuentro entre semana para escuchar, conversar y renovar la esperanza.",
            meta: "Encuentro semanal",
          },
        ],
      },
      {
        eyebrow: "Mensajes anteriores",
        title: "Lleva una reflexión contigo",
        intro:
          "Encuentra temas sobre esperanza, comunidad y vida cotidiana en nuestro archivo de mensajes.",
        cards: [
          {
            title: "Cuando la esperanza vuelve a florecer",
            description: "Salmo 126:5–6 · Una fe que permanece.",
            meta: "15 nov 2026",
            href: "/sermones/cuando-la-esperanza-vuelve-a-florecer",
          },
          {
            title: "Una mesa con espacio para todos",
            description: "Lucas 14:15–24 · Comunidad y servicio.",
            meta: "8 nov 2026",
            href: "/sermones/una-mesa-con-espacio-para-todos",
          },
        ],
      },
    ],
  },
} satisfies Record<string, PublicPageBlueprint>;

export type PublicPageSlug = keyof typeof publicPageBlueprints;

