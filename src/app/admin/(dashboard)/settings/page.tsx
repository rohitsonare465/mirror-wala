import React from 'react';
import { AdminService } from '@/services/admin.service';
import SettingsClient from './SettingsClient';

export const revalidate = 0; // Fresh database fetches

export default async function SettingsPage() {
  const paymentRecord = await AdminService.getHomepageCMS('payment_settings');
  const detailsRecord = await AdminService.getHomepageCMS('business_details');

  const initialPaymentSettings = paymentRecord?.value || null;
  const initialBusinessDetails = detailsRecord?.value || null;

  return (
    <SettingsClient 
      initialPaymentSettings={initialPaymentSettings} 
      initialBusinessDetails={initialBusinessDetails} 
    />
  );
}
