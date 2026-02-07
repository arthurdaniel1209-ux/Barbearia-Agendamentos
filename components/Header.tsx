
import React from 'react';

interface HeaderProps {
  onBookNowClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBookNowClick }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-amber-400 uppercase">
            Imperial
        </div>
        <nav>
          <button 
            onClick={onBookNowClick}
            className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-amber-400 transition-colors duration-300 shadow-md shadow-amber-500/10 text-sm uppercase tracking-widest"
          >
            Agendar
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
