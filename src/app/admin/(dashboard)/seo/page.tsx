import React from 'react';
import { AdminService } from '@/services/admin.service';
import SeoClient from './SeoClient';

export const revalidate = 0; // Fresh database fetches

export default async function SeoPage() {
  const globalSeoRecord = await AdminService.getHomepageCMS('seo:global');
  const homeSeoRecord = await AdminService.getHomepageCMS('seo:home');

  const initialGlobalSeo = globalSeoRecord?.value || null;
  const initialHomeSeo = homeSeoRecord?.value || null;

  return (
    <SeoClient 
      initialGlobalSeo={initialGlobalSeo} 
      initialHomeSeo={initialHomeSeo} 
    />
  );
}
