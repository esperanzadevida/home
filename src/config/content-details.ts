export type ContentDetail = {
  title: string;
  eyebrow: string;
  intro: string;
  meta: string;
  sections: { title: string; paragraphs: string[] }[];
  author?: string;
  authorRole?: string;
  datePublished?: string;
  startDates?: string[];
  tags?: string[];
  related?: { title: string; href: string }[];
};

export const sermonDetails = {
  "cuando-la-esperanza-vuelve-a-florecer": {
    title: "Cuando la esperanza vuelve a florecer",
    eyebrow: "Mensaje · 15 nov 2026",
    intro:
      "El Salmo 126 nos recuerda que hay temporadas de siembra silenciosa y momentos en los que la alegría vuelve a ocupar espacio. La esperanza no siempre cambia el paisaje de inmediato; a veces cambia la manera de caminarlo.",
    meta: "Pr. Samuel Andrade · Salmo 126:5–6 · Serie Una fe que permanece",
    tags: ["Esperanza", "Vida diaria", "Salmos"],
    related: [
      { title: "Una mesa con espacio para todos", href: "/sermones/una-mesa-con-espacio-para-todos" },
      { title: "Fuerza para volver a comenzar", href: "/sermones/fuerza-para-volver-a-comenzar" },
    ],
    sections: [
      {
        title: "Sembrar también es confiar",
        paragraphs: [
          "El salmo habla de lágrimas y de cosecha en una misma imagen. La fe no nos pide negar lo que duele; nos invita a seguir sembrando bien aun cuando todavía no vemos el resultado.",
          "Una palabra de ánimo, una decisión honesta o un gesto de cuidado pueden parecer pequeños. Sin embargo, cada uno prepara un terreno donde algo nuevo puede crecer.",
        ],
      },
      {
        title: "Una esperanza que se comparte",
        paragraphs: [
          "No tenemos que atravesar cada estación por nuestra cuenta. Caminar con otras personas nos permite recibir apoyo y también ofrecerlo cuando alguien más lo necesita.",
          "Esta semana, busca una forma sencilla de acompañar a alguien: escucha sin apuro, pregunta cómo está o comparte una mesa.",
        ],
      },
    ],
  },
  "una-mesa-con-espacio-para-todos": {
    title: "Una mesa con espacio para todos",
    eyebrow: "Mensaje · 8 nov 2026",
    intro:
      "En Lucas 14, la mesa se convierte en una imagen de bienvenida. La invitación es amplia: hacer lugar, escuchar historias distintas y practicar una hospitalidad que no depende de que alguien piense o viva como nosotros.",
    meta: "Pr. Samuel Andrade · Lucas 14:15–24 · Serie Una fe que permanece",
    tags: ["Comunidad", "Servicio", "Hospitalidad"],
    related: [
      { title: "Cuando la esperanza vuelve a florecer", href: "/sermones/cuando-la-esperanza-vuelve-a-florecer" },
      { title: "Fuerza para volver a comenzar", href: "/sermones/fuerza-para-volver-a-comenzar" },
    ],
    sections: [
      {
        title: "La bienvenida empieza antes de hablar",
        paragraphs: [
          "Recibir a alguien significa prestar atención a lo que necesita para sentirse cómodo. Un saludo sencillo, una indicación amable o una silla libre pueden decir mucho.",
          "La hospitalidad también se construye cuando revisamos nuestras costumbres y nos preguntamos quién todavía no encuentra su lugar.",
        ],
      },
      {
        title: "Una comunidad con espacio",
        paragraphs: [
          "La mesa compartida nos recuerda que la comunidad se ensancha cuando hay escucha, paciencia y generosidad. Cada generación aporta algo distinto a esa conversación.",
          "Esta semana, piensa en una persona a quien puedas invitar a conversar y pregúntale qué le ayudaría a sentirse acompañada.",
        ],
      },
    ],
  },
  "fuerza-para-volver-a-comenzar": {
    title: "Fuerza para volver a comenzar",
    eyebrow: "Mensaje · 1 nov 2026",
    intro:
      "Isaías 40:28–31 presenta una esperanza que reconoce el cansancio y abre una posibilidad de renovación. Volver a comenzar puede ser un proceso gradual, acompañado y lleno de pasos pequeños.",
    meta: "Pr. Samuel Andrade · Isaías 40:28–31 · Serie Una fe que permanece",
    tags: ["Ánimo", "Confianza", "Isaías"],
    related: [
      { title: "Cuando la esperanza vuelve a florecer", href: "/sermones/cuando-la-esperanza-vuelve-a-florecer" },
      { title: "Una mesa con espacio para todos", href: "/sermones/una-mesa-con-espacio-para-todos" },
    ],
    sections: [
      {
        title: "Nombrar el cansancio",
        paragraphs: [
          "A veces pensamos que debemos resolverlo todo enseguida. Reconocer que estamos cansados nos permite pedir ayuda, descansar y mirar con honestidad lo que tenemos delante.",
          "La fortaleza no siempre se ve como velocidad. También puede verse como paciencia, una pausa necesaria o la decisión de volver a intentarlo mañana.",
        ],
      },
      {
        title: "Dar un paso posible",
        paragraphs: [
          "No hace falta conocer todo el camino para avanzar un poco. Elegir una conversación pendiente, ordenar una prioridad o aceptar compañía puede abrir una nueva etapa.",
          "Caminar con esperanza no significa caminar sin preguntas; significa no tener que responderlas en soledad.",
        ],
      },
    ],
  },
  "la-paciencia-tambien-nos-hace-crecer": {
    title: "La paciencia también nos hace crecer",
    eyebrow: "Mensaje · 25 oct 2026",
    intro:
      "Santiago habla de una fe que aprende a perseverar en medio de distintas pruebas. La paciencia no borra las preguntas; nos ayuda a dar el siguiente paso con compañía y esperanza.",
    meta: "Pr. Samuel Andrade · Santiago 1:2–4 · Serie Una fe que permanece",
    tags: ["Paciencia", "Crecimiento", "Perseverancia"],
    related: [
      { title: "Un lugar para descansar", href: "/sermones/un-lugar-para-descansar" },
      { title: "La alegría de compartir", href: "/sermones/la-alegria-de-compartir" },
    ],
    sections: [
      {
        title: "El proceso también importa",
        paragraphs: [
          "Cuando algo tarda más de lo que esperamos, podemos sentir que nos quedamos atrás. La perseverancia permite mirar el camino con calma y reconocer aquello que sí está creciendo.",
          "No tenemos que encontrar una explicación para cada dificultad antes de pedir apoyo. Podemos hablar con alguien de confianza y avanzar de a poco.",
        ],
      },
      {
        title: "Crecer con otras personas",
        paragraphs: [
          "La comunidad puede ofrecer escucha, ánimo y una mirada distinta cuando la nuestra se vuelve estrecha.",
          "Esta semana, elige un paso pequeño que puedas sostener y cuéntaselo a alguien que camine contigo.",
        ],
      },
    ],
  },
  "un-lugar-para-descansar": {
    title: "Un lugar para descansar",
    eyebrow: "Mensaje · 18 oct 2026",
    intro:
      "La invitación de Jesús a quienes están cansados también nos recuerda que el descanso es parte del camino. Recibir ayuda y hacer una pausa puede ser un comienzo.",
    meta: "Pr. Samuel Andrade · Mateo 11:28–30 · Serie Una fe que permanece",
    tags: ["Descanso", "Cuidado", "Esperanza"],
    related: [
      { title: "La paciencia también nos hace crecer", href: "/sermones/la-paciencia-tambien-nos-hace-crecer" },
      { title: "La alegría de compartir", href: "/sermones/la-alegria-de-compartir" },
    ],
    sections: [
      {
        title: "Nombrar lo que pesa",
        paragraphs: [
          "A veces el cansancio se acumula antes de que tengamos tiempo de reconocerlo. Ponerle nombre puede ayudarnos a decidir qué dejar para después y a quién pedir compañía.",
          "Descansar no exige tener todo resuelto. Puede empezar con una conversación honesta o unos minutos sin prisa.",
        ],
      },
      {
        title: "Un ritmo más amable",
        paragraphs: [
          "No todas las personas necesitan la misma pausa. Escuchar nuestros límites y respetar los de los demás también es una forma de cuidado.",
          "Esta semana, reserva un momento para respirar y pregunta a alguien cercano cómo puedes acompañarle.",
        ],
      },
    ],
  },
  "la-alegria-de-compartir": {
    title: "La alegría de compartir",
    eyebrow: "Mensaje · 11 oct 2026",
    intro:
      "Pablo presenta la generosidad como una decisión libre y alegre. Compartir tiempo, atención o recursos puede fortalecer la vida común cuando se hace con cuidado.",
    meta: "Pr. Samuel Andrade · 2 Corintios 9:6–8 · Serie Una fe que permanece",
    tags: ["Generosidad", "Servicio", "Comunidad"],
    related: [
      { title: "La paciencia también nos hace crecer", href: "/sermones/la-paciencia-tambien-nos-hace-crecer" },
      { title: "Una mesa con espacio para todos", href: "/sermones/una-mesa-con-espacio-para-todos" },
    ],
    sections: [
      {
        title: "Compartir con libertad",
        paragraphs: [
          "La generosidad no se mide solo por una cantidad. También aparece al ofrecer tiempo, escuchar con atención o colaborar con una tarea que beneficia a otras personas.",
          "Cada quien puede participar de acuerdo con sus posibilidades, sin presión y con claridad sobre el propósito de lo que aporta.",
        ],
      },
      {
        title: "Cuidar lo que recibimos",
        paragraphs: [
          "Los recursos compartidos sostienen proyectos comunes y requieren responsabilidad, transparencia y conversación.",
          "Piensa en una manera concreta de compartir esta semana y en cómo cuidar el resultado junto a otras personas.",
        ],
      },
    ],
  },
} satisfies Record<string, ContentDetail>;

