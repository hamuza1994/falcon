'use client';

import { SidebarLayout } from '@/components/sidebar-layout';
import { SidebarNav } from '@/components/sidebar-nav';
import { motion } from 'framer-motion';
import { Save, Bell, Lock, User, Shield, Eye } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    organization: 'POCC Operations',
    clearanceLevel: 'CL3_RESTRICTED',
    twoFactorAuth: true,
    emailNotifications: true,
    pushNotifications: false,
    alertSeverity: 'CRITICAL',
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', formData);
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <SidebarNav />

      <SidebarLayout> 
        <div className="p-8 space-y-8 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold text-slate-50">Settings</h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <User size={24} className="text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-50">Account</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-50 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-50 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 bg-slate-800/30 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Clearance Level</label>
                <select
                  name="clearanceLevel"
                  value={formData.clearanceLevel}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 bg-slate-800/30 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                >
                  <option>CL1_PUBLIC</option>
                  <option>CL2_INTERNAL</option>
                  <option>CL3_RESTRICTED</option>
                  <option>CL4_COUNTER_INTEL</option>
                  <option>CL5_TOP_SECRET</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-50">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-emerald-500" />
                  <div>
                    <p className="text-slate-50 font-medium">Two-Factor Authentication</p>
                    <p className="text-slate-500 text-sm">Enhance your account security</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={formData.twoFactorAuth}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-blue-500"
                  />
                </label>
              </div>

              <button className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all text-slate-300 font-medium">
                Change Password
              </button>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} className="text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-50">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-slate-50 font-medium">Email Notifications</p>
                  <p className="text-slate-500 text-sm">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 rounded accent-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-slate-50 font-medium">Push Notifications</p>
                  <p className="text-slate-500 text-sm">Browser push notifications</p>
                </div>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={formData.pushNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 rounded accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Alert Severity Filter</label>
                <select
                  name="alertSeverity"
                  value={formData.alertSeverity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-50 focus:border-blue-500 focus:outline-none"
                >
                  <option value="ALL">All Alerts</option>
                  <option value="CRITICAL">Critical & Above</option>
                  <option value="HIGH">High & Above</option>
                  <option value="WARNING">Warning & Above</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
            >
              <Save size={18} />
              Save Changes
            </button>
            <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-all">
              Cancel
            </button>
          </motion.div>
        </div>
       </SidebarLayout> 
    </div>
  );
}
