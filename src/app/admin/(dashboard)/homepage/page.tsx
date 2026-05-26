import React from 'react';
import { AdminService } from '@/services/admin.service';
import HomepageClient from './HomepageClient';

export const revalidate = 0; // Fresh database fetches

export default async function HomepagePage() {
  const contentRecord = await AdminService.getHomepageCMS('homepage_cms');
  
  // Parse or pass initial data
  const initialContent = contentRecord?.value || null;

  return (
    <HomepageClient initialContent={initialContent} />
  );
}
