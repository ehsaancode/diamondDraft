import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle2, RefreshCw } from 'lucide-react';
import axios from 'axios';

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    storeName: 'Gwel CAD Marketplace',
    supportEmail: 'support@gwel.com',
    defaultCurrency: 'INR'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/admin/settings`);
        if (res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch settings from backend:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/admin/settings`, settings);
      setSavedMessage('Settings updated successfully in backend database!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings to backend database');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 text-center text-zinc-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-400" />
        <p className="text-xs font-mono">Loading System Configurations...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold font-grotesk tracking-tight">System Settings</h2>
        <p className="text-zinc-400 mt-1">Configure global store behavior, maintenance status, and backend preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-panel p-6 space-y-6">
          {savedMessage && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{savedMessage}</span>
            </div>
          )}

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <h4 className="font-semibold text-zinc-100">Maintenance Mode</h4>
              <p className="text-sm text-zinc-400 mt-1">Temporarily disable customer access to the storefront.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('maintenanceMode')}
              className={`w-12 h-7 rounded-full transition-colors p-1 relative ${
                settings.maintenanceMode ? 'bg-primary-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <h4 className="font-semibold text-zinc-100">Order & Registration Email Alerts</h4>
              <p className="text-sm text-zinc-400 mt-1">Receive automatic notifications when new products or orders are placed.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('emailNotifications')}
              className={`w-12 h-7 rounded-full transition-colors p-1 relative ${
                settings.emailNotifications ? 'bg-primary-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Store Name */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-semibold text-zinc-300">Store Title</label>
            <input
              type="text"
              name="storeName"
              value={settings.storeName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Gwel CAD Marketplace"
            />
          </div>

          {/* Support Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-300">Support Contact Email</label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleInputChange}
              className="input-field"
              placeholder="support@gwel.com"
            />
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-300">Default Currency</label>
            <select
              name="defaultCurrency"
              value={settings.defaultCurrency}
              onChange={handleInputChange}
              className="input-field cursor-pointer"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2 font-semibold px-6 py-3"
        >
          <Save size={18} />
          <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </form>
    </motion.div>
  );
};