export const eventDetails = {
  "domingo-de-bienvenida": {
    title: "Domingo de bienvenida",
    eyebrow: "Encuentro · 22 nov 2026",
    intro:
      "Un domingo para encontrarnos con calma, compartir la música y recibir a quienes se acercan a Iglesia Doménica por primera vez.",
    meta: "Domingo 22 de noviembre · 09:00 y 11:30 · Sector Ficoa, Ambato",
    startDates: ["2026-11-22T09:00:00-05:00", "2026-11-22T11:30:00-05:00"],
    related: [
      { title: "Una tarde para servir", href: "/eventos/una-tarde-para-servir" },
      { title: "Planifica tu visita", href: "/servicios" },
    ],
    sections: [
      {
        title: "Qué encontrarás",
        paragraphs: [
          "Habrá un equipo de bienvenida en la entrada para orientarte, responder preguntas y mostrarte los espacios para niños.",
          "La reunión combina música, una reflexión y tiempo para conversar. Puedes asistir a cualquiera de los dos horarios y participar a tu manera.",
        ],
      },
      {
        title: "Información práctica",
        paragraphs: [
          "La sede está en el sector Ficoa, en Ambato. Recomendamos llegar unos minutos antes para ubicarte con tranquilidad.",
          "No necesitas inscribirte ni llevar materiales. Ven como eres; nos alegrará conocerte.",
        ],
      },
    ],
  },
  "una-tarde-para-servir": {
    title: "Una tarde para servir",
    eyebrow: "Comunidad · 6 dic 2026",
    intro:
      "Una jornada para preparar acciones sencillas de acompañamiento y servicio junto a familias y jóvenes de la comunidad.",
    meta: "Domingo 6 de diciembre · 15:00 · Iglesia Doménica, Ambato",
    startDates: ["2026-12-06T15:00:00-05:00"],
    related: [
      { title: "Domingo de bienvenida", href: "/eventos/domingo-de-bienvenida" },
      { title: "Navidad en comunidad", href: "/eventos/navidad-en-comunidad" },
    ],
    sections: [
      {
        title: "Una tarde de colaboración",
        paragraphs: [
          "Nos organizaremos en equipos para preparar materiales, conversar sobre necesidades cercanas y coordinar pequeños gestos de cuidado para el barrio.",
          "Cada persona puede aportar desde lo que sabe hacer. La jornada está pensada para compartir ideas y trabajar juntos en un ambiente cercano.",
        ],
      },
      {
        title: "Cómo participar",
        paragraphs: [
          "Acércate a la sede a la hora indicada y pregunta por el equipo de bienvenida. Te explicaremos las actividades previstas y cómo sumarte.",
          "La agenda se desarrolla en persona; esta página no registra inscripciones.",
        ],
      },
    ],
  },
  "navidad-en-comunidad": {
    title: "Navidad en comunidad",
    eyebrow: "Celebración · 20 dic 2026",
    intro:
      "Una tarde para celebrar la Navidad con música, historias y una mesa compartida por personas de todas las edades.",
    meta: "Domingo 20 de diciembre · 17:00 · Iglesia Doménica, Ambato",
    startDates: ["2026-12-20T17:00:00-05:00"],
    related: [
      { title: "Domingo de bienvenida", href: "/eventos/domingo-de-bienvenida" },
      { title: "Una tarde para servir", href: "/eventos/una-tarde-para-servir" },
    ],
    sections: [
      {
        title: "Celebrar juntos",
        paragraphs: [
          "La reunión incluirá canciones, una reflexión breve y momentos preparados por los ministerios de niños y jóvenes.",
          "Queremos que sea un espacio sencillo y acogedor para encontrarnos antes de las celebraciones de fin de año.",
        ],
      },
      {
        title: "Una invitación abierta",
        paragraphs: [
          "Puedes venir con familia o amistades. El equipo de bienvenida estará disponible para orientarte al llegar.",
          "La celebración es presencial y no requiere registro desde esta página.",
        ],
      },
    ],
  },
} satisfies Record<string, ContentDetail>;

