import { Certificate } from '../types/certificate';
import { DateUtils } from './dateUtils';

/**
 * Certificate Generator - Creates different types of MHA certificates
 * Each method handles the specific logic for different certificate types
 */
export class CertificateGenerator {
  /**
   * Form 4.1 - Initial certificate (48 hours from admission)
   */
  static createInitialCertificate(admissionDate: Date): Certificate {
    const expiry = new Date(admissionDate);
    expiry.setHours(expiry.getHours() + 48);

    return {
      type: 'Initial',
      form: 'Form 4.1',
      start: admissionDate,
      expiry: expiry
    };
  }

  /**
   * Form 4.2 - Second certificate (expires one month minus one day from admission)
   */
  static createSecondCertificate(admissionDate: Date): Certificate {
    const form42End = DateUtils.findEndDate(admissionDate, 1);

    return {
      type: 'Second',
      form: 'Form 4.2',
      start: admissionDate,
      expiry: form42End
    };
  }

  /**
   * Form 6 (1 month) - First renewal certificate
   */
  static createFirstRenewal(admissionDate: Date): Certificate {
    const form42End = DateUtils.findEndDate(admissionDate, 1);
    const form6_1moStart = new Date(form42End);
    form6_1moStart.setDate(form6_1moStart.getDate() + 1);
    const form6_1moEnd = DateUtils.findEndDate(form6_1moStart, 1);

    return {
      type: 'First Renewal',
      form: 'Form 6 (1 month)',
      start: form6_1moStart,
      expiry: form6_1moEnd
    };
  }

  /**
   * Form 6 (3 months) - Second renewal certificate
   */
  static createSecondRenewal(admissionDate: Date): Certificate {
    const form42End = DateUtils.findEndDate(admissionDate, 1);
    const form6_1moStart = new Date(form42End);
    form6_1moStart.setDate(form6_1moStart.getDate() + 1);
    const form6_1moEnd = DateUtils.findEndDate(form6_1moStart, 1);
    const form6_3moStart = new Date(form6_1moEnd);
    form6_3moStart.setDate(form6_3moStart.getDate() + 1);
    const form6_3moEnd = DateUtils.findEndDate(form6_3moStart, 3);

    return {
      type: 'Second Renewal',
      form: 'Form 6 (3 months)',
      start: form6_3moStart,
      expiry: form6_3moEnd
    };
  }

  /**
   * Form 6 (6 months) - Subsequent renewal certificates
   * Returns both the certificate and the next start date for chaining
   */
  static createSixMonthRenewal(
    renewalNumber: number,
    startDate: Date
  ): { certificate: Certificate; nextStartDate: Date } {
    const currentEnd = DateUtils.findEndDate(startDate, 6);
    const sixMonthsFromStart = new Date(currentEnd);
    sixMonthsFromStart.setDate(sixMonthsFromStart.getDate() + 1);

    return {
      certificate: {
        type: `Renewal ${renewalNumber}`,
        form: 'Form 6 (6 months)',
        start: startDate,
        expiry: currentEnd
      },
      nextStartDate: sixMonthsFromStart
    };
  }

  /**
   * Generate all initial certificates (Forms 4.1, 4.2, and first two renewals)
   */
  static generateInitialCertificates(admissionDate: Date): Certificate[] {
    return [
      this.createInitialCertificate(admissionDate),
      this.createSecondCertificate(admissionDate),
      this.createFirstRenewal(admissionDate),
      this.createSecondRenewal(admissionDate)
    ];
  }

  /**
   * Generate subsequent 6-month renewal certificates
   */
  static generateSixMonthRenewals(
    startDate: Date,
    count: number,
    startingRenewalNumber: number = 3
  ): Certificate[] {
    const certificates: Certificate[] = [];
    let currentStartDate = startDate;

    for (let i = 0; i < count; i++) {
      const renewalNumber = startingRenewalNumber + i;
      const { certificate, nextStartDate } = this.createSixMonthRenewal(
        renewalNumber,
        currentStartDate
      );

      certificates.push(certificate);
      currentStartDate = nextStartDate;
    }

    return certificates;
  }
}