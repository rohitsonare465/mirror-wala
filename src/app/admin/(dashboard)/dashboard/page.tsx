import React from 'react';
import { getDashboardAnalyticsAction } from '@/actions/admin';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  PhoneCall, 
  ArrowUpRight 
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable static caching so it always fetches fresh DB records

export default async function DashboardPage() {
  // Fetch real-time analytics from database using server action
  let analytics;
  let errorMsg = '';
  
  try {
    analytics = await getDashboardAnalyticsAction();
  } catch (err: any) {
    console.error('Failed to load dashboard data:', err);
    errorMsg = err.message || 'Unable to retrieve real-time catalog analytics.';
  }

  // Fallbacks if DB query fails or has no seeds
  const stats = analytics || {
    totalSales: 0,
    netRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    whatsappLeads: 0,
    totalEnquiries: 0,
    monthlySales: [],
    recentOrders: [],
    topProducts: [],
  };

  // Format currency helper
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">System Intelligence</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Atelier Operations</h1>
          <p className="text-xs text-stone-400 mt-0.5">Real-time metrics, order execution, and luxury custom leads.</p>
        </div>
        <div className="text-stone-400 text-xs bg-stone-900 border border-stone-850 px-4 py-2 rounded-md font-mono select-none">
          Live Connection Established
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-950/20 border border-red-900/40 text-red-300 p-4 rounded text-xs">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Gross Sales */}
        <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-lg flex flex-col justify-between group hover:border-amber-400/30 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Gross Sales</p>
              <h3 className="text-2xl font-serif font-black text-white mt-2">{formatINR(stats.totalSales)}</h3>
            </div>
            <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-850/60 flex items-center justify-between text-[10px] text-stone-400">
            <span>Delivered & Pending</span>
            <span className="text-amber-300 font-bold">Total revenue</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-lg flex flex-col justify-between group hover:border-amber-400/30 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Total Orders</p>
              <h3 className="text-2xl font-serif font-black text-white mt-2">{stats.totalOrders}</h3>
            </div>
            <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-850/60 flex items-center justify-between text-[10px] text-stone-400">
            <span>Customer checkouts</span>
            <Link href="/admin/orders" className="text-amber-300 hover:text-white font-bold flex items-center gap-0.5">
              Manage <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-lg flex flex-col justify-between group hover:border-amber-400/30 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Customers Base</p>
              <h3 className="text-2xl font-serif font-black text-white mt-2">{stats.totalUsers}</h3>
            </div>
            <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-850/60 flex items-center justify-between text-[10px] text-stone-400">
            <span>Atelier client profiles</span>
            <Link href="/admin/customers" className="text-amber-300 hover:text-white font-bold flex items-center gap-0.5">
              Review <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Catalog Items */}
        <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-lg flex flex-col justify-between group hover:border-amber-400/30 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Catalog Products</p>
              <h3 className="text-2xl font-serif font-black text-white mt-2">{stats.totalProducts}</h3>
            </div>
            <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-850/60 flex items-center justify-between text-[10px] text-stone-400">
            <span>Premium mirror variants</span>
            <Link href="/admin/products" className="text-amber-300 hover:text-white font-bold flex items-center gap-0.5">
              Edit Catalog <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* Leads and Interactivity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WhatsApp & custom lead metrics */}
        <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-lg flex flex-col justify-between lg:col-span-1">
          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-amber-300" />
            Client Inbound Channels
          </h4>
          <div className="flex flex-col gap-4">
            <div className="bg-stone-950 p-4 rounded border border-stone-850 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-500 font-extrabold">WhatsApp Inquiries</p>
                <h5 className="text-lg font-black text-white mt-1">{stats.whatsappLeads}</h5>
              </div>
              <div className="h-8 w-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <PhoneCall className="h-4.5 w-4.5" />
              </div>
            </div>
            
            <div className="bg-stone-950 p-4 rounded border border-stone-850 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-500 font-extrabold">Bespoke Design Requests</p>
                <h5 className="text-lg font-black text-white mt-1">{stats.totalEnquiries}</h5>
              </div>
              <div className="h-8 w-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>
          <Link
            href="/admin/leads"
            className="w-full text-center bg-stone-850 hover:bg-stone-800 text-stone-300 border border-stone-800 text-[10px] font-extrabold uppercase tracking-widest py-3.5 rounded mt-4 block transition-colors"
          >
            Review leads inbox
          </Link>
        </div>

        {/* Visual Sales Chart (Modern responsive SVG bar layout) */}
        <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-lg lg:col-span-2">
          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-300" />
            Monthly Sales Progression
          </h4>
          
          {stats.monthlySales.length === 0 ? (
            <div className="h-44 flex items-center justify-center bg-stone-950/40 border border-stone-850/60 rounded text-stone-500 text-xs">
              No sales history logged in the current billing period.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="h-48 flex items-end justify-between gap-3 pt-6 bg-stone-950/40 p-4 rounded border border-stone-850">
                {stats.monthlySales.map((entry: any, index: number) => {
                  const maxSale = Math.max(...stats.monthlySales.map((s: any) => s.sales), 1);
                  const barHeight = `${(entry.sales / maxSale) * 100}%`;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative">
                      {/* Tooltip showing amount */}
                      <div className="absolute bottom-full mb-2 bg-stone-900 border border-stone-750 text-amber-300 text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono shadow-2xl pointer-events-none z-10">
                        {formatINR(entry.sales)}
                      </div>
                      
                      {/* Interactive visual bar */}
                      <div 
                        style={{ height: barHeight }} 
                        className="w-full bg-gradient-to-t from-amber-400/80 to-yellow-500 rounded-t group-hover:from-white group-hover:to-amber-300 transition-all duration-500"
                      />
                      
                      <span className="text-[8px] uppercase tracking-wider text-stone-500 font-extrabold mt-2 truncate max-w-full">
                        {entry.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Detailed Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Orders log */}
        <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-300" />
              Recent Showroom Checkouts
            </h4>
            <Link href="/admin/orders" className="text-amber-300 hover:text-white text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-0.5">
              All Orders <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs bg-stone-950/40 border border-stone-850 rounded">
              No client purchases recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-850 text-[9px] uppercase tracking-widest text-stone-500 font-extrabold">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850/40 text-xs">
                  {stats.recentOrders.map((order: any) => {
                    let statusColor = 'text-amber-400 bg-amber-400/5';
                    if (order.orderStatus === 'Delivered') statusColor = 'text-emerald-400 bg-emerald-400/5';
                    if (order.orderStatus === 'Cancelled') statusColor = 'text-red-400 bg-red-400/5';
                    
                    return (
                      <tr key={order.id} className="hover:bg-stone-850/10">
                        <td className="py-3.5 font-mono text-[11px] text-stone-300 font-bold">{order.orderNumber}</td>
                        <td className="py-3.5">
                          <p className="text-white font-medium">{order.customerName}</p>
                          <p className="text-[10px] text-stone-500 truncate max-w-[150px]">{order.customerEmail}</p>
                        </td>
                        <td className="py-3.5 font-mono text-stone-300 font-bold">{formatINR(order.totalAmount)}</td>
                        <td className="py-3.5 text-right">
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-extrabold rounded border border-current ${statusColor}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products Grid */}
        <div className="bg-stone-900 border border-stone-850 p-6 rounded-md shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Top Custom Mirror Designs
            </h4>
            <Link href="/admin/products" className="text-amber-300 hover:text-white text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-0.5">
              Edit Catalog <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.topProducts.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs bg-stone-950/40 border border-stone-850 rounded">
              No catalog product analytics recorded.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {stats.topProducts.map((prod: any, idx: number) => {
                return (
                  <div key={prod.id} className="bg-stone-950/40 p-4 rounded border border-stone-850 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-amber-300 w-4">#0{idx + 1}</span>
                      <div>
                        <p className="text-xs font-bold text-white font-serif">{prod.name}</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">Quantity Sold: {prod.quantitySold} units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-amber-400">{formatINR(prod.revenue)}</p>
                      <p className="text-[9px] text-stone-500 uppercase tracking-widest font-extrabold mt-0.5">Revenue Generated</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