export const blogDetails = {
  "hacer-espacio-para-la-esperanza": {
    title: "Hacer espacio para la esperanza",
    eyebrow: "Vida cotidiana · 12 nov 2026",
    intro:
      "A veces un nuevo comienzo no llega con ruido. Puede aparecer en una conversación, una pausa o una decisión pequeña que nos ayuda a mirar el día con más ánimo.",
    meta: "5 min de lectura · Comunidad Doménica",
    datePublished: "2026-11-12",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Vida cotidiana", "Esperanza", "Nuevos comienzos"],
    related: [
      { title: "Adorar también es aprender a escuchar", href: "/blog/adorar-tambien-es-escuchar" },
      { title: "Una mesa para cada generación", href: "/blog/una-mesa-para-cada-generacion" },
    ],
    sections: [
      {
        title: "Pequeños comienzos",
        paragraphs: [
          "Esperar no siempre significa quedarse inmóvil. También puede ser cuidar una relación, volver a una tarea con calma o pedir apoyo cuando algo pesa demasiado.",
          "Cuando miramos solo el resultado final, es fácil pasar por alto el trabajo silencioso que ocurre en medio del camino. La esperanza nos ayuda a prestar atención a esos pasos.",
        ],
      },
      {
        title: "Una práctica para esta semana",
        paragraphs: [
          "Elige una cosa pequeña que te gustaría cultivar. Escríbela, compártela con alguien de confianza y decide cuál puede ser tu siguiente paso posible.",
          "No tienes que hacerlo todo hoy. A veces basta con empezar y permitir que otras personas caminen contigo.",
        ],
      },
    ],
  },
  "adorar-tambien-es-escuchar": {
    title: "Adorar también es aprender a escuchar",
    eyebrow: "Adoración · 5 nov 2026",
    intro:
      "La gratitud y la atención cambian la manera en que miramos a las personas que están cerca. Escuchar puede convertirse en una forma concreta de cuidar.",
    meta: "4 min de lectura · Comunidad Doménica",
    datePublished: "2026-11-05",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Adoración", "Escucha", "Gratitud"],
    related: [
      { title: "Hacer espacio para la esperanza", href: "/blog/hacer-espacio-para-la-esperanza" },
      { title: "Una mesa para cada generación", href: "/blog/una-mesa-para-cada-generacion" },
    ],
    sections: [
      {
        title: "La atención como regalo",
        paragraphs: [
          "Escuchar con tiempo, sin preparar una respuesta antes de comprender, comunica que la experiencia de otra persona importa.",
          "En una semana llena de pendientes, reservar unos minutos para conversar puede ser una manera sencilla de practicar la gratitud y la hospitalidad.",
        ],
      },
      {
        title: "Hacer una pregunta sincera",
        paragraphs: [
          "Puedes empezar con algo simple: ¿cómo ha sido tu semana? Después, deja que la respuesta marque el ritmo de la conversación.",
          "A veces acompañar no requiere una solución rápida. Requiere presencia, respeto y disposición para seguir escuchando.",
        ],
      },
    ],
  },
  "una-mesa-para-cada-generacion": {
    title: "Una mesa para cada generación",
    eyebrow: "Familia · 29 oct 2026",
    intro:
      "Crear momentos para escucharnos puede acercar a niños, jóvenes y adultos en medio de la rutina. Una mesa compartida abre espacio para preguntas y recuerdos.",
    meta: "6 min de lectura · Comunidad Doménica",
    datePublished: "2026-10-29",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Familia", "Comunidad", "Conversación"],
    related: [
      { title: "Hacer espacio para la esperanza", href: "/blog/hacer-espacio-para-la-esperanza" },
      { title: "Adorar también es aprender a escuchar", href: "/blog/adorar-tambien-es-escuchar" },
    ],
    sections: [
      {
        title: "Conversaciones sin apuro",
        paragraphs: [
          "Cada generación trae experiencias y preguntas distintas. Cuando dejamos que todas tengan espacio, la conversación se vuelve más rica y más honesta.",
          "Una comida sencilla, una caminata o unos minutos al final del día pueden convertirse en un lugar seguro para compartir lo que cada persona está viviendo.",
        ],
      },
      {
        title: "Una idea para empezar",
        paragraphs: [
          "Propón una pregunta que todos puedan responder: ¿qué momento bueno recuerdas de esta semana? Escucha cada respuesta sin corregirla ni compararla.",
          "Los vínculos crecen con prácticas pequeñas que podemos repetir. Lo importante es hacer lugar y volver a encontrarnos.",
        ],
      },
    ],
  },
} satisfies Record<string, ContentDetail>;

