
import React, { useState } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import BookingModal from './components/BookingModal';

const App: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  return (
    <div className="min-h-screen text-white antialiased">
      <Header onBookNowClick={openBookingModal} />
      <main className="container mx-auto px-4 py-8">
        <section id="hero" className="text-center py-24 md:py-32">
          <h1 className="font-script text-7xl md:text-9xl text-amber-400 mb-4">Barbearia Imperial</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">Estilo. Precisão. Atitude.</p>
          
          <button
            onClick={openBookingModal}
            className="bg-amber-500 text-gray-900 font-bold py-3 px-10 rounded-md hover:bg-amber-400 transition-colors duration-300 text-lg shadow-lg shadow-amber-500/20 uppercase tracking-widest"
          >
            Agendar
          </button>
        </section>
        <Gallery />
      </main>
      <footer className="text-center py-6 border-t border-transparent">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} Barbearia Imperial. Todos os direitos reservados.</p>
      </footer>

      {isBookingModalOpen && <BookingModal onClose={closeBookingModal} />}
    </div>
  );
};

export default App;