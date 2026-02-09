export interface Certificate {
  type: string;
  form: string;
  start: Date;
  expiry: Date;
  highlight?: boolean;
  nearExpiry?: boolean;
}

export interface CertificateDisplay {
  type: string;
  form: string;
  start: string;
  startCopy: string;
  expiry: string;
  expiryCopy: string;
  highlight: 'current' | 'next' | 'next-urgent' | 'none';
}

export interface FormData {
  admissionDate: string;
  signingDate: string;
  numberOfForms: number;
}