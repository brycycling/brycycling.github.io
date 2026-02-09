import { Certificate, CertificateDisplay } from '../types/certificate';
import { DateUtils } from './dateUtils';
import { CertificateGenerator } from './certificateGenerator';

/**
 * Main MHA Certificate Calculator
 * Orchestrates the generation and management of all certificate types
 */
export class MHACertificate {
  private admissionDate: Date;
  private signingDate: Date;
  private certificates: Certificate[] = [];

  constructor(admissionDate: string, signingDate: string) {
    this.admissionDate = DateUtils.parseDate(admissionDate);
    this.signingDate = DateUtils.parseDate(signingDate);
    this.validateDates();
  }

  /**
   * Validate that the provided dates are logical
   */
  private validateDates(): void {
    if (this.signingDate > new Date()) {
      throw new Error('Signing date cannot be in the future');
    }

    if (this.admissionDate > this.signingDate) {
      throw new Error('Admission date cannot be after signing date');
    }
  }

  /**
   * Calculate all certificates based on the number of forms requested
   * Automatically generates enough certificates to include current and next renewals
   */
  calculateCertificates(numberOfForms: number = 10): void {
    if (numberOfForms < 1 || numberOfForms > 200) {
      throw new Error('Number of forms must be between 1 and 200');
    }

    this.certificates = [];

    // Generate the initial 4 certificates (Forms 4.1, 4.2, and first two renewals)
    this.certificates.push(CertificateGenerator.createInitialCertificate(this.admissionDate));
    this.certificates.push(CertificateGenerator.createSecondCertificate(this.admissionDate));
    this.certificates.push(CertificateGenerator.createFirstRenewal(this.admissionDate));
    this.certificates.push(CertificateGenerator.createSecondRenewal(this.admissionDate));

    // Check if current period is in the initial 4 certificates
    let foundCurrent = false;
    let currentIndex = -1;

    for (let i = 0; i < this.certificates.length; i++) {
      const cert = this.certificates[i];
      const startDate = new Date(cert.start.getTime());
      startDate.setHours(0, 0, 0, 0);
      const expiryDate = new Date(cert.expiry.getTime());
      expiryDate.setHours(23, 59, 59, 999);
      const signingDateOnly = new Date(this.signingDate.getTime());
      signingDateOnly.setHours(12, 0, 0, 0);

      if (signingDateOnly >= startDate && signingDateOnly <= expiryDate) {
        foundCurrent = true;
        currentIndex = i;
        break;
      }
    }

    // Generate additional 6-month renewals
    const lastCert = this.certificates[this.certificates.length - 1];
    let currentStart = new Date(lastCert.expiry);
    currentStart.setDate(currentStart.getDate() + 1);
    let renewalIndex = 3;

    // Keep generating until we have enough forms AND we've found current + next
    while (this.certificates.length < numberOfForms || !foundCurrent || (foundCurrent && this.certificates.length <= currentIndex + 1)) {
      // Safety limit to prevent infinite loops
      if (this.certificates.length >= 200) {
        break;
      }

      const { certificate, nextStartDate } = CertificateGenerator.createSixMonthRenewal(renewalIndex, currentStart);
      this.certificates.push(certificate);
      currentStart = nextStartDate;
      renewalIndex++;

      // Check if this certificate contains the signing date
      if (!foundCurrent) {
        const startDate = new Date(certificate.start.getTime());
        startDate.setHours(0, 0, 0, 0);
        const expiryDate = new Date(certificate.expiry.getTime());
        expiryDate.setHours(23, 59, 59, 999);
        const signingDateOnly = new Date(this.signingDate.getTime());
        signingDateOnly.setHours(12, 0, 0, 0);

        if (signingDateOnly >= startDate && signingDateOnly <= expiryDate) {
          foundCurrent = true;
          currentIndex = this.certificates.length - 1;
        }
      }
    }
  }

  /**
   * Get certificates formatted for display in the UI
   */
  getCertificatesDisplay(): CertificateDisplay[] {
    const result: CertificateDisplay[] = [];
    let currentPeriodIndex = -1;

    // Find which period the signing date falls into
    for (let i = 0; i < this.certificates.length; i++) {
      const cert = this.certificates[i];
      const startDate = new Date(cert.start.getTime());
      startDate.setHours(0, 0, 0, 0);
      const expiryDate = new Date(cert.expiry.getTime());
      expiryDate.setHours(23, 59, 59, 999);
      const signingDateOnly = new Date(this.signingDate.getTime());
      signingDateOnly.setHours(12, 0, 0, 0);

      if (signingDateOnly >= startDate && signingDateOnly <= expiryDate) {
        currentPeriodIndex = i;
        break;
      }
    }

    for (let i = 0; i < this.certificates.length; i++) {
      const cert = this.certificates[i];
      let highlight: 'current' | 'next' | 'next-urgent' | 'none' = 'none';

      if (i === currentPeriodIndex) {
        highlight = 'current';
      } else if (i === currentPeriodIndex + 1) {
        // Next period - check if less than 1 week left in current period
        if (currentPeriodIndex >= 0) {
          const currentCert = this.certificates[currentPeriodIndex];
          const expiryDate = new Date(currentCert.expiry.getTime());
          expiryDate.setHours(23, 59, 59, 999);
          const signingDateOnly = new Date(this.signingDate.getTime());
          signingDateOnly.setHours(12, 0, 0, 0);

          const daysToExpiry = Math.ceil((expiryDate.getTime() - signingDateOnly.getTime()) / (1000 * 60 * 60 * 24));

          if (daysToExpiry <= 7) {
            highlight = 'next-urgent';
          } else {
            highlight = 'next';
          }
        } else {
          highlight = 'next';
        }
      }

      result.push({
        type: cert.type,
        form: cert.form,
        start: DateUtils.formatDisplayDate(cert.start),
        startCopy: DateUtils.formatCopyDate(cert.start),
        expiry: DateUtils.formatDisplayDate(cert.expiry),
        expiryCopy: DateUtils.formatCopyDate(cert.expiry),
        highlight
      });
    }

    return result;
  }

  /**
   * Get the currently active certificate (if any)
   */
  getActiveCertificate(): Certificate | null {
    for (const cert of this.certificates) {
      const startDate = new Date(cert.start.getTime());
      startDate.setHours(0, 0, 0, 0);
      const expiryDate = new Date(cert.expiry.getTime());
      expiryDate.setHours(23, 59, 59, 999);
      const signingDateOnly = new Date(this.signingDate.getTime());
      signingDateOnly.setHours(12, 0, 0, 0);

      if (signingDateOnly >= startDate && signingDateOnly <= expiryDate) {
        return cert;
      }
    }
    return null;
  }
}