export interface Sermon {
  id: string;
  title: string;
  slug: string;
  pastor: string;
  series?: string;
  date: string;
  duration: string;
  scripture: string;
  videoUrl?: string;
  audioUrl?: string;
  coverImage: string;
  description: string;
  viewsCount: number;
}

export interface ChurchEvent {
  id: string;
  title: string;
  slug: string;
  category: "Culto" | "Jóvenes" | "Niños" | "Damas" | "Varones" | "Especial";
  date: string;
  time: string;
  location: string;
  coverImage: string;
  description: string;
  registeredCount: number;
  maxAttendees?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  category: "Lectura" | "Hábitos" | "Comunidad" | "Biblias" | "Libros" | "Ropa" | "Accesorios" | "Digital";
  price: number;
  compareAtPrice?: number;
  coverImage: string;
  stock: number;
  isDigital?: boolean;
  featured?: boolean;
  description: string;
}

export interface Ministry {
  id: string;
  name: string;
  slug: string;
  leader: string;
  schedule: string;
  icon: string;
  coverImage: string;
  description: string;
}

export interface PrayerRequest {
  id: string;
  requesterName: string;
  request: string;
  createdAt: string;
  prayersCount: number;
  isAnonymous: boolean;
}
