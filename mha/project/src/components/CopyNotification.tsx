import React from 'react';
import { Check } from 'lucide-react';

interface CopyNotificationProps {
  show: boolean;
}

export const CopyNotification: React.FC<CopyNotificationProps> = ({ show }) => {
  return (
    <div className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
    }`}>
      <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <Check className="w-4 h-4" />
        <span className="font-medium">Date copied to clipboard!</span>
      </div>
    </div>
  );
};