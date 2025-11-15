import type { Person, Planet, Species, Film, PaginatedResponse } from '../types';

const BASE_URL = 'https://swapi.dev/api';

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error: Unable to fetch data');
  }
}

export const swapiService = {
  // Fetch paginated people
  async getPeople(page: number = 1): Promise<PaginatedResponse<Person>> {
    return fetchWithErrorHandling<PaginatedResponse<Person>>(
      `${BASE_URL}/people/?page=${page}`
    );
  },

  // Fetch single person
  async getPerson(id: number): Promise<Person> {
    return fetchWithErrorHandling<Person>(`${BASE_URL}/people/${id}/`);
  },

  // Fetch planet by URL
  async getPlanet(url: string): Promise<Planet> {
    return fetchWithErrorHandling<Planet>(url);
  },

  // Fetch species by URL
  async getSpecies(url: string): Promise<Species> {
    return fetchWithErrorHandling<Species>(url);
  },

  // Fetch film by URL
  async getFilm(url: string): Promise<Film> {
    return fetchWithErrorHandling<Film>(url);
  },

  // Search people by name
  async searchPeople(query: string): Promise<PaginatedResponse<Person>> {
    return fetchWithErrorHandling<PaginatedResponse<Person>>(
      `${BASE_URL}/people/?search=${encodeURIComponent(query)}`
    );
  },

  // Fetch all planets (for filter dropdown)
  async getAllPlanets(): Promise<Planet[]> {
    const planets: Planet[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchWithErrorHandling<PaginatedResponse<Planet>>(
        `${BASE_URL}/planets/?page=${page}`
      );
      planets.push(...response.results);
      hasMore = response.next !== null;
      page++;
    }

    return planets;
  },

  // Fetch all species (for filter dropdown)
  async getAllSpecies(): Promise<Species[]> {
    const species: Species[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchWithErrorHandling<PaginatedResponse<Species>>(
        `${BASE_URL}/species/?page=${page}`
      );
      species.push(...response.results);
      hasMore = response.next !== null;
      page++;
    }

    return species;
  },

  // Fetch all films (for filter dropdown)
  async getAllFilms(): Promise<Film[]> {
    return fetchWithErrorHandling<PaginatedResponse<Film>>(
      `${BASE_URL}/films/`
    ).then(response => response.results);
  },
};

export { ApiError };
