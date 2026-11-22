import { churchProfile } from "@/config/church-profile";

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
      {
        title: "Para conversar",
        paragraphs: [
          "¿Qué gesto pequeño te ayudó a seguir adelante en una temporada difícil? ¿Hay alguien a quien podrías ofrecerle hoy una escucha tranquila?",
          "Si conversas en grupo, deja que cada persona comparta a su ritmo. No hace falta comparar historias ni encontrar una respuesta para todo.",
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
      {
        title: "Para conversar",
        paragraphs: [
          "¿Qué acciones concretas hacen que una persona se sienta bienvenida? ¿Qué costumbre podríamos revisar para que más gente encuentre su lugar?",
          "Elijan una acción que puedan practicar esta semana: aprender un nombre, ofrecer una indicación amable o abrir espacio para escuchar una historia nueva.",
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
      {
        title: "Para conversar",
        paragraphs: [
          "¿Qué parte de tu vida necesita un comienzo gradual? Piensa en una acción que puedas completar sin esperar a sentir que todo está resuelto.",
          "Si el cansancio se vuelve difícil de llevar, considera hablar con alguien de confianza y buscar el apoyo adecuado para lo que estás viviendo.",
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
      {
        title: "Para conversar",
        paragraphs: [
          "¿Qué proceso necesita más paciencia de tu parte? ¿Qué señal pequeña te permitiría reconocer que algo está avanzando, aunque todavía no haya terminado?",
          "Compartan una manera de acompañarse sin apurar los resultados ni asumir que todos viven el mismo proceso.",
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
      {
        title: "Para conversar",
        paragraphs: [
          "¿Qué actividad podrías dejar para después sin descuidar lo importante? ¿Con quién puedes hablar cuando necesitas reorganizar tus responsabilidades?",
          "El descanso no siempre resuelve lo que nos preocupa, pero una pausa puede ayudarnos a mirar el siguiente paso con más claridad.",
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
      {
        title: "Para conversar",
        paragraphs: [
          "¿Qué tienes disponible para compartir: tiempo, atención, experiencia o recursos? ¿Qué información ayudaría a que una iniciativa común sea clara y responsable?",
          "La generosidad es libre. Una comunidad agradece cada aporte y cuida que nadie sienta presión para dar más de lo que puede.",
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
      `Un domingo para encontrarnos con calma, compartir la música y recibir a quienes se acercan a ${churchProfile.name} por primera vez.`,
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
      {
        title: "Si vienes por primera vez",
        paragraphs: [
          "Puedes venir con familia o amistades y elegir el horario que te resulte más cómodo. Si tienes alguna pregunta al llegar, acércate al equipo de bienvenida.",
          "Participar es sencillo: puedes escuchar, cantar o simplemente observar. No esperamos que conozcas de antemano las canciones ni las costumbres del encuentro.",
        ],
      },
    ],
  },
  "una-tarde-para-servir": {
    title: "Una tarde para servir",
    eyebrow: "Comunidad · 6 dic 2026",
    intro:
      "Una jornada para preparar acciones sencillas de acompañamiento y servicio junto a familias y jóvenes de la comunidad.",
    meta: `Domingo 6 de diciembre · 15:00 · ${churchProfile.name}, Ambato`,
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
      {
        title: "Una contribución a tu medida",
        paragraphs: [
          "No necesitas experiencia previa para acercarte y conocer la jornada. El equipo explicará las tareas antes de empezar para que cada persona pueda elegir cómo colaborar.",
          "Si tienes una pregunta sobre la actividad, conversa con el equipo al llegar. La propuesta es compartir un tiempo de servicio y aprender juntos, no asumir compromisos permanentes.",
        ],
      },
    ],
  },
  "navidad-en-comunidad": {
    title: "Navidad en comunidad",
    eyebrow: "Celebración · 20 dic 2026",
    intro:
      "Una tarde para celebrar la Navidad con música, historias y una mesa compartida por personas de todas las edades.",
    meta: `Domingo 20 de diciembre · 17:00 · ${churchProfile.name}, Ambato`,
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
      {
        title: "Compartir la tarde",
        paragraphs: [
          "La celebración está pensada para distintas edades. Puedes llegar unos minutos antes para encontrar tu lugar y saludar al equipo que estará en la entrada.",
          "Si tienes dudas sobre el horario o la ubicación, revisa la información de contacto antes de salir. No se solicitan datos ni se confirman reservas desde esta página.",
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
    meta: `2 min de lectura · Comunidad ${churchProfile.shortName}`,
    datePublished: "2026-11-12",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Vida cotidiana", "Esperanza", "Nuevos comienzos"],
    related: [
      { title: "Pedir ayuda también es parte del camino", href: "/blog/pedir-ayuda-tambien-es-parte-del-camino" },
      { title: "Una mesa para cada generación", href: "/blog/una-mesa-para-cada-generacion" },
    ],
    sections: [
      {
        title: "Pequeños comienzos",
        paragraphs: [
          "Esperar no siempre significa quedarse inmóvil. También puede ser cuidar una relación, volver a una tarea con calma o pedir apoyo cuando algo pesa demasiado.",
          "Cuando miramos solo el resultado final, es fácil pasar por alto el trabajo silencioso que ocurre en medio del camino. La esperanza nos ayuda a prestar atención a esos pasos y a reconocer que no todo crecimiento se nota de inmediato.",
          "La imagen de la siembra en el Salmo 126 no convierte la espera en algo sencillo. Recuerda que hay procesos que requieren tiempo, cuidado y compañía antes de dar fruto.",
        ],
      },
      {
        title: "Mirar lo que sí está creciendo",
        paragraphs: [
          "En medio de una temporada difícil, podemos anotar aquello que permanece: una amistad que escucha, una rutina que nos hace bien o una tarea que logramos terminar. Nombrarlo no elimina el problema, pero evita que ocupe toda nuestra mirada.",
          "También ayuda distinguir entre lo que podemos atender hoy y lo que todavía no está en nuestras manos. Un paso pequeño y posible suele ser más útil que exigirnos resolverlo todo de una vez.",
        ],
      },
      {
        title: "Una práctica para esta semana",
        paragraphs: [
          "Elige una cosa pequeña que te gustaría cultivar. Escríbela, compártela con alguien de confianza y decide cuál puede ser tu siguiente paso posible. Procura que sea concreto: llamar, ordenar, descansar o pedir una conversación.",
          "Al final de la semana, vuelve a mirar esa nota sin juzgarte. Pregúntate qué aprendiste y qué apoyo necesitas para continuar. No tienes que hacerlo todo hoy; puedes permitir que otras personas caminen contigo.",
        ],
      },
      {
        title: "Una pregunta para llevar contigo",
        paragraphs: [
          "¿Qué te gustaría cuidar con paciencia durante los próximos días? Tal vez no tengas una respuesta completa todavía. Basta con encontrar una manera amable de empezar.",
        ],
      },
    ],
  },
  "adorar-tambien-es-escuchar": {
    title: "Adorar también es aprender a escuchar",
    eyebrow: "Adoración · 5 nov 2026",
    intro:
      "La gratitud y la atención cambian la manera en que miramos a las personas que están cerca. Escuchar puede convertirse en una forma concreta de cuidar.",
    meta: `2 min de lectura · Comunidad ${churchProfile.shortName}`,
    datePublished: "2026-11-05",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Adoración", "Escucha", "Gratitud"],
    related: [
      { title: "Pedir ayuda también es parte del camino", href: "/blog/pedir-ayuda-tambien-es-parte-del-camino" },
      { title: "Una mesa para cada generación", href: "/blog/una-mesa-para-cada-generacion" },
    ],
    sections: [
      {
        title: "La atención como regalo",
        paragraphs: [
          "Escuchar con tiempo, sin preparar una respuesta antes de comprender, comunica que la experiencia de otra persona importa.",
          "En una semana llena de pendientes, reservar unos minutos para conversar puede ser una manera sencilla de practicar la gratitud y la hospitalidad. La atención también es un regalo: por un momento, dejamos a un lado la prisa para estar presentes.",
          "La escucha no exige tener una respuesta brillante. A veces lo más cuidadoso es reconocer lo que oímos y preguntar si la otra persona quiere seguir hablando.",
        ],
      },
      {
        title: "Escuchar sin apurarse a resolver",
        paragraphs: [
          "Cuando alguien comparte una preocupación, es natural querer ofrecer una solución. Antes de hacerlo, podemos preguntar: ¿quieres que pensemos opciones o prefieres que te escuche? Esa pregunta respeta el momento y evita convertir la conversación en un consejo no solicitado.",
          "Santiago 1:19 invita a ser prontos para oír y lentos para hablar. Podemos tomar esa idea como una práctica cotidiana: respirar, dejar terminar la frase y comprobar que comprendimos antes de responder.",
        ],
      },
      {
        title: "Hacer una pregunta sincera",
        paragraphs: [
          "Puedes empezar con algo simple: ¿cómo ha sido tu semana? Después, deja que la respuesta marque el ritmo de la conversación. Si aparece un silencio, no hace falta llenarlo de inmediato.",
          "A veces acompañar no requiere una solución rápida. Requiere presencia, respeto y disposición para seguir escuchando. También significa cuidar la confianza: lo que alguien comparte en privado no se convierte en tema de conversación con otras personas.",
        ],
      },
      {
        title: "Una práctica para esta semana",
        paragraphs: [
          "Busca un momento breve para conversar con alguien cercano. Guarda el teléfono, haz una pregunta abierta y escucha sin interrumpir. Al terminar, puedes agradecerle por haberte contado cómo está.",
          "La gratitud se vuelve concreta cuando reconocemos a las personas que tenemos delante. Escuchar no resuelve todas las dificultades, pero puede hacer que nadie tenga que cargar una conversación en soledad.",
        ],
      },
    ],
  },
  "una-mesa-para-cada-generacion": {
    title: "Una mesa para cada generación",
    eyebrow: "Familia · 29 oct 2026",
    intro:
      "Crear momentos para escucharnos puede acercar a niños, jóvenes y adultos en medio de la rutina. Una mesa compartida abre espacio para preguntas y recuerdos.",
    meta: `2 min de lectura · Comunidad ${churchProfile.shortName}`,
    datePublished: "2026-10-29",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Familia", "Comunidad", "Conversación"],
    related: [
      { title: "Servir sin hacerlo todo", href: "/blog/servir-sin-hacerlo-todo" },
      { title: "Pedir ayuda también es parte del camino", href: "/blog/pedir-ayuda-tambien-es-parte-del-camino" },
    ],
    sections: [
      {
        title: "Conversaciones sin apuro",
        paragraphs: [
          "Cada generación trae experiencias y preguntas distintas. Cuando dejamos que todas tengan espacio, la conversación se vuelve más rica y más honesta.",
          "Una comida sencilla, una caminata o unos minutos al final del día pueden convertirse en un lugar seguro para compartir lo que cada persona está viviendo. No hace falta organizar algo extraordinario para encontrarnos.",
          "Los niños pueden necesitar preguntas concretas; los jóvenes, tiempo para expresar sus propias ideas; los adultos mayores, la oportunidad de compartir recuerdos sin que se les apresure. La paciencia permite que cada voz aparezca.",
        ],
      },
      {
        title: "Diferencias que enriquecen",
        paragraphs: [
          "Compartir entre generaciones no significa que todos deban pensar igual. Las preguntas difíciles también pueden formar parte de una conversación respetuosa. En vez de corregir de inmediato, podemos preguntar qué hay detrás de una opinión y contar cómo llegamos a la nuestra.",
          "Cuando escuchamos historias distintas, aprendemos a mirar la vida desde más de un lugar. La mesa se vuelve un espacio de encuentro cuando nadie tiene que ganarse el derecho a participar.",
        ],
      },
      {
        title: "Una idea para empezar",
        paragraphs: [
          "Propón una pregunta que todos puedan responder: ¿qué momento bueno recuerdas de esta semana? Escucha cada respuesta sin corregirla ni compararla. Después, si hay tiempo, pregunta qué fue lo más difícil.",
          "Los vínculos crecen con prácticas pequeñas que podemos repetir. Lo importante es hacer lugar y volver a encontrarnos, incluso cuando la semana haya sido complicada.",
        ],
      },
      {
        title: "Una costumbre que puede quedarse",
        paragraphs: [
          "Elijan una noche al mes para compartir una comida sencilla o una caminata. Pueden turnarse para escoger la pregunta de la conversación y guardar una idea que quieran recordar.",
          "No se trata de lograr una reunión perfecta. Se trata de abrir un espacio donde las personas puedan estar como son y sepan que alguien quiere escuchar su historia.",
        ],
      },
    ],
  },
  "pedir-ayuda-tambien-es-parte-del-camino": {
    title: "Pedir ayuda también es parte del camino",
    eyebrow: "Cuidado · 20 nov 2026",
    intro:
      "A veces creemos que debemos resolver cada dificultad en silencio. Compartir lo que nos pasa con alguien de confianza puede ser un primer paso para encontrar compañía y pensar con más claridad.",
    meta: `2 min de lectura · Comunidad ${churchProfile.shortName}`,
    datePublished: "2026-11-20",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Cuidado", "Comunidad", "Acompañamiento"],
    related: [
      { title: "Adorar también es aprender a escuchar", href: "/blog/adorar-tambien-es-escuchar" },
      { title: "Hacer espacio para la esperanza", href: "/blog/hacer-espacio-para-la-esperanza" },
    ],
    sections: [
      {
        title: "No tienes que explicarlo todo",
        paragraphs: [
          "Pedir compañía no requiere tener un relato ordenado ni saber exactamente qué necesitas. Puedes empezar con una frase sencilla: hoy me está costando y quisiera conversar un momento.",
          "Nombrar una necesidad puede sentirse vulnerable. Aun así, permite que las personas cercanas conozcan una parte de lo que estás viviendo y puedan responder con atención, sin adivinar ni presionarte.",
        ],
      },
      {
        title: "Elegir a quién acercarte",
        paragraphs: [
          "Busca a alguien que respete tu ritmo y pueda escucharte con cuidado. Puedes contar solo aquello que quieras compartir y acordar si prefieres una conversación privada o acompañamiento para dar un siguiente paso.",
          "En una comunidad de fe, la oración y la escucha pueden ofrecer cercanía. También es válido acudir a profesionales cuando una situación necesita atención especializada; pedir ese apoyo no disminuye tu fe.",
        ],
      },
      {
        title: "Una forma pequeña de comenzar",
        paragraphs: [
          "Escribe el nombre de una persona de confianza y una frase con la que te sentirías cómodo para iniciar la conversación. No tienes que enviarla de inmediato; preparar las palabras puede hacer más sencillo el primer paso.",
          "Si alguien se acerca a ti, puedes preguntar qué necesita en ese momento y escuchar su respuesta. Acompañar también implica respetar límites y no compartir confidencias sin permiso.",
        ],
      },
      {
        title: "Respetar tu propio ritmo",
        paragraphs: [
          "Puedes decidir cuánto contar, cuándo hacer una pausa y qué tipo de apoyo te gustaría recibir. Una conversación no tiene que resolverlo todo para ser valiosa.",
          "Si la primera persona a quien acudiste no pudo escucharte como necesitabas, busca otra fuente de apoyo confiable. Mereces que te traten con respeto y cuidado.",
        ],
      },
    ],
  },
  "servir-sin-hacerlo-todo": {
    title: "Servir sin hacerlo todo",
    eyebrow: "Servicio · 17 nov 2026",
    intro:
      "El servicio comunitario crece cuando muchas personas aportan algo posible. Cuidar los propios límites también ayuda a que la colaboración sea generosa, compartida y sostenible.",
    meta: `2 min de lectura · Comunidad ${churchProfile.shortName}`,
    datePublished: "2026-11-17",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Servicio", "Comunidad", "Cuidado"],
    related: [
      { title: "Una mesa para cada generación", href: "/blog/una-mesa-para-cada-generacion" },
      { title: "La alegría de compartir", href: "/sermones/la-alegria-de-compartir" },
    ],
    sections: [
      {
        title: "Compartir la tarea",
        paragraphs: [
          "Cuando una sola persona intenta sostenerlo todo, el servicio puede volverse una carga silenciosa. Repartir tareas permite que más personas aprendan, aporten ideas y cuiden el resultado juntas.",
          "Antes de empezar, ayuda conversar sobre lo que hace falta, quién puede colaborar y cuánto tiempo tiene cada quien. Un plan sencillo evita suposiciones y hace más fácil pedir apoyo a tiempo.",
        ],
      },
      {
        title: "Los límites también cuidan",
        paragraphs: [
          "Decir que no a una tarea en este momento no significa dejar de querer a la comunidad. Puede significar que tu agenda está llena, que necesitas descansar o que otra persona está mejor preparada para ayudar.",
          "Las comunidades sanas agradecen la honestidad y buscan alternativas sin culpabilizar. Un compromiso claro y realista suele servir más que una promesa hecha bajo presión.",
        ],
      },
      {
        title: "Una práctica para el próximo encuentro",
        paragraphs: [
          "Elige una manera concreta de colaborar que puedas sostener: preparar un espacio, saludar a alguien nuevo o ayudar a organizar materiales. Pregunta qué se necesita antes de asumir una tarea.",
          "Al terminar, conversen sobre lo que funcionó y qué conviene ajustar. Así el servicio se convierte en una oportunidad para aprender, agradecer y dar lugar a nuevas personas.",
        ],
      },
      {
        title: "Revisar el ritmo juntos",
        paragraphs: [
          "De vez en cuando, pregunten al equipo cómo se siente con las responsabilidades y si hay tareas que podrían simplificarse. Escuchar estas respuestas ayuda a cuidar a las personas además de completar la actividad.",
          "Un servicio compartido puede cambiar de forma con el tiempo. Agradecer el trabajo realizado y dejar espacio para nuevas manos mantiene abierta la invitación a participar.",
        ],
      },
    ],
  },
  "gratitud-en-los-dias-corrientes": {
    title: "La gratitud en los días corrientes",
    eyebrow: "Fe cotidiana · 14 nov 2026",
    intro:
      "La gratitud no exige que cada día sea fácil. Puede ayudarnos a reconocer compañía, belleza y cuidado en medio de una rutina que también incluye preguntas y cansancio.",
    meta: `2 min de lectura · Comunidad ${churchProfile.shortName}`,
    datePublished: "2026-11-14",
    author: "María Fernanda López",
    authorRole: "Equipo editorial",
    tags: ["Fe cotidiana", "Gratitud", "Esperanza"],
    related: [
      { title: "Hacer espacio para la esperanza", href: "/blog/hacer-espacio-para-la-esperanza" },
      { title: "Un lugar para descansar", href: "/sermones/un-lugar-para-descansar" },
    ],
    sections: [
      {
        title: "Agradecer sin negar lo difícil",
        paragraphs: [
          "Dar gracias no obliga a fingir que todo está bien. Podemos reconocer una preocupación y, al mismo tiempo, notar quién nos acompañó, qué aprendimos o qué pequeña ayuda llegó a tiempo.",
          "La gratitud ofrece una mirada más amplia: no borra las dificultades, pero tampoco permite que sean lo único que recordamos del día.",
        ],
      },
      {
        title: "Prestar atención a lo cercano",
        paragraphs: [
          "Una conversación amable, una comida compartida o unos minutos de descanso pueden pasar desapercibidos cuando vamos con prisa. Detenernos a nombrarlos nos ayuda a recibirlos con más atención.",
          "En la tradición bíblica, dar gracias aparece como una práctica que se puede vivir en diferentes circunstancias. No depende de tener una vida perfecta; puede comenzar con una frase honesta sobre algo que valoramos hoy.",
        ],
      },
      {
        title: "Tres preguntas para cerrar la semana",
        paragraphs: [
          "¿Quién estuvo cerca de ti? ¿Qué momento quisieras recordar? ¿Hay algo que podrías agradecer o reparar antes de comenzar una nueva semana? Escribe una respuesta para cada pregunta, aunque sea breve.",
          "Si lo deseas, comparte una de ellas con alguien de confianza. La gratitud también se vuelve vínculo cuando reconocemos el cuidado recibido y encontramos maneras de devolverlo con generosidad.",
        ],
      },
      {
        title: "Ponerlo en palabras",
        paragraphs: [
          "Puedes terminar el día con una frase breve: hoy agradezco..., hoy necesito... o mañana quisiera intentar... Así hay espacio tanto para reconocer lo bueno como para nombrar lo que todavía preocupa.",
          "Si prefieres escribir, guarda esa nota y vuelve a ella después de unos días. Tal vez descubras pequeños hilos de apoyo que pasaron inadvertidos mientras estabas ocupado con la rutina.",
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
      { title: "Camiseta Esperanza de Vida", href: "/tienda/camiseta-esperanza-de-vida" },
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
        title: "Qué conviene consultar",
        paragraphs: [
          "Antes de elegir, revisa la traducción, el tamaño de letra, el formato y las notas incluidas en cada edición. Estas características pueden cambiar de una versión a otra.",
          "Si no sabes por dónde empezar, piensa si la usarás para lectura personal, estudio en grupo o consulta frecuente. El equipo puede mostrarte las opciones disponibles para que compares con calma.",
        ],
      },
      {
        title: "Disponibilidad",
        paragraphs: [
          `El catálogo presencial puede variar. La consulta y compra se realizan en el punto de recursos de ${churchProfile.name}; esta página no procesa pedidos ni pagos.`,
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
      { title: "Camiseta Esperanza de Vida", href: "/tienda/camiseta-esperanza-de-vida" },
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
        title: "Una guía para volver a tus ideas",
        paragraphs: [
          "Al final de la semana, puedes volver a tus notas y subrayar una pregunta que quieras seguir pensando. También puedes escribir qué agradeces, qué aprendiste y qué conversación te gustaría retomar.",
          "No es necesario completar una página cada día. Un registro breve y honesto puede servirte más que una rutina difícil de mantener.",
        ],
      },
      {
        title: "Disponibilidad",
        paragraphs: [
          `El catálogo presencial puede variar. La consulta y compra se realizan en el punto de recursos de ${churchProfile.name}; esta página no procesa pedidos ni pagos.`,
        ],
      },
    ],
  },
  "camiseta-esperanza-de-vida": {
    title: "Camiseta Esperanza de Vida",
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
        title: "Antes de elegir",
        paragraphs: [
          "Si estás buscando una talla, consulta la guía disponible o pregunta si puedes comparar el corte en persona. Las tallas y los colores pueden cambiar según las unidades disponibles.",
          "Revisa el diseño antes de comprar y confirma el precio vigente con el equipo. Esta ficha informativa no reserva prendas ni garantiza existencias.",
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
