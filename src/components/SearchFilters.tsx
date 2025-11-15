import { useState, useEffect } from 'react';
import type { Planet, Species, Film } from '../types';
import { swapiService } from '../services/api';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedHomeworld: string;
  onHomeworldChange: (value: string) => void;
  selectedFilm: string;
  onFilmChange: (value: string) => void;
  selectedSpecies: string;
  onSpeciesChange: (value: string) => void;
  onReset: () => void;
}

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedHomeworld,
  onHomeworldChange,
  selectedFilm,
  onFilmChange,
  selectedSpecies,
  onSpeciesChange,
  onReset,
}: SearchFiltersProps) {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        const [planetsData, speciesData, filmsData] = await Promise.all([
          swapiService.getAllPlanets(),
          swapiService.getAllSpecies(),
          swapiService.getAllFilms(),
        ]);
        setPlanets(planetsData);
        setSpecies(speciesData);
        setFilms(filmsData.sort((a, b) => a.episode_id - b.episode_id));
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const hasActiveFilters = searchTerm || selectedHomeworld || selectedFilm || selectedSpecies;

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6 space-y-4">
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search by Name
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Enter character name..."
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-star-wars-yellow text-white"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Homeworld Filter */}
        <div>
          <label htmlFor="homeworld" className="block text-sm font-medium mb-2">
            Homeworld
          </label>
          <select
            id="homeworld"
            value={selectedHomeworld}
            onChange={(e) => onHomeworldChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-star-wars-yellow text-white disabled:opacity-50"
          >
            <option value="">All Homeworlds</option>
            {planets.map((planet) => (
              <option key={planet.url} value={planet.url}>
                {planet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Film Filter */}
        <div>
          <label htmlFor="film" className="block text-sm font-medium mb-2">
            Film
          </label>
          <select
            id="film"
            value={selectedFilm}
            onChange={(e) => onFilmChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-star-wars-yellow text-white disabled:opacity-50"
          >
            <option value="">All Films</option>
            {films.map((film) => (
              <option key={film.url} value={film.url}>
                Episode {film.episode_id}: {film.title}
              </option>
            ))}
          </select>
        </div>

        {/* Species Filter */}
        <div>
          <label htmlFor="species" className="block text-sm font-medium mb-2">
            Species
          </label>
          <select
            id="species"
            value={selectedSpecies}
            onChange={(e) => onSpeciesChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-star-wars-yellow text-white disabled:opacity-50"
          >
            <option value="">All Species</option>
            {species.map((s) => (
              <option key={s.url} value={s.url}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="btn-secondary text-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
