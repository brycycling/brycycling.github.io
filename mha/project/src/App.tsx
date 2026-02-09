import React, { useState } from 'react';
import { Shield, AlertTriangle, Plus, Settings } from 'lucide-react';
import { CalculatorForm } from './components/CalculatorForm';
import { CertificateTable } from './components/CertificateTable';
import { FormModal } from './components/FormModal';
import { CopyNotification } from './components/CopyNotification';
import { SettingsModal, DateFormat } from './components/SettingsModal';
import { FormData, CertificateDisplay } from './types/certificate';
import { MHACertificate } from './utils/mhaCertificate';
import { DateUtils } from './utils/dateUtils';

function App() {
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<FormData>({
    admissionDate: getLocalDateString(),
    signingDate: getLocalDateString(),
    numberOfForms: 10
  });

  const [certificates, setCertificates] = useState<CertificateDisplay[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dateFormat, setDateFormat] = useState<DateFormat>('dd-mmm-yyyy');
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    admissionDate: string;
    renewalPeriod: string;
    expiryDate: string;
    signingDate: string;
  }>({
    isOpen: false,
    admissionDate: '',
    renewalPeriod: '',
    expiryDate: '',
    signingDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validate dates
      const signingDate = DateUtils.parseDate(formData.signingDate);
      const admissionDate = DateUtils.parseDate(formData.admissionDate);

      if (signingDate > new Date()) {
        throw new Error('Signing date cannot be in the future');
      }

      if (admissionDate > signingDate) {
        throw new Error('Admission date cannot be after signing date');
      }

      // Calculate certificates
      const mha = new MHACertificate(formData.admissionDate, formData.signingDate);
      mha.calculateCertificates(formData.numberOfForms);
      const calculatedCertificates = mha.getCertificatesDisplay();
      
      setCertificates(calculatedCertificates);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while calculating certificates');
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDate = async (date: string) => {
    try {
      await navigator.clipboard.writeText(date);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = date;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    }
  };

  const handleShowFormInfo = (cert: CertificateDisplay) => {
    setModalData({
      isOpen: true,
      admissionDate: formData.admissionDate,
      renewalPeriod: cert.form,
      expiryDate: cert.expiry,
      signingDate: formData.signingDate
    });
  };

  const handleCloseModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Calculator Form */}
          <CalculatorForm
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onSettingsClick={() => setShowSettings(true)}
          />

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Calculation Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Results Table */}
          {showResults && certificates.length > 0 && (
            <>
              <CertificateTable
                certificates={certificates}
                onCopyDate={handleCopyDate}
                onShowFormInfo={handleShowFormInfo}
                admissionDate={formData.admissionDate}
                signingDate={formData.signingDate}
                dateFormat={dateFormat}
              />

              {/* Calculate More Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const newCount = formData.numberOfForms + 10;
                    setFormData(prev => ({ ...prev, numberOfForms: newCount }));
                    const mha = new MHACertificate(formData.admissionDate, formData.signingDate);
                    mha.calculateCertificates(newCount);
                    const calculatedCertificates = mha.getCertificatesDisplay();
                    setCertificates(calculatedCertificates);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Calculate 10 More Forms
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Credit */}
        <div className="text-center py-6 text-gray-500 text-sm">
          Bryan Chow © {new Date().getFullYear()}
        </div>

      </div>

      {/* Modal and Notifications */}
      <FormModal
        isOpen={modalData.isOpen}
        onClose={handleCloseModal}
        admissionDate={modalData.admissionDate}
        renewalPeriod={modalData.renewalPeriod}
        expiryDate={modalData.expiryDate}
        signingDate={modalData.signingDate}
        dateFormat={dateFormat}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        dateFormat={dateFormat}
        onDateFormatChange={setDateFormat}
      />

      <CopyNotification show={showCopyNotification} />
    </div>
  );
}

export default App;