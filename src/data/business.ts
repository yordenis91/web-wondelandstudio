/**
 * Fuente única del NAP (Name, Address, Phone) de Wonderlands Studio.
 *
 * Regla 3 de CLAUDE.md: ninguna plantilla escribe un teléfono o una dirección a mano.
 * Todo sale de aquí, y por tanto un cambio de dato se hace en un solo sitio y se
 * propaga al HTML visible y al JSON-LD a la vez — que es lo que evita las señales NAP
 * inconsistentes que penalizan el SEO local.
 */
import { type Pending, token } from './tokens.ts';

export type CityKey = 'wpb' | 'psl';

export interface Phone {
  /** Formato de marcado internacional, el que va en JSON-LD: `+15612603245`. */
  readonly e164: Pending<string>;
  /** Formato humano, el que se pinta en pantalla: `(561) 260-3245`. */
  readonly display: Pending<string>;
}

export interface PostalAddress {
  readonly streetAddress: Pending<string>;
  readonly addressLocality: string;
  readonly addressRegion: 'FL';
  readonly postalCode: Pending<string>;
  readonly addressCountry: 'US';
}

export interface GeoCoordinates {
  readonly latitude: Pending<number>;
  readonly longitude: Pending<number>;
}

export interface Location {
  readonly key: CityKey;
  /** Nombre de la ficha, distinto del nombre legal del negocio. */
  readonly name: string;
  /** Slug de ciudad en la URL inglesa: `west-palm-beach`. */
  readonly slug: string;
  readonly address: PostalAddress;
  readonly geo: GeoCoordinates;
  readonly phone: Phone;
  /** `@id` del `PhotographyBusiness` de esta sede en el grafo JSON-LD. */
  readonly schemaId: string;
  /** Zonas que esta sede cubre sin cargo de desplazamiento. */
  readonly areasServed: readonly string[];
  readonly languages: readonly ['en', 'es'];
}

export interface BusinessData {
  readonly legalName: string;
  readonly siteUrl: string;
  /** `@id` de la `Organization`, compartido por todas las páginas. */
  readonly schemaId: string;
  /** `@id` de la `Person` (Lisandra). Se declara completa solo en `/about-lisandra/`. */
  readonly founderSchemaId: string;
  readonly founder: string;
  readonly whatsapp: { readonly e164: string; readonly display: string };
  readonly social: readonly string[];
  readonly locations: Readonly<Record<CityKey, Location>>;
}

const SITE_URL = 'https://wonderlandsstudio.com';

const WPB: Location = {
  key: 'wpb',
  name: 'Wonderlands Studio — West Palm Beach',
  slug: 'west-palm-beach',
  address: {
    streetAddress: token('WPB_STREET_ADDRESS'),
    addressLocality: 'West Palm Beach',
    addressRegion: 'FL',
    postalCode: token('WPB_POSTAL_CODE'),
    addressCountry: 'US',
  },
  geo: {
    latitude: token('WPB_LAT'),
    longitude: token('WPB_LNG'),
  },
  phone: {
    e164: '+15612603245',
    display: '(561) 260-3245',
  },
  schemaId: `${SITE_URL}/west-palm-beach/#location`,
  areasServed: [
    'West Palm Beach',
    'Palm Beach',
    'Palm Beach Gardens',
    'Wellington',
    'Jupiter',
    'Boca Raton',
  ],
  languages: ['en', 'es'],
};

const PSL: Location = {
  key: 'psl',
  name: 'Wonderlands Studio — Port St. Lucie',
  slug: 'port-st-lucie',
  address: {
    streetAddress: '943 SE Brookedge Avenue E',
    addressLocality: 'Port Saint Lucie',
    addressRegion: 'FL',
    postalCode: '34983',
    addressCountry: 'US',
  },
  geo: {
    // Coordenadas de la dirección de Brookedge Avenue E, confirmadas contra el mapa.
    latitude: 27.3195,
    longitude: -80.3315,
  },
  phone: {
    // Pendiente: Lisandra tiene que confirmar si existe una línea 772 propia de PSL o
    // si esta sede usa el mismo número de WPB. Ver docs/PLAN.md §7.
    e164: token('PSL_PHONE_772'),
    display: token('PSL_PHONE_772'),
  },
  schemaId: `${SITE_URL}/port-st-lucie/#location`,
  areasServed: ['Port St. Lucie', 'Tradition', 'St. Lucie West', 'Fort Pierce'],
  languages: ['en', 'es'],
};

export const BUSINESS: BusinessData = {
  legalName: 'Wonderlands Studio',
  siteUrl: SITE_URL,
  schemaId: `${SITE_URL}/#organization`,
  founderSchemaId: `${SITE_URL}/about-lisandra/#lisandra`,
  founder: 'Lisandra',
  whatsapp: { e164: '+15612603245', display: '+1 561 260 3245' },
  social: [
    'https://www.instagram.com/wonderlandsSTUDIO',
    'https://www.tiktok.com/@wonderlandsSTUDIO',
    'https://www.facebook.com/wonderlandsSTUDIO',
  ],
  locations: { wpb: WPB, psl: PSL },
};

/** La sede, por clave de ciudad. Única forma legítima de leer un NAP. */
export function getLocation(city: CityKey): Location {
  return BUSINESS.locations[city];
}

export function getAllLocations(): readonly Location[] {
  return [BUSINESS.locations.wpb, BUSINESS.locations.psl];
}

export interface WhatsAppUtm {
  readonly source?: string;
  readonly medium?: string;
  readonly campaign?: string;
  readonly content?: string;
}

/**
 * Enlace de WhatsApp con el mensaje pre-escrito.
 *
 * Los parámetros UTM no viajan en la URL de `wa.me` — WhatsApp los descarta y además
 * no hay analítica al otro lado. Viajan dentro del propio texto del mensaje, como una
 * etiqueta corta al final, que es lo único que sobrevive hasta la bandeja de Lisandra
 * y le dice de qué página vino la consulta.
 */
export function getWhatsAppLink(message: string, utm?: WhatsAppUtm): string {
  const number = BUSINESS.whatsapp.e164.replace(/[^0-9]/g, '');
  const tag = utm
    ? [utm.source, utm.medium, utm.campaign, utm.content].filter(Boolean).join(' · ')
    : '';
  const text = tag ? `${message}\n\n[${tag}]` : message;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
