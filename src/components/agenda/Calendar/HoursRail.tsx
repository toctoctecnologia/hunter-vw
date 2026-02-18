import React from 'react';

export const HOURS_24 = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export function HoursRail() {
  return (
    <ul className="w-16">
      {HOURS_24.map(hour => (
        <li
          key={hour}
          className="flex items-start justify-end pr-3 pt-2 border-b border-gray-50 text-sm font-medium text-gray-500"
          style={{ height: 'var(--hour-h)' }}
        >
          {hour}
        </li>
      ))}
    </ul>
  );
}

export default HoursRail;
