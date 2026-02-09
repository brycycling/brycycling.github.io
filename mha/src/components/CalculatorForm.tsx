import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Calculator, Info, Settings } from 'lucide-react';
import { FormData } from '../types/certificate';

interface CalculatorFormProps {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  onSettingsClick: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  isLoading = false,
  onSettingsClick
}) => {
  const [showAdmissionInfo, setShowAdmissionInfo] = useState(false);
  const [showSigningInfo, setShowSigningInfo] = useState(false);
  const admissionInfoRef = useRef<HTMLDivElement>(null);
  const signingInfoRef = useRef<HTMLDivElement>(null);

  const handleAdmissionDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const admissionDate = e.target.value;
    onFormDataChange({
      ...formData,
      admissionDate,
      // Auto-sync signing date when admission date changes
      // signingDate: admissionDate || formData.signingDate
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (admissionInfoRef.current && !admissionInfoRef.current.contains(event.target as Node)) {
        setShowAdmissionInfo(false);
      }
      if (signingInfoRef.current && !signingInfoRef.current.contains(event.target as Node)) {
        setShowSigningInfo(false);
      }
    };

    if (showAdmissionInfo || showSigningInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdmissionInfo, showSigningInfo]);

  const today = new Date();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
      <button
        onClick={onSettingsClick}
        className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open settings"
        type="button"
      >
        <Settings className="w-5 h-5" />
      </button>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BC MHA Certificate Calculator</h1>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="admissionDate" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Involuntary Admission Date</span>
              <div className="relative flex items-center" ref={admissionInfoRef}>
                <button
                  type="button"
                  onClick={() => setShowAdmissionInfo(!showAdmissionInfo)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex items-center"
                  aria-label="More information about admission date"
                >
                  <Info className="w-4 h-4" />
                </button>
                {showAdmissionInfo && (
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-64 whitespace-normal">
                    Date of involuntary admission to designated facility (MM/DD/YYYY)
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </label>
            <input
              type="date"
              id="admissionDate"
              value={formData.admissionDate}
              onChange={handleAdmissionDateChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-gray-50 hover:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signingDate" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Signing Date</span>
              <div className="relative flex items-center" ref={signingInfoRef}>
                <button
                  type="button"
                  onClick={() => setShowSigningInfo(!showSigningInfo)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex items-center"
                  aria-label="More information about signing date"
                >
                  <Info className="w-4 h-4" />
                </button>
                {showSigningInfo && (
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-64 whitespace-normal">
                    Date of signing certificate, usually today's date (MM/DD/YYYY)
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </label>
            <input
              type="date"
              id="signingDate"
              value={formData.signingDate}
              onChange={(e) => onFormDataChange({...formData, signingDate: e.target.value})}
              max={today}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-gray-50 hover:bg-white"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          <Calculator className="w-5 h-5" />
          {isLoading ? 'Calculating...' : 'Calculate Certificates'}
        </button>
      </form>
    </div>
  );
};