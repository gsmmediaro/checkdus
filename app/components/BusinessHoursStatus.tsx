'use client';

import { useState, useEffect } from 'react';

export default function BusinessHoursStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [nextChange, setNextChange] = useState('');

  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const time = hour + minute / 60;

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      setCurrentDay(days[day]);

      // Check if open (Mon-Sat: 9:30 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM)
      if (day === 0) { // Sunday
        const open = time >= 10 && time < 17;
        setIsOpen(open);
        if (open) {
          setNextChange('Closes at 5:00 PM');
        } else if (time < 10) {
          setNextChange('Opens at 10:00 AM');
        } else {
          setNextChange('Opens Monday at 9:30 AM');
        }
      } else { // Monday-Saturday
        const open = time >= 9.5 && time < 19;
        setIsOpen(open);
        if (open) {
          setNextChange('Closes at 7:00 PM');
        } else if (time < 9.5) {
          setNextChange('Opens at 9:30 AM');
        } else {
          setNextChange(day === 6 ? 'Opens Sunday at 10:00 AM' : 'Opens tomorrow at 9:30 AM');
        }
      }
    };

    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
      isOpen
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      <span>{isOpen ? 'Open Now' : 'Closed'}</span>
      <span className="text-xs opacity-75">• {nextChange}</span>
    </div>
  );
}
