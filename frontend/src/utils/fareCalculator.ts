// // Precise coordinate database for major Ethiopian transit hubs and cities (Lat, Lng)
// const ETHIOPIAN_CITIES: { [key: string]: { lat: number; lng: number } } = {
//   "addis ababa": { lat: 9.0300, lng: 38.7400 },
//   "megenagna": { lat: 9.0227, lng: 38.7915 },
//   "bole": { lat: 8.9806, lng: 38.7900 },
//   "adama": { lat: 8.5416, lng: 39.2689 },
//   "nazreth": { lat: 8.5416, lng: 39.2689 },
//   "hawassa": { lat: 7.0504, lng: 38.4776 },
//   "dire dawa": { lat: 9.5931, lng: 41.8661 },
//   "bahir dar": { lat: 11.5742, lng: 37.3614 },
//   "gondar": { lat: 12.6034, lng: 37.4515 },
//   "jimma": { lat: 7.6734, lng: 36.8344 },
//   "bishoftu": { lat: 8.7333, lng: 38.9833 },
//   "debre zeit": { lat: 8.7333, lng: 38.9833 },
//   "dessie": { lat: 11.1211, lng: 39.6367 },
//   "mekelle": { lat: 13.4967, lng: 39.4753 },
//   "harar": { lat: 9.3100, lng: 42.1193 },
//   "arbaminch": { lat: 6.0210, lng: 37.5550 },
//   "jijiga": { lat: 9.3500, lng: 42.8000 }
// };

// // Calculate Haversine distance between two coordinates in kilometers
// export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const R = 6371; // Radius of the earth in km
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// function deg2rad(deg: number): number {
//   return deg * (Math.PI / 180);
// }

// // Real-world dynamic distance calculation based on actual city coordinates
// export function estimateRouteDistance(origin: string, destination: string): number {
//   const cleanOrigin = origin.toLowerCase().trim();
//   const cleanDest = destination.toLowerCase().trim();

//   let coord1 = ETHIOPIAN_CITIES[cleanOrigin];
//   let coord2 = ETHIOPIAN_CITIES[cleanDest];

//   // If city names aren't in our direct list, try partial matching
//   if (!coord1) {
//     const foundKey = Object.keys(ETHIOPIAN_CITIES).find(k => cleanOrigin.includes(k) || k.includes(cleanOrigin));
//     if (foundKey) coord1 = ETHIOPIAN_CITIES[foundKey];
//   }
//   if (!coord2) {
//     const foundKey = Object.keys(ETHIOPIAN_CITIES).find(k => cleanDest.includes(k) || k.includes(cleanDest));
//     if (foundKey) coord2 = ETHIOPIAN_CITIES[foundKey];
//   }

//   // Fallback default if unknown city entered
//   if (!coord1 || !coord2) {
//     return 120.0; 
//   }

//   const straightLine = calculateDistanceKm(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
  
//   // Real road multiplier (Ethiopian highways curve around terrain, making actual road distance ~30% longer than air distance)
//   const realRoadDistance = straightLine * 1.30;
//   return Math.round(realRoadDistance);
// }

// // Calculate total recommended price per seat based on actual distance and rate per km
// export function calculateSuggestedFare(origin: string, destination: string, ratePerKm: number): number {
//   const distanceKm = estimateRouteDistance(origin, destination);
//   const totalBaseFare = distanceKm * ratePerKm;
//   return Math.ceil(totalBaseFare / 10) * 10;
// }
// City Alias & Normalization Dictionary (Handles typos, abbreviations, and common nicknames)
const CITY_ALIASES: { [key: string]: string } = {
  // Addis Ababa & Sub-cities / Nicknames
  "addis ababa": "addis ababa",
  "addiss ababa": "addis ababa",
  "adiss": "addis ababa",
  "addis": "addis ababa",
  "finfine": "addis ababa",
  "megenagna": "addis ababa",
  "bole": "addis ababa",
  "piassa": "addis ababa",
  "sarbet": "addis ababa",
  "cmc": "addis ababa",
  "ayat": "addis ababa",

  // Adama / Nazreth
  "adama": "adama",
  "nazreth": "adama",
  "nazret": "adama",

  // Dire Dawa
  "dire dawa": "dire dawa",
  "diredawa": "dire dawa",
  "dire": "dire dawa",

  // Hawassa / Awasa
  "hawassa": "hawassa",
  "awasa": "hawassa",

  // Bahir Dar
  "bahir dar": "bahir dar",
  "bahirdar": "bahir dar",

  // Gondar
  "gondar": "gondar",
  "gonder": "gondar",

  // Mekelle
  "mekelle": "mekelle",
  "mekele": "mekelle",

  // Jimma
  "jimma": "jimma",
  "jima": "jimma",

  // Bishoftu / Debre Zeit
  "bishoftu": "bishoftu",
  "debre zeit": "bishoftu",
  "debrezeit": "bishoftu",

  // Harar
  "harar": "harar",

  // Dessie
  "dessie": "dessie",
  "dese": "dessie",

  // Jijiga
  "jijiga": "jijiga"
};

// Exact known highway driving distances (in KM) between normalized major hubs
const MAJOR_ROUTES: { [key: string]: number } = {
  "addis ababa-dire dawa": 450,
  "dire dawa-addis ababa": 450,
  "addis ababa-adama": 95,
  "adama-addis ababa": 95,
  "addis ababa-hawassa": 275,
  "hawassa-addis ababa": 275,
  "addis ababa-bahir dar": 560,
  "bahir dar-addis ababa": 560,
  "addis ababa-gondar": 738,
  "gondar-addis ababa": 738,
  "addis ababa-mekelle": 780,
  "mekelle-addis ababa": 780,
  "addis ababa-jimma": 355,
  "jimma-addis ababa": 355,
  "addis ababa-harar": 510,
  "harar-addis ababa": 510,
  "addis ababa-dessie": 400,
  "dessie-addis ababa": 400,
  "addis ababa-bishoftu": 45,
  "bishoftu-addis ababa": 45,
  "dire dawa-harar": 55,
  "harar-dire dawa": 55,
  "adama-hawassa": 180,
  "hawassa-adama": 180
};

// Precise coordinates for fallback calculation
const ETHIOPIAN_CITIES: { [key: string]: { lat: number; lng: number } } = {
  "addis ababa": { lat: 9.0300, lng: 38.7400 },
  "adama": { lat: 8.5416, lng: 39.2689 },
  "hawassa": { lat: 7.0504, lng: 38.4776 },
  "dire dawa": { lat: 9.5931, lng: 41.8661 },
  "bahir dar": { lat: 11.5742, lng: 37.3614 },
  "gondar": { lat: 12.6034, lng: 37.4515 },
  "jimma": { lat: 7.6734, lng: 36.8344 },
  "bishoftu": { lat: 8.7333, lng: 38.9833 },
  "dessie": { lat: 11.1211, lng: 39.6367 },
  "mekelle": { lat: 13.4967, lng: 39.4753 },
  "harar": { lat: 9.3100, lng: 42.1193 },
  "jijiga": { lat: 9.3500, lng: 42.8000 }
};

// Normalize any text input (case-insensitive, handles typos & nicknames)
function normalizeCity(input: string): string {
  const clean = input.toLowerCase().trim();
  if (CITY_ALIASES[clean]) {
    return CITY_ALIASES[clean];
  }
  // Partial substring match (e.g. if someone types "dire dawa terminal")
  const foundKey = Object.keys(CITY_ALIASES).find(alias => clean.includes(alias) || alias.includes(clean));
  if (foundKey) {
    return CITY_ALIASES[foundKey];
  }
  return clean;
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function estimateRouteDistance(origin: string, destination: string): number {
  const normOrigin = normalizeCity(origin);
  const normDest = normalizeCity(destination);

  // 1. Check direct highway distance map
  const routeKey = `${normOrigin}-${normDest}`;
  if (MAJOR_ROUTES[routeKey]) {
    return MAJOR_ROUTES[routeKey];
  }

  // 2. Fallback to coordinate calculation
  const coord1 = ETHIOPIAN_CITIES[normOrigin];
  const coord2 = ETHIOPIAN_CITIES[normDest];

  if (!coord1 || !coord2) {
    return 150.0; // Default fallback for completely unmapped remote areas
  }

  const straightLine = calculateDistanceKm(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
  return Math.round(straightLine * 1.35);
}

export function calculateSuggestedFare(origin: string, destination: string, ratePerKm: number): number {
  const distanceKm = estimateRouteDistance(origin, destination);
  const totalBaseFare = distanceKm * ratePerKm;
  return Math.ceil(totalBaseFare / 10) * 10;
}