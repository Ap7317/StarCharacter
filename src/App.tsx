import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { swapiService } from './services/api';
import type { Person, CharacterWithImage, Species } from './types';
import { getRandomImageUrl, getSpeciesColor, getIdFromUrl } from './utils/helpers';
import LoginForm from './components/LoginForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CharacterCard from './components/CharacterCard';
import CharacterModal from './components/CharacterModal';
import Pagination from './components/Pagination';
import SearchFilters from './components/SearchFilters';

function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const [characters, setCharacters] = useState<CharacterWithImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterWithImage | null>(null);
  const [speciesCache, setSpeciesCache] = useState<Map<string, Species>>(new Map());

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHomeworld, setSelectedHomeworld] = useState('');
  const [selectedFilm, setSelectedFilm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');

  // Fetch species data for a character
  const getSpeciesForCharacter = async (speciesUrls: string[]): Promise<string> => {
    if (speciesUrls.length === 0) return 'Human'; // Default to Human

    try {
      const speciesUrl = speciesUrls[0];
      
      // Check cache first
      if (speciesCache.has(speciesUrl)) {
        return speciesCache.get(speciesUrl)!.name;
      }

      // Fetch from API
      const species = await swapiService.getSpecies(speciesUrl);
      setSpeciesCache(prev => new Map(prev).set(speciesUrl, species));
      return species.name;
    } catch {
      return 'Human';
    }
  };

  // Fetch characters
  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true);
      setError('');

      const response = searchTerm
        ? await swapiService.searchPeople(searchTerm)
        : await swapiService.getPeople(page);

      // Process characters with images and species colors
      const processedCharacters = await Promise.all(
        response.results.map(async (person: Person) => {
          const characterId = getIdFromUrl(person.url);
          const speciesName = await getSpeciesForCharacter(person.species);
          return {
            ...person,
            imageUrl: getRandomImageUrl(characterId),
            speciesColor: getSpeciesColor(speciesName),
          };
        })
      );

      setCharacters(processedCharacters);
      setTotalCount(response.count);
      setHasNext(response.next !== null);
      setHasPrevious(response.previous !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch characters');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and page changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCharacters(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  // Search effect
  useEffect(() => {
    if (isAuthenticated && searchTerm) {
      const timer = setTimeout(() => {
        setCurrentPage(1);
        fetchCharacters(1);
      }, 500);

      return () => clearTimeout(timer);
    } else if (isAuthenticated && !searchTerm) {
      setCurrentPage(1);
      fetchCharacters(1);
    }
  }, [searchTerm, isAuthenticated]);

  // Apply filters
  const filteredCharacters = useMemo(() => {
    let filtered = [...characters];

    if (selectedHomeworld) {
      filtered = filtered.filter(char => char.homeworld === selectedHomeworld);
    }

    if (selectedFilm) {
      filtered = filtered.filter(char => char.films.includes(selectedFilm));
    }

    if (selectedSpecies) {
      filtered = filtered.filter(char => 
        char.species.length > 0 
          ? char.species.includes(selectedSpecies)
          : selectedSpecies === 'human' // Handle characters with no species (default Human)
      );
    }

    return filtered;
  }, [characters, selectedHomeworld, selectedFilm, selectedSpecies]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedHomeworld('');
    setSelectedFilm('');
    setSelectedSpecies('');
  };

  const totalPages = Math.ceil(totalCount / 10);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-star-wars-yellow">
            Star Wars Characters
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">
              Welcome, {user?.username}
            </span>
            <button onClick={logout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedHomeworld={selectedHomeworld}
          onHomeworldChange={setSelectedHomeworld}
          selectedFilm={selectedFilm}
          onFilmChange={setSelectedFilm}
          selectedSpecies={selectedSpecies}
          onSpeciesChange={setSelectedSpecies}
          onReset={handleResetFilters}
        />

        {/* Character Count */}
        {!loading && !error && (
          <p className="text-gray-400 mb-4">
            Showing {filteredCharacters.length} of {totalCount} characters
          </p>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => fetchCharacters(currentPage)} />
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No characters found</p>
            {(searchTerm || selectedHomeworld || selectedFilm || selectedSpecies) && (
              <button onClick={handleResetFilters} className="btn-primary mt-4">
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Character Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCharacters.map((character) => (
                <CharacterCard
                  key={character.url}
                  character={character}
                  onClick={() => setSelectedCharacter(character)}
                />
              ))}
            </div>

            {/* Pagination - only show if not filtering */}
            {!selectedHomeworld && !selectedFilm && !selectedSpecies && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      {/* Character Modal */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
}

export default App;
