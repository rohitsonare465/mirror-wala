'use client';

import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  Lock, 
  Unlock, 
  RefreshCw,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { toggleUserBlockStateAction } from '@/actions/admin';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  createdAt: Date;
  ordersCount: number;
  isBlocked: boolean;
}

interface CustomersClientProps {
  initialCustomers: Customer[];
}

export default function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Search logic
  const filteredCustomers = initialCustomers.filter(customer => {
    const term = searchTerm.toLowerCase();
    const nameMatch = customer.name?.toLowerCase().includes(term) || false;
    const emailMatch = customer.email?.toLowerCase().includes(term) || false;
    const phoneMatch = customer.phone?.includes(term) || false;
    return nameMatch || emailMatch || phoneMatch;
  });

  const handleToggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    setTogglingId(userId);
    const targetState = !currentlyBlocked;
    const actionText = targetState ? 'Block' : 'Unblock';

    try {
      await toggleUserBlockStateAction(userId, targetState);
      toast.success(
        `User accounts has been successfully ${targetState ? 'suspended' : 're-activated'}.`,
        `Customer ${actionText}ed`
      );
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle client access state.', 'Database Error');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">User Directory</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Customer Database</h1>
          <p className="text-xs text-stone-400 mt-0.5">Audit registered client accounts, transaction histories, and toggle system block states.</p>
        </div>
      </div>

      {/* Filter and search panel */}
      <div className="bg-stone-900 border border-stone-850 p-4 rounded-md shadow-md flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search clients by name, email, or telephone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-200 focus:border-amber-500 outline-none placeholder-stone-600 font-sans"
          />
        </div>
      </div>

      {/* Main Customers List */}
      <div className="bg-stone-900 border border-stone-850 rounded-md shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-850 bg-stone-950/40 select-none text-[9px] uppercase tracking-wider text-stone-400 font-extrabold">
                <th className="p-4 pl-6">Client Profile</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-center">Fulfillment Counts</th>
                <th className="p-4">System Role</th>
                <th className="p-4 text-right pr-6">Access State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850/60 font-sans text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-stone-500 font-sans">
                    No customers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr 
                    key={customer.id} 
                    className={`hover:bg-stone-850/20 transition-colors ${customer.isBlocked ? 'bg-red-950/5' : ''}`}
                  >
                    {/* User profile info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${customer.isBlocked ? 'border-red-900/50 bg-red-950/30 text-red-400' : 'border-stone-800 bg-stone-950 text-stone-300'}`}>
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <span className={`font-serif text-sm font-bold block ${customer.isBlocked ? 'text-stone-400 line-through' : 'text-white'}`}>
                            {customer.name || 'Anonymous Guest'}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono block mt-0.5">ID: {customer.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-stone-300">
                          <Mail className="h-3 w-3 text-stone-500" />
                          <span>{customer.email || 'N/A'}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                            <Phone className="h-3 w-3 text-stone-600" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="p-4 text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-stone-600" />
                        <span>{new Date(customer.createdAt).toLocaleDateString('default', { dateStyle: 'medium' })}</span>
                      </div>
                    </td>

                    {/* Orders count */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-950 border border-stone-850 text-stone-300">
                        <ShoppingBag className="h-3 w-3 text-amber-400" />
                        <span className="font-extrabold font-mono text-[11px]">{customer.ordersCount}</span>
                      </div>
                    </td>

                    {/* System Role */}
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest ${
                        customer.role === 'ADMIN' 
                          ? 'bg-amber-300/10 border border-amber-300/20 text-amber-300' 
                          : 'bg-stone-950 border border-stone-800 text-stone-400'
                      }`}>
                        {customer.role}
                      </span>
                    </td>

                    {/* Access state toggles */}
                    <td className="p-4 text-right pr-6">
                      {customer.role === 'ADMIN' ? (
                        <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-amber-300/60 bg-amber-400/5 px-2.5 py-1 rounded-sm border border-amber-400/10">
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Protected Super Admin
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleBlock(customer.id, customer.isBlocked)}
                          disabled={togglingId === customer.id}
                          className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest px-3 py-2 rounded-sm border transition-all duration-300 cursor-pointer ${
                            customer.isBlocked 
                              ? 'border-red-900/40 bg-red-950/20 text-red-400 hover:bg-red-400 hover:text-stone-950' 
                              : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-red-400 hover:border-red-500/20'
                          }`}
                        >
                          {togglingId === customer.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : customer.isBlocked ? (
                            <>
                              <Lock className="h-3 w-3" /> Unban Client
                            </>
                          ) : (
                            <>
                              <Unlock className="h-3 w-3" /> Block Client
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
