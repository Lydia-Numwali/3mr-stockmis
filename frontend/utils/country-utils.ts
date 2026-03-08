import { COUNTRY_COORDINATES } from '@/lib/country-coordinates';
import { COUNTRIES } from '@/lib/countries'; 

export interface CountryInfo {
  code: string;
  name: string;
  coords: [number, number];
  flag: string;
}

export function getCountryCoordinates(countryName: string): [number, number] | null {
  // First, try to find the country code by name
  const country = COUNTRIES.find(c => 
    c.title.toLowerCase() === countryName.toLowerCase() ||
    c.value.toLowerCase() === countryName.toLowerCase()
  );

  if (country && COUNTRY_COORDINATES[country.value]) {
    return COUNTRY_COORDINATES[country.value];
  }

  // If not found by code, try direct name matching
  const normalizedName = countryName.toUpperCase();
  const countryEntry = Object.entries(COUNTRY_COORDINATES).find(([code]) => 
    COUNTRIES.find(c => c.value === code)?.title.toUpperCase() === normalizedName
  );

  if (countryEntry) {
    return countryEntry[1];
  }

  // Return default coordinates (center of the world) if not found
  return null;
}

export function getCountryCode(countryName: string): string | null {
  const country = COUNTRIES.find(c => 
    c.title.toLowerCase() === countryName.toLowerCase() ||
    c.value.toLowerCase() === countryName.toLowerCase()
  );
  
  return country?.value || null;
}

export function getCountryFlagEmoji(countryCode: string): string {
  // Convert country code to flag emoji
  return countryCode.toUpperCase().replace(/./g, char => 
    String.fromCodePoint(127397 + char.charCodeAt(0))
  );
}

export function getCountryInfo(countryName: string): CountryInfo | null {
  const code = getCountryCode(countryName);
  if (!code) return null;

  const coords = getCountryCoordinates(countryName);
  const flag = getCountryFlagEmoji(code);
  const country = COUNTRIES.find(c => c.value === code);

  if (!coords || !country) return null;

  return {
    code,
    name: country.title,
    coords,
    flag
  };
}