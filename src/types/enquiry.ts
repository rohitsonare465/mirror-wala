import { CustomMirrorConfig } from './custom-mirror';

export type EnquiryType = 'GENERAL' | 'CUSTOM_QUOTE' | 'BULK_ORDER' | 'COLLABORATION';

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'CLOSED';

export interface CustomMirrorQuoteLead {
  config: CustomMirrorConfig;
  imageUrlReference?: string; // Client-uploaded inspiration photo URL
  estimatedPrice?: number;
}

export interface Enquiry {
  id: string;
  type: EnquiryType;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  adminNotes: string | null;
  customMirrorLead: CustomMirrorQuoteLead | null; // Nullable if general enquiry
  createdAt: Date;
  updatedAt: Date;
}
