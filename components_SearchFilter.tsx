import { useState } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (maxPrice: number, maxDistance: number) => void;
}

export default function SearchFilter({ onSearch, onFilter }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);
  const [maxDistance, setMaxDistance] = useState(5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilter = () => {
    onFilter(maxPrice, maxDistance);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dishes or restaurants"
          className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors">
          Search
        </button>
      </form>
      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
          <input
            type="range"
            id="maxPrice"
            min="0"
            max="1000"
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-1 block w-full"
          />
          <span className="text-sm text-gray-500">₹{maxPrice}</span>
        </div>
        <div>
          <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700">Max Distance (km)</label>
          <input
            type="range"
            id="maxDistance"
            min="1"
            max="10"
            step="1"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="mt-1 block w-full"
          />
          <span className="text-sm text-gray-500">{maxDistance} km</span>
        </div>
        <button onClick={handleFilter} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
}

