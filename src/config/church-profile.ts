/**
 * Editorial profile used consistently across the local Iglesia Esperanza de Vida project.
 * Public copy follows the fictional congregation brief supplied by the user.
 * Contact details are display-only until an official channel is connected.
 */
export const churchProfile = {
  name: "Iglesia Esperanza de Vida",
  shortName: "Esperanza de Vida",
  denomination: "Asambleas de Dios",
  leadPastor: "Samuel Andrade",
  signature: "Caminamos en la luz, crecemos en comunidad.",
  city: "Ambato · Tungurahua, Ecuador",
  address: "Avenida Miraflores y calle Los Arrayanes, sector Ficoa, Ambato",
  phone: "+593 98 447 2651",
  email: "hola@esperanzadevida.ec",
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
    { network: "Instagram", handle: "@esperanza.vida.ambato" },
    { network: "Facebook", handle: "Iglesia Esperanza de Vida" },
    { network: "YouTube", handle: "@esperanzadevida" },
  ],
} as const;
