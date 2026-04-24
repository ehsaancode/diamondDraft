import React from 'react';
import { motion } from 'framer-motion';

export const SettingsPage = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold font-grotesk tracking-tight">Settings</h2>
      <p className="text-zinc-400 mt-1">Manage system configurations.</p>
    </div>
    <div className="glass-panel p-6 max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-border">
          <div>
            <h4 className="font-semibold text-zinc-100">Maintenance Mode</h4>
            <p className="text-sm text-zinc-400 mt-1">Temporarily disable customer access to the storefront.</p>
          </div>
          <div className="w-11 h-6 bg-surfaceHover border border-border rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-zinc-400 rounded-full absolute top-[3px] left-[3px]"></div>
          </div>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-border">
          <div>
            <h4 className="font-semibold text-zinc-100">Email Notifications</h4>
            <p className="text-sm text-zinc-400 mt-1">Receive an email when an order is placed.</p>
          </div>
          <div className="w-11 h-6 bg-primary-500 border border-primary-400 rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <div className="w-4 h-4 bg-white rounded-full absolute top-[3px] right-[3px]"></div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);
