import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Calendar,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [usersRes, ordersRes] = await Promise.all([
        axios.get(`${apiUrl}/api/users/profile`).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/api/orders`).catch(() => ({ data: [] }))
      ]);

      const ordersList = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const ordersByEmail = {};

      ordersList.forEach((ord) => {
        if (!ord.customerEmail) return;
        const email = ord.customerEmail.toLowerCase().trim();
        if (!ordersByEmail[email]) {
          ordersByEmail[email] = { name: ord.customerName, count: 0, spend: 0, orders: [] };
        }
        ordersByEmail[email].count += 1;
        ordersByEmail[email].spend += Number(ord.totalAmount || 0);
        ordersByEmail[email].orders.push(ord);
      });

      const customerMap = Object.keys(ordersByEmail).map((email, i) => ({
        id: `CUST-${1000 + i}`,
        name: ordersByEmail[email].name || 'Registered Customer',
        email,
        ordersCount: ordersByEmail[email].count,
        totalSpend: ordersByEmail[email].spend,
        status: 'Active',
        joinedAt: ordersByEmail[email].orders[0]?.createdAt || new Date().toISOString()
      }));

      setCustomers(customerMap);
    } catch (err) {
      console.error('Error fetching admin customers:', err);
      setNotification({ type: 'error', message: 'Failed to load customers list from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const totalCustomers = customers.length;
  const totalOrdersCount = customers.reduce((sum, c) => sum + c.ordersCount, 0);
  const totalLifetimeSpend = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const avgCustomerValue = totalCustomers > 0 ? totalLifetimeSpend / totalCustomers : 0;

  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 text-gray-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Accounts & Clients</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage registered jewelers, CAD buyers, track customer order counts, and lifetime spend in ₹ INR.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Customers</span>
        </button>
      </div>

      {/* Notifications */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Clients</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalCustomers}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total CAD Orders</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalOrdersCount}</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-100">
            <ShoppingBag size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Lifetime Spend</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              ₹{totalLifetimeSpend.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 font-black text-lg">
            ₹
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Avg Customer Value</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">
              ₹{Math.round(avgCustomerValue).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 font-black text-lg">
            ₹
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Customer Name, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black font-medium"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Client ID</th>
                  <th className="py-3.5 px-4 font-bold">Customer Name</th>
                  <th className="py-3.5 px-4 font-bold">Email Address</th>
                  <th className="py-3.5 px-4 font-bold">Total Orders</th>
                  <th className="py-3.5 px-4 font-bold">Total Spend (₹)</th>
                  <th className="py-3.5 px-4 font-bold">Account Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-black">{cust.id}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{cust.name}</td>
                    <td className="py-3.5 px-4 text-gray-600">{cust.email}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{cust.ordersCount} Order(s)</td>
                    <td className="py-3.5 px-4 font-black text-gray-900">
                      ₹{cust.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[10px] text-gray-500">
                      {new Date(cust.joinedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500 space-y-3">
            <Users className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-xs font-mono">No customers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
