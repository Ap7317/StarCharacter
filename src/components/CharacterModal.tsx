import { useEffect, useState } from 'react';
import type { CharacterWithImage, Planet } from '../types';
import { swapiService } from '../services/api';
import { formatDate, formatHeight, formatMass, formatPopulation } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';

interface CharacterModalProps {
  character: CharacterWithImage;
  onClose: () => void;
}

export default function CharacterModal({ character, onClose }: CharacterModalProps) {
  const [homeworld, setHomeworld] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomeworld = async () => {
      try {
        setLoading(true);
        const planet = await swapiService.getPlanet(character.homeworld);
        setHomeworld(planet);
      } catch (err) {
        setError('Failed to load homeworld data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworld();
  }, [character.homeworld]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-star-wars-yellow">
            {character.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Image */}
        <div className="w-full h-64 overflow-hidden">
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-xl font-bold text-star-wars-yellow mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Height" value={formatHeight(character.height)} />
              <InfoItem label="Mass" value={formatMass(character.mass)} />
              <InfoItem label="Birth Year" value={character.birth_year} />
              <InfoItem label="Gender" value={character.gender.charAt(0).toUpperCase() + character.gender.slice(1)} />
              <InfoItem label="Hair Color" value={character.hair_color} />
              <InfoItem label="Eye Color" value={character.eye_color} />
              <InfoItem label="Skin Color" value={character.skin_color} />
              <InfoItem label="Date Added" value={formatDate(character.created)} />
            </div>
          </section>

          {/* Films */}
          <section>
            <h3 className="text-xl font-bold text-star-wars-yellow mb-3">
              Film Appearances
            </h3>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-2xl font-bold text-center">
                {character.films.length}
                <span className="text-sm text-gray-400 ml-2">
                  {character.films.length === 1 ? 'film' : 'films'}
                </span>
              </p>
            </div>
          </section>

          {/* Homeworld */}
          <section>
            <h3 className="text-xl font-bold text-star-wars-yellow mb-3">
              Homeworld
            </h3>
            {loading ? (
              <div className="bg-gray-700 rounded p-8">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="bg-red-900/50 border border-red-500 rounded p-4 text-red-200">
                {error}
              </div>
            ) : homeworld ? (
              <div className="bg-gray-700 rounded p-4 space-y-3">
                <h4 className="text-lg font-bold text-white">{homeworld.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoItem label="Terrain" value={homeworld.terrain} />
                  <InfoItem label="Climate" value={homeworld.climate} />
                  <InfoItem
                    label="Population"
                    value={formatPopulation(homeworld.population)}
                  />
                  <InfoItem label="Diameter" value={`${homeworld.diameter} km`} />
                </div>
              </div>
            ) : null}
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-medium capitalize">{value}</p>
    </div>
  );
}
