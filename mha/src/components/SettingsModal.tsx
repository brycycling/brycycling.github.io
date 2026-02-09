import React, { useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export type DateFormat = 'dd-mmm-yyyy' | 'dd/mm/yyyy' | 'mmmm d, yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd' | 'd mmm yyyy';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateFormat: DateFormat;
  onDateFormatChange: (format: DateFormat) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  dateFormat,
  onDateFormatChange
}) => {
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

  const sampleDate = new Date(2024, 11, 25);

  const formatOptions: { value: DateFormat; label: string; example: string }[] = [
    { value: 'dd/mm/yyyy', label: 'dd/mm/yyyy', example: '25/12/2024' },
    { value: 'dd-mmm-yyyy', label: 'dd-mmm-yyyy', example: '25-Dec-2024' },
    { value: 'mmmm d, yyyy', label: 'mmmm d, yyyy', example: 'December 25, 2024' },
    { value: 'mm/dd/yyyy', label: 'mm/dd/yyyy', example: '12/25/2024' },
    { value: 'yyyy-mm-dd', label: 'yyyy-mm-dd', example: '2024-12-25' },
    { value: 'd mmm yyyy', label: 'd mmm yyyy', example: '25 Dec 2024' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Date Format</h3>
            <div className="space-y-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onDateFormatChange(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                    dateFormat === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{option.example}</span>
                  {dateFormat === option.value && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
