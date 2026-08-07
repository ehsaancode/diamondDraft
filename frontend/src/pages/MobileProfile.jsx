import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Package, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  CreditCard,
  User,
  ShieldCheck,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';

const MobileProfile = () => {
  const navigate = useNavigate();
  const { favoritesCount } = useFavorites();
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'orders'

  useEffect(() => {
    if (user?.email) {
      const fetchUserOrders = async () => {
        setLoadingOrders(true);
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const res = await fetch(`${apiUrl}/api/orders/user/${user.email}`);
          if (res.ok) {
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
          }
        } catch (err) {
          console.error('Error loading user orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchUserOrders();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#f8f9fa] min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
        <div className="bg-white p-8 rounded-[32px] shadow-md border border-gray-100/50 w-full max-w-sm text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">Sign in to your account</h2>
            <p className="text-sm text-gray-500 mt-2">Access your favorites, orders, and manage your account settings.</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-black text-white hover:bg-gray-900 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-xs flex flex-col items-center gap-4 text-center border-b border-gray-100">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
            <User size={48} className="text-gray-400" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-xs text-gray-500 font-medium">{user.email}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu' ? 'bg-black text-white shadow-xs' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Account Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'orders' ? 'bg-black text-white shadow-xs' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span>My CAD Orders</span>
            {orders.length > 0 && (
              <span className="w-4 h-4 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                {orders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {activeTab === 'orders' ? (
          /* Orders History Tab View */
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">CAD Request History</h3>
            {loadingOrders ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 bg-gray-200/60 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : orders.length > 0 ? (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-gray-900">{ord.orderId || ord.id}</span>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${getStatusBadge(ord.status)}`}>
                      {ord.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 border-t border-b border-gray-100 py-2.5">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-800 line-clamp-1">{item.name}</span>
                        <span className="font-mono text-gray-500 text-[10px]">₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Total CAD Estimate</span>
                    <span className="font-extrabold text-gray-900 text-sm">₹{Number(ord.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-xs font-medium text-gray-600">No CAD orders placed yet.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2 bg-black text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Explore Catalog
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Main Menu Tab View */
          <>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => navigate('/favorites')}
                className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-xs border border-gray-200 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                    <Heart size={18} fill={favoritesCount > 0 ? 'currentColor' : 'none'} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-gray-900">My Favorites</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">{favoritesCount} items saved</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-xs border border-gray-200 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                    <Package size={18} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-gray-900">CAD Order History</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">{orders.length} requests placed</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 text-red-600 font-bold text-xs bg-white rounded-2xl shadow-xs border border-red-100 active:scale-95 transition-transform cursor-pointer"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default MobileProfile;
