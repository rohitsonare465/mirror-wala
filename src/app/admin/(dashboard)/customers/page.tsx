import React from 'react';
import { AdminService } from '@/services/admin.service';
import CustomersClient from './CustomersClient';

export const revalidate = 0; // Fresh database fetches

export default async function CustomersPage() {
  const customers = await AdminService.getCustomersList();

  return (
    <CustomersClient initialCustomers={customers} />
  );
}
