/**
 * Editorial profile used consistently across the local DOMENICA project.
 * Public copy follows the fictional congregation brief supplied by the user.
 * Contact details are display-only until an official channel is connected.
 */
export const churchProfile = {
  name: "Iglesia Doménica",
  denomination: "Asambleas de Dios",
  leadPastor: "Samuel Andrade",
  signature: "Una fe que se vive en comunidad.",
  city: "Ambato · Tungurahua, Ecuador",
  address: "Calle Los Arrayanes y avenida de los Guaytambos, sector Ficoa, Ambato",
  phone: "+593 99 246 3817",
  email: "hola@domenicaiglesia.ec",
  founded: 2014,
  schedule: [
    {
      days: "Domingos",
      time: "09:00 y 11:30",
      title: "Celebración y enseñanza",
    },
    {
      days: "Miércoles",
      time: "19:30",
      title: "Oración y Palabra",
    },
    {
      days: "Viernes",
      time: "19:30",
      title: "Embajadores · Jóvenes",
    },
  ],
  socialHandles: [
    { network: "Instagram", handle: "@domenica.ambato" },
    { network: "Facebook", handle: "Iglesia Doménica Ambato" },
    { network: "YouTube", handle: "@iglesiadomenica" },
  ],
} as const;
