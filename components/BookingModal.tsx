
import React, { useState, useEffect, useCallback } from 'react';
import { Service, Appointment } from '../types';
import { getAvailableSlots, bookAppointment } from '../services/googleCalendarService';

const services: Service[] = [
  { id: 1, name: 'Corte de Cabelo', duration: 30, price: 'R$ 40' },
  { id: 2, name: 'Barba', duration: 30, price: 'R$ 10' },
  { id: 3, name: 'Corte + Barba', duration: 60, price: 'R$ 65' },
];

interface BookingModalProps {
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleCloseAttempt = () => {
    if (step > 1 && !bookingConfirmed) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const handleDateChange = (date: Date) => {
    if (date < today) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const fetchTimes = useCallback(async () => {
    setIsLoadingTimes(true);
    setError(null);
    try {
      const times = await getAvailableSlots(selectedDate);
      setAvailableTimes(times);
    } catch (err) {
      setError('Não foi possível carregar os horários. Tente novamente.');
    } finally {
      setIsLoadingTimes(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (step === 2 && selectedService) {
      fetchTimes();
    }
  }, [step, selectedService, selectedDate, fetchTimes]);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    handleNextStep();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    handleNextStep();
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedTime) return;

    setIsBooking(true);
    setError(null);

    const appointment: Appointment = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      clientName: clientInfo.name,
      clientPhone: clientInfo.phone,
    };

    const result = await bookAppointment(appointment);

    if (result.success) {
      setBookingConfirmed(true);
    } else {
      setError(result.message);
      handlePrevStep(); // Go back to time selection
    }
    setIsBooking(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Select Service
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center text-amber-400">Escolha um Serviço</h3>
            <div className="space-y-3">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-white">{service.name}</p>
                    <p className="text-sm text-gray-400">{service.duration} min</p>
                  </div>
                  <p className="font-bold text-amber-400">{service.price}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 2: // Select Date & Time
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center text-amber-400">Escolha Data e Hora</h3>
            {error && <p className="text-red-400 text-center mb-2">{error}</p>}
            {/* Calendar */}
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
               <div className="flex justify-between items-center mb-2">
                 <button onClick={() => handleDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}>&lt;</button>
                 <h4 className="font-bold">{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h4>
                 <button onClick={() => handleDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}>&gt;</button>
               </div>
               <div className="grid grid-cols-7 gap-1 text-center text-sm">
                 {dayNames.map(day => <div key={day} className="font-semibold text-amber-400">{day}</div>)}
                 {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                 {Array.from({ length: daysInMonth }).map((_, day) => {
                   const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day + 1);
                   const isSelected = date.toDateString() === selectedDate.toDateString();
                   const isPast = date < today;
                   const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                   let dayClass = 'p-2 rounded-full transition-colors';
                   if (isPast) {
                     dayClass += ' text-gray-600 cursor-not-allowed line-through';
                   } else if (isWeekend) {
                     dayClass += ' text-amber-800 cursor-not-allowed';
                   } else if (isSelected) {
                     dayClass += ' bg-amber-500 text-gray-900 font-bold';
                   } else {
                     dayClass += ' hover:bg-gray-600';
                   }

                   return (
                     <button
                       key={day}
                       disabled={isPast || isWeekend}
                       onClick={() => handleDateChange(date)}
                       className={dayClass}
                     >{day + 1}</button>
                   );
                 })}
               </div>
            </div>
            {/* Time Slots */}
            {isLoadingTimes ? (
                <div className="flex justify-center items-center h-24">
                    <p className="text-amber-400">Carregando horários...</p>
                </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.length > 0 ? availableTimes.map(time => (
                  <button key={time} onClick={() => handleTimeSelect(time)} className="p-2 bg-gray-700 rounded hover:bg-amber-500 hover:text-gray-900 transition-colors">
                    {time}
                  </button>
                )) : <p className="col-span-full text-center text-gray-400">Sem horários disponíveis para esta data.</p>}
              </div>
            )}
          </div>
        );
      case 3: // Confirmation
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center text-amber-400">Confirme seu Agendamento</h3>
            <div className="bg-gray-700 p-4 rounded-lg mb-6 space-y-2 text-left">
              <p><strong>Serviço:</strong> {selectedService?.name}</p>
              <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
              <p><strong>Hora:</strong> {selectedTime}</p>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <input type="text" placeholder="Seu Nome" value={clientInfo.name} onChange={e => setClientInfo({...clientInfo, name: e.target.value})} required className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-amber-500 focus:border-amber-500"/>
              </div>
              <div>
                <input type="tel" placeholder="Seu Telefone" value={clientInfo.phone} onChange={e => setClientInfo({...clientInfo, phone: e.target.value})} required className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-amber-500 focus:border-amber-500"/>
              </div>
              <button type="submit" disabled={isBooking} className="w-full bg-amber-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors flex justify-center items-center">
                {isBooking ? 'Confirmando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          </div>
        );
      default: return null;
    }
  };
  
  if (bookingConfirmed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-gray-800 rounded-xl p-8 max-w-sm w-full text-center shadow-2xl modal-content-appear">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <h2 className="text-2xl font-bold mb-2 text-amber-400">Agendamento Confirmado!</h2>
            <p className="text-gray-300 mb-4">Obrigado, {clientInfo.name}. Seu horário foi reservado com sucesso.</p>
            <div className="bg-gray-700 p-3 rounded-lg text-left text-sm mb-6">
                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
                <p><strong>Hora:</strong> {selectedTime}</p>
            </div>
            <button onClick={onClose} className="w-full bg-amber-500 text-gray-900 font-bold py-2 rounded-lg hover:bg-amber-400 transition-colors">Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={handleCloseAttempt}>
      <div className="bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl modal-content-appear" onClick={(e) => e.stopPropagation()}>
        {showCloseConfirm && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-90 flex flex-col justify-center items-center rounded-xl z-10 p-4">
            <div className="text-center">
              <h4 className="font-bold text-lg mb-2 text-white">Sair do Agendamento?</h4>
              <p className="text-gray-300 mb-6">Seu progresso será perdido. Tem certeza?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleCloseAttempt} className="absolute top-2 right-3 text-gray-400 hover:text-white transition-colors text-2xl font-bold">
          &times;
        </button>
        {step > 1 && (
            <button onClick={handlePrevStep} className="absolute top-2 left-3 text-gray-400 hover:text-white transition-colors text-2xl font-bold">
                &larr;
            </button>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default BookingModal;