export const productDetails = {
  "biblia-de-estudio": {
    title: "Biblia de estudio",
    eyebrow: "Recurso · Lectura",
    intro:
      "Una edición de lectura amplia para explorar pasajes, temas y referencias con más contexto durante tu tiempo personal o en grupo.",
    meta: "Desde $28,00 · Consulta disponibilidad en la sede",
    related: [
      { title: "Cuaderno de reflexión", href: "/tienda/cuaderno-de-reflexion" },
      { title: "Camiseta Doménica", href: "/tienda/camiseta-domenica" },
    ],
    sections: [
      {
        title: "Para leer y conversar",
        paragraphs: [
          "Las referencias y notas de estudio pueden ayudarte a seguir temas y ubicar pasajes relacionados. Es un recurso para acompañar la lectura, no para reemplazar la conversación comunitaria.",
          "Pregunta por las ediciones disponibles y sus características durante los encuentros dominicales.",
        ],
      },
      {
        title: "Disponibilidad",
        paragraphs: [
          "El catálogo presencial puede variar. La consulta y compra se realizan en el punto de recursos de Iglesia Doménica; esta página no procesa pedidos ni pagos.",
        ],
      },
    ],
  },
  "cuaderno-de-reflexion": {
    title: "Cuaderno de reflexión",
    eyebrow: "Recurso · Hábitos",
    intro:
      "Un cuaderno con espacio para anotar preguntas, gratitud y aprendizajes de cada semana.",
    meta: "$9,00 · Consulta disponibilidad en la sede",
    related: [
      { title: "Biblia de estudio", href: "/tienda/biblia-de-estudio" },
      { title: "Camiseta Doménica", href: "/tienda/camiseta-domenica" },
    ],
    sections: [
      {
        title: "Un hábito que cabe en tu día",
        paragraphs: [
          "Puedes usar sus páginas para registrar una idea, una oración o algo que quieras recordar. No hay una forma correcta de llenarlo: empieza por lo que te resulte útil.",
          "Su formato sencillo facilita llevarlo a una reunión, a un grupo pequeño o a un momento personal de lectura.",
        ],
      },
      {
        title: "Disponibilidad",
        paragraphs: [
          "El catálogo presencial puede variar. La consulta y compra se realizan en el punto de recursos de Iglesia Doménica; esta página no procesa pedidos ni pagos.",
        ],
      },
    ],
  },
  "camiseta-domenica": {
    title: "Camiseta Doménica",
    eyebrow: "Recurso · Comunidad",
    intro:
      "Una prenda sencilla con la identidad visual de la comunidad, disponible en una selección de tallas.",
    meta: "$18,00 · Consulta tallas y disponibilidad en la sede",
    related: [
      { title: "Biblia de estudio", href: "/tienda/biblia-de-estudio" },
      { title: "Cuaderno de reflexión", href: "/tienda/cuaderno-de-reflexion" },
    ],
    sections: [
      {
        title: "Diseño cotidiano",
        paragraphs: [
          "La camiseta está pensada para un uso cómodo y diario. Puedes revisar el diseño, los colores y las tallas disponibles en el punto de recursos.",
          "Los tonos y existencias pueden variar según la producción de cada temporada.",
        ],
      },
      {
        title: "Disponibilidad",
        paragraphs: [
          "La consulta y compra se realizan en persona durante los encuentros. Esta página no gestiona pedidos, pagos ni envíos.",
        ],
      },
    ],
  },
} satisfies Record<string, ContentDetail>;
