import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  IndianRupee,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  X,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/orders`);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setNotification({ type: 'error', message: 'Failed to load CAD orders from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.put(`${apiUrl}/api/orders/${orderId}/status`, { status: newStatus });
      
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderId === orderId)) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }

      setNotification({ type: 'success', message: `Order status updated to "${newStatus}".` });
    } catch (err) {
      console.error('Error updating order status:', err);
      setNotification({ type: 'error', message: 'Failed to update order status.' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Metrics
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;
  const totalOrderRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (o.orderId && o.orderId.toLowerCase().includes(query)) ||
      (o.customerName && o.customerName.toLowerCase().includes(query)) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(query)) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(query));
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Processing':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CAD Design Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer CAD design requests, inspect item specifications, and manage order fulfillment.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="font-bold underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Orders</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalOrdersCount}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
            <ShoppingBag size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Pending Requests</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Completed Orders</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{completedCount}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Order Value (₹)</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">₹{totalOrderRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-black text-lg">
            ₹
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Order ID, Name, Email, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black font-medium"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
          <Filter size={14} className="text-gray-400 shrink-0" />
          {['All', 'Pending', 'Processing', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                selectedStatus === status
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Order ID</th>
                  <th className="py-3.5 px-4 font-bold">Customer Details</th>
                  <th className="py-3.5 px-4 font-bold">CAD Items</th>
                  <th className="py-3.5 px-4 font-bold">Total (₹ INR)</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-black">{order.orderId || order.id}</td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{order.customerName}</p>
                        <p className="text-[10px] text-gray-500">{order.customerEmail}</p>
                        {order.customerPhone !== 'N/A' && (
                          <p className="text-[10px] text-gray-400 font-mono">{order.customerPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800">
                        {order.items?.length || 0} CAD Asset(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-gray-900">
                      ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[10px]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="View Full Order Details"
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-gray-800 font-bold transition-all text-[11px] cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500 space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-xs font-mono">No CAD orders match the search & filter criteria.</p>
          </div>
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl text-gray-900 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">CAD Request Details</span>
                <h3 className="text-lg font-bold font-mono text-gray-900">{selectedOrder.orderId || selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Info Box */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Customer Information</h4>
              <div className="flex items-center gap-2 text-gray-700">
                <User size={14} className="text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <span>{selectedOrder.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <span>{selectedOrder.customerPhone || 'N/A'}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-700 pt-1 border-t border-gray-200/60 mt-1">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <span>{selectedOrder.shippingAddress || 'N/A'}</span>
              </div>
            </div>

            {/* Itemized CAD Assets */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Requested CAD Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 text-xs">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 border p-0.5" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-mono text-[9px]">CAD</div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <span className="text-[10px] text-gray-500 font-mono">Format: {item.format || 'STL'}</span>
                      </div>
                    </div>
                    <span className="font-black text-gray-900">₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            {selectedOrder.notes && (
              <div className="bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <FileText size={14} /> <span>Customization Notes:</span>
                </div>
                <p className="text-amber-900 font-sans text-[11px] leading-relaxed">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Total & Status Update Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Total Order Value</span>
                <span className="text-xl font-extrabold text-gray-900">
                  ₹{Number(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  disabled={isUpdatingStatus}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 cursor-pointer focus:outline-none focus:border-black"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
