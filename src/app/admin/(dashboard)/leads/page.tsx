import React from 'react';
import { AdminService } from '@/services/admin.service';
import LeadsClient from './LeadsClient';

export const revalidate = 0; // Fresh database fetches

export default async function LeadsPage() {
  const enquiries = await AdminService.listEnquiries();

  // Serialize Date objects before passing them to the Client Component
  const serializedLeads = enquiries.map(e => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return (
    <LeadsClient initialLeads={serializedLeads} />
  );
}
