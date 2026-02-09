import React, { useState } from 'react';
import { Copy, FileText, Info } from 'lucide-react';
import { CertificateDisplay } from '../types/certificate';
import { DateUtils } from '../utils/dateUtils';
import { LegendModal } from './LegendModal';

interface CertificateTableProps {
  certificates: CertificateDisplay[];
  onCopyDate: (date: string) => void;
  onShowFormInfo: (cert: CertificateDisplay) => void;
  admissionDate: string;
  signingDate: string;
  dateFormat: string;
}

export const CertificateTable: React.FC<CertificateTableProps> = ({
  certificates,
  onCopyDate,
  onShowFormInfo,
  admissionDate,
  signingDate,
  dateFormat
}) => {
  const [showLegend, setShowLegend] = useState(false);

  const handleCopyDate = (date: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onCopyDate(date);
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return DateUtils.formatDisplayDate(date, dateFormat);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">Certificate Timeline</h2>
            <button
              onClick={() => setShowLegend(true)}
              className="p-1.5 text-blue-100 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Show certificate status legend"
              type="button"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Form</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Start Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Generate Form Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {certificates.map((cert, index) => {
              // Determine styling based on highlight status
              const getRowStyle = () => {
                switch (cert.highlight) {
                  case 'current':
                    return {
                      backgroundColor: '#f0fdf4',
                      borderLeftColor: '#16a34a',
                      borderLeftWidth: '4px'
                    };
                  case 'next':
                    return {
                      backgroundColor: '#fffbeb',
                      borderLeftColor: '#d97706',
                      borderLeftWidth: '4px'
                    };
                  case 'next-urgent':
                    return {
                      backgroundColor: '#fef2f2',
                      borderLeftColor: '#dc2626',
                      borderLeftWidth: '4px'
                    };
                  default:
                    return {
                      backgroundColor: '#ffffff',
                      borderLeftColor: '#e5e7eb',
                      borderLeftWidth: '4px'
                    };
                }
              };

              return (
                <tr
                  key={index}
                  className="cursor-pointer transition-colors duration-150 hover:brightness-95"
                  style={getRowStyle()}
                  data-highlight={cert.highlight}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <span>{cert.type}</span>
                      {cert.highlight === 'current' && (
                        <span className="text-xs font-semibold text-green-600">(CURRENT)</span>
                      )}
                      {(cert.highlight === 'next' || cert.highlight === 'next-urgent') && (
                        <span className={`text-xs font-semibold ${cert.highlight === 'next-urgent' ? 'text-red-600' : 'text-amber-600'}`}>
                          (NEXT)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block">
                      {cert.form}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => handleCopyDate(cert.startCopy, e)}
                      className="group flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      title="Click to copy date as ddmmyyyy format"
                    >
                      <span>{formatDisplayDate(cert.start)}</span>
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => handleCopyDate(cert.expiryCopy, e)}
                      className="group flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      title="Click to copy date as ddmmyyyy format"
                    >
                      <span>{formatDisplayDate(cert.expiry)}</span>
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onShowFormInfo(cert)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View form information"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    <LegendModal isOpen={showLegend} onClose={() => setShowLegend(false)} />
    </>
  );
};