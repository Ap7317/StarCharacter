import { format } from 'date-fns';

// Format date from ISO string to dd-MM-yyyy
export function formatDate(isoString: string): string {
  try {
    return format(new Date(isoString), 'dd-MM-yyyy');
  } catch {
    return 'Unknown';
  }
}

// Convert height from cm to meters
export function formatHeight(height: string): string {
  const heightNum = parseFloat(height);
  if (isNaN(heightNum)) return 'Unknown';
  return `${(heightNum / 100).toFixed(2)} m`;
}

// Format mass with unit
export function formatMass(mass: string): string {
  const massNum = parseFloat(mass);
  if (isNaN(massNum)) return 'Unknown';
  return `${massNum} kg`;
}

// Generate random image URL
export function getRandomImageUrl(seed: number): string {
  return `https://picsum.photos/seed/${seed}/400/300`;
}

// Generate color based on species
export function getSpeciesColor(speciesName: string): string {
  const colors: Record<string, string> = {
    Human: 'bg-blue-500',
    Droid: 'bg-gray-500',
    Wookiee: 'bg-amber-700',
    Rodian: 'bg-green-600',
    Hutt: 'bg-yellow-600',
    "Yoda's species": 'bg-emerald-500',
    Trandoshan: 'bg-lime-600',
    'Mon Calamari': 'bg-cyan-500',
    Ewok: 'bg-orange-600',
    Sullustan: 'bg-rose-500',
    Neimodian: 'bg-teal-600',
    Gungan: 'bg-purple-500',
    Toydarian: 'bg-indigo-500',
    Dug: 'bg-pink-500',
    "Twi'lek": 'bg-violet-500',
    Aleena: 'bg-fuchsia-500',
    Vulptereen: 'bg-red-600',
    Xexto: 'bg-sky-500',
    Toong: 'bg-amber-500',
    Cerean: 'bg-slate-500',
    Nautolan: 'bg-emerald-600',
    Zabrak: 'bg-red-700',
    Tholothian: 'bg-blue-600',
    Iktotchi: 'bg-orange-700',
    Quermian: 'bg-lime-500',
    "Kel Dor": 'bg-rose-600',
    Chagrian: 'bg-cyan-600',
    Geonosian: 'bg-amber-600',
    Mirialan: 'bg-green-700',
    Clawdite: 'bg-purple-600',
    Besalisk: 'bg-blue-700',
    Kaminoan: 'bg-gray-400',
    Skakoan: 'bg-yellow-700',
    Muun: 'bg-slate-600',
    Togruta: 'bg-orange-500',
    Kaleesh: 'bg-red-800',
    "Pau'an": 'bg-gray-600',
  };

  return colors[speciesName] || 'bg-indigo-600';
}

// Extract ID from SWAPI URL
export function getIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1], 10) : 0;
}

// Format population number
export function formatPopulation(population: string): string {
  if (population === 'unknown') return 'Unknown';
  const num = parseInt(population);
  if (isNaN(num)) return 'Unknown';
  return num.toLocaleString();
}
