import type { CharacterWithImage } from '../types';
import { getIdFromUrl } from '../utils/helpers';

interface CharacterCardProps {
  character: CharacterWithImage;
  onClick: () => void;
}

export default function CharacterCard({ character, onClick }: CharacterCardProps) {
  const characterId = getIdFromUrl(character.url);

  const handleClick = () => {
    console.log('Card clicked:', character.name);
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="character-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={character.imageUrl}
          alt={character.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute top-0 left-0 ${character.speciesColor} px-3 py-1 text-xs font-bold text-white`}>
          ID: {characterId}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-star-wars-yellow mb-2 truncate">
          {character.name}
        </h3>
        
        <div className="space-y-1 text-sm text-gray-300">
          <p>
            <span className="text-gray-400">Birth Year:</span> {character.birth_year}
          </p>
          <p>
            <span className="text-gray-400">Gender:</span>{' '}
            {character.gender.charAt(0).toUpperCase() + character.gender.slice(1)}
          </p>
          <p>
            <span className="text-gray-400">Films:</span> {character.films.length}
          </p>
        </div>
      </div>
    </div>
  );
}
