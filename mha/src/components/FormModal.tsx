import React from 'react';
import { X, Calendar, Clock, FileText, User } from 'lucide-react';
import { DateUtils } from '../utils/dateUtils';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  admissionDate: string;
  renewalPeriod: string;
  expiryDate: string;
  signingDate: string;
  dateFormat: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  admissionDate,
  renewalPeriod,
  expiryDate,
  signingDate,
  dateFormat
}) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = DateUtils.parseDate(dateStr);
    return DateUtils.formatDisplayDate(date, dateFormat);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Form Information</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Involuntary Admission Date
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 font-mono text-green-800">
                  {formatDate(admissionDate)}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Form Type
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 font-medium text-blue-800">
                  {renewalPeriod}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Expiry Date
                </label>
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 font-mono text-orange-800">
                  {formatDate(expiryDate)}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Signing Date
                </label>
                <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 font-mono text-purple-800">
                  {formatDate(signingDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};