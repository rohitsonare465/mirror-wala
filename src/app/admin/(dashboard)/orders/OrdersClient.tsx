'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Check, 
  MapPin, 
  Phone, 
  Mail,
  User as UserIcon,
  Tag,
  CreditCard,
  RefreshCw 
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { updateOrderStatusAction } from '@/actions/admin';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  phone: string | null;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  customizationDetails: string | null;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  method: string;
  paymentGatewayId: string | null;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
  items: OrderItem[];
  payment: Payment | null;
  user: User | null;
  shippingAddress: ShippingAddress | null;
}

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const router = useRouter();
  const toast = useToast();

  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Order Modal
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Filters Calculation
  const filteredOrders = useMemo(() => {
    return initialOrders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || order.orderStatus === selectedStatus;
      const matchesPayment = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [initialOrders, searchTerm, selectedStatus, selectedPaymentStatus]);

  // Pagination bounds
  const totalPages = Math.max(Math.ceil(filteredOrders.length / itemsPerPage), 1);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Format currency helper
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Change Status
  const handleStatusChange = async (orderId: string, newStatus: any) => {
    setIsUpdatingStatus(orderId);
    try {
      await updateOrderStatusAction(orderId, newStatus);
      toast.success(`Successfully updated order to: ${newStatus}`, 'Status Updated');
      
      // Update local state if displaying detailed modal
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      }

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status.');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Render specifications beautifully
  const renderCustomizationDetails = (detailsStr: string | null) => {
    if (!detailsStr) return 'Standard specs';
    try {
      const specs = JSON.parse(detailsStr);
      const parts = [];
      if (specs.size) parts.push(`Size: ${specs.size}`);
      if (specs.ledColor && specs.ledColor !== 'NONE') parts.push(`LED: ${specs.ledColor}`);
      if (specs.edgeStyle) parts.push(`Edge: ${specs.edgeStyle}`);
      if (specs.shape) parts.push(`Shape: ${specs.shape}`);
      
      if (specs.features && Array.isArray(specs.features) && specs.features.length > 0) {
        parts.push(`Features: ${specs.features.join(', ')}`);
      }

      return parts.length > 0 ? parts.join(' | ') : detailsStr;
    } catch {
      return detailsStr; // Return raw string if not JSON
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold font-sans">Business Transactions</span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Orders Desk</h1>
          <p className="text-xs text-stone-400 mt-0.5">Fulfill custom mirror orders, update packaging status, and print receipts.</p>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-stone-500 font-extrabold font-mono bg-stone-900 border border-stone-850 px-4 py-3 rounded">
          Total Orders Count: {initialOrders.length}
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-stone-900 border border-stone-850 p-4 rounded-md shadow-xl flex flex-col md:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, client name, or email..."
            className="w-full bg-stone-950 border border-stone-800 rounded p-3 pl-10 text-xs text-stone-200 focus:border-amber-500 outline-none"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-300 focus:border-amber-500 outline-none cursor-pointer font-mono"
          >
            <option value="all">All Fulfillments</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="OutForDelivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded p-3 text-xs text-stone-300 focus:border-amber-500 outline-none cursor-pointer font-mono"
          >
            <option value="all">All Payments</option>
            <option value="PENDING">Pending</option>
            <option value="AUTHORIZED">Authorized</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-stone-900 border border-stone-850 rounded-md shadow-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-stone-500 text-xs">
            No checkout logs matched your active search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-950 border-b border-stone-850 text-[9px] uppercase tracking-widest text-stone-500 font-extrabold">
                  <th className="p-4 pl-6">Order Number</th>
                  <th className="p-4">Checkout Date</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4 text-center">Payment Status</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 text-right pr-6">Atelier Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-850/50 text-xs">
                {paginatedOrders.map(order => {
                  let statusBg = 'text-amber-400 bg-amber-400/5 border-amber-400/10';
                  if (order.orderStatus === 'Delivered') statusBg = 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10';
                  if (order.orderStatus === 'Cancelled') statusBg = 'text-red-400 bg-red-400/5 border-red-400/10';

                  let paymentBg = 'text-amber-400';
                  if (order.paymentStatus === 'PAID') paymentBg = 'text-emerald-400';
                  if (order.paymentStatus === 'FAILED') paymentBg = 'text-red-400';

                  return (
                    <tr key={order.id} className="hover:bg-stone-850/10 transition-colors">
                      {/* Order Number */}
                      <td className="p-4 pl-6 font-mono text-[11px] text-white font-bold select-all">
                        {order.orderNumber}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Customer Name */}
                      <td className="p-4">
                        <p className="text-white font-medium">{order.user?.name || 'Guest Checkout'}</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">{order.user?.email || 'N/A'}</p>
                      </td>

                      {/* Total Price */}
                      <td className="p-4 font-mono font-bold text-stone-200">
                        {formatINR(order.totalAmount)}
                      </td>

                      {/* Payment Status */}
                      <td className="p-4 text-center">
                        <span className={`font-black uppercase tracking-widest text-[9px] ${paymentBg}`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-[8px] text-stone-600 block mt-0.5">{order.paymentMethod}</span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="p-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={isUpdatingStatus === order.id}
                          className={`bg-stone-950 border border-stone-800 text-[10px] font-extrabold uppercase tracking-widest p-2 rounded cursor-pointer ${
                            order.orderStatus === 'Delivered' ? 'text-emerald-400' : 
                            order.orderStatus === 'Cancelled' ? 'text-red-400' : 'text-amber-400'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="OutForDelivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => setActiveOrder(order)}
                          className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-extrabold bg-stone-950 border border-stone-800 py-2.5 px-4 rounded hover:border-amber-400/30 hover:text-amber-300 transition-all cursor-pointer ml-auto"
                        >
                          <Info className="h-3.5 w-3.5" /> Receipt Specs
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-stone-950 border-t border-stone-850 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 bg-stone-900 border border-stone-800 rounded text-stone-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 bg-stone-900 border border-stone-800 rounded text-stone-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Order popup receipt */}
      {activeOrder && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-stone-900 border border-stone-850 rounded shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-850 flex justify-between items-center select-none bg-stone-950/40">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-amber-300 font-extrabold">Receipt Spec Log</span>
                <h3 className="font-serif text-lg font-bold text-white mt-1">Invoice: {activeOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal content body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Row 1: Shipping and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client contacts */}
                <div className="bg-stone-950 p-4 rounded border border-stone-850 flex flex-col gap-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1.5 select-none">
                    <UserIcon className="h-3.5 w-3.5 text-amber-300" /> Client Account Profile
                  </h4>
                  <div className="space-y-1.5 text-xs text-stone-300">
                    <p className="font-bold text-white">{activeOrder.user?.name || 'Guest Client'}</p>
                    <p className="flex items-center gap-1.5 text-stone-400 mt-2">
                      <Mail className="h-3.5 w-3.5 text-stone-500" /> {activeOrder.user?.email || 'N/A'}
                    </p>
                    <p className="flex items-center gap-1.5 text-stone-400">
                      <Phone className="h-3.5 w-3.5 text-stone-500" /> {activeOrder.user?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Delivery Target snapshot */}
                <div className="bg-stone-950 p-4 rounded border border-stone-850 flex flex-col gap-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold flex items-center gap-1.5 select-none">
                    <MapPin className="h-3.5 w-3.5 text-amber-300" /> Shipping Destination
                  </h4>
                  {activeOrder.shippingAddress ? (
                    <div className="space-y-1 text-xs text-stone-300">
                      <p className="font-bold text-white">{activeOrder.shippingAddress.fullName}</p>
                      <p className="text-stone-400 mt-1">{activeOrder.shippingAddress.addressLine}</p>
                      <p className="text-stone-400">
                        {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}
                      </p>
                      <p className="text-stone-400">{activeOrder.shippingAddress.country}</p>
                      <p className="text-stone-400 font-bold mt-1">Tel: {activeOrder.shippingAddress.phone}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 italic">No delivery snapshots registered.</p>
                  )}
                </div>
              </div>

              {/* Row 2: Items list */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold select-none">Purchased Mirror Details</h4>
                <div className="border border-stone-850 rounded overflow-hidden">
                  <div className="bg-stone-950 p-3 text-[9px] uppercase tracking-wider text-stone-500 font-extrabold grid grid-cols-6 gap-2">
                    <span className="col-span-3">Product Name & Specifications</span>
                    <span className="text-center">Rate</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Net Price</span>
                  </div>
                  <div className="divide-y divide-stone-850/60 bg-stone-950/20">
                    {activeOrder.items.map(item => (
                      <div key={item.id} className="p-3.5 grid grid-cols-6 gap-2 text-xs items-center">
                        <div className="col-span-3">
                          <p className="font-bold text-white font-serif">{item.productName}</p>
                          <p className="text-[10px] text-amber-300/80 mt-1 font-mono leading-relaxed">
                            {renderCustomizationDetails(item.customizationDetails)}
                          </p>
                        </div>
                        <span className="text-center font-mono text-stone-400">₹{item.price}</span>
                        <span className="text-center font-mono text-stone-400">{item.quantity}</span>
                        <span className="text-right font-mono text-white font-bold">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Invoice valuations and parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Gateways and codes */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold select-none">Transaction Diagnostics</h4>
                  <div className="bg-stone-950/40 border border-stone-850 rounded p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Method:</span>
                      <span className="text-stone-300 font-bold">{activeOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Gate Status:</span>
                      <span className="text-emerald-400 font-bold">{activeOrder.paymentStatus}</span>
                    </div>
                    {activeOrder.payment?.paymentGatewayId && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Gateway Ref ID:</span>
                        <span className="text-stone-400 font-mono text-[10px] select-all">{activeOrder.payment.paymentGatewayId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtotals */}
                <div className="bg-stone-950 border border-stone-850 rounded p-4 flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Itemized Subtotal:</span>
                    <span className="text-stone-300 font-mono">₹{activeOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Delivery charges:</span>
                    <span className="text-stone-400 font-mono italic">Complementary</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-stone-850 font-serif text-sm font-bold text-white">
                    <span>Total Valuation:</span>
                    <span className="text-amber-300 font-mono">{formatINR(activeOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-stone-850 bg-stone-950/60 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold">Workflow status:</span>
                <select
                  value={activeOrder.orderStatus}
                  onChange={(e) => handleStatusChange(activeOrder.id, e.target.value)}
                  disabled={isUpdatingStatus === activeOrder.id}
                  className={`bg-stone-900 border border-stone-800 text-[10px] font-extrabold uppercase tracking-widest p-2 rounded cursor-pointer ${
                    activeOrder.orderStatus === 'Delivered' ? 'text-emerald-400' : 
                    activeOrder.orderStatus === 'Cancelled' ? 'text-red-400' : 'text-amber-400'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="OutForDelivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-[10px] font-extrabold uppercase tracking-widest py-3 px-6 rounded-md transition-colors cursor-pointer"
              >
                Close Receipt Overview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
