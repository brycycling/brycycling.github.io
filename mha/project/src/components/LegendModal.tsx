import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegendModal: React.FC<LegendModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Certificate Status Legend</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close legend"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">


            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-50 rounded border-l-4 border-green-500 flex-shrink-0 mt-0.5"></div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Current Period</h3>
                <p className="text-sm text-gray-600">
                  The certificate period that the signing date falls within. This is the currently active certificate.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-50 rounded border-l-4 border-amber-500 flex-shrink-0 mt-0.5"></div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Next Period</h3>
                <p className="text-sm text-gray-600">
                  The certificate period immediately following the current period. More than 7 days remaining in the current period.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-50 rounded border-l-4 border-red-500 flex-shrink-0 mt-0.5"></div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Next Period (Expires in 7 Days)</h3>
                <p className="text-sm text-gray-600">
                  The next certificate period when the current period expires within 7 days. Urgent action required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
