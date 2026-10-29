'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, XCircle, Filter, Download } from 'lucide-react';

const alerts = [
  {
    id: 1,
    title: 'Critical: Armed Skirmish in Kasese Sector 7G',
    severity: 'CRITICAL',
    type: 'ARMED_CONFLICT',
    location: 'Kasese District',
    time: '15 minutes ago',
    description: 'Armed skirmish reported with 3 civilian casualties and ongoing firefight.',
    status: 'ACTIVE',
  },
  {
    id: 2,
    title: 'Elevated: Unauthorized Incursion at Entebbe Airspace',
    severity: 'ELEVATED',
    type: 'SECURITY_BREACH',
    location: 'Entebbe',
    time: '1 hour ago',
    description: 'Unidentified aircraft detected in restricted airspace. Interceptors dispatched.',
    status: 'ACTIVE',
  },
  {
    id: 3,
    title: 'Warning: Grid Anomaly in Kampala Hub',
    severity: 'WARNING',
    type: 'INFRASTRUCTURE',
    location: 'Kampala',
    time: '2 hours ago',
    description: 'Power grid fluctuation detected in central district. Engineering team investigating.',
    status: 'INVESTIGATING',
  },
  {
    id: 4,
    title: 'Resolved: Border Patrol Incident',
    severity: 'HIGH',
    type: 'BORDER_INCIDENT',
    location: 'Busia Border Post',
    time: '4 hours ago',
    description: 'Suspicious vehicle crossing attempt. Vehicle detained for inspection.',
    status: 'RESOLVED',
  },
  {
    id: 5,
    title: 'Info: Personnel Status Update',
    severity: 'LOW',
    type: 'ADMINISTRATIVE',
    location: 'Central Command',
    time: '6 hours ago',
    description: 'Routine personnel status update completed for Northern Region.',
    status: 'LOGGED',
  },
];

const severityColors = {
  CRITICAL: 'bg-red-500/10 border-red-500/30 text-red-400',
  ELEVATED: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  WARNING: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  HIGH: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  LOW: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
};

const statusIcons = {
  ACTIVE: <AlertTriangle size={16} className="text-red-500" />,
  INVESTIGATING: <Clock size={16} className="text-amber-500" />,
  RESOLVED: <CheckCircle size={16} className="text-emerald-500" />,
  LOGGED: <CheckCircle size={16} className="text-slate-500" />,
};

export default function AlertsPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold text-slate-50">Alerts & Incidents</h1>
            <p className="text-slate-400">Real-time alert management and incident tracking</p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-all text-slate-300">
              <Filter size={18} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-all text-slate-300">
              <Download size={18} />
              Export
            </button>
            <div className="ml-auto text-slate-500 text-sm">
              Showing {alerts.length} alerts
            </div>
          </motion.div>

          {/* Alerts List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
            className="space-y-4"
          >
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border rounded-lg p-5 bg-slate-900/30 hover:bg-slate-900/60 transition-all cursor-pointer ${
                  severityColors[alert.severity as keyof typeof severityColors]
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {statusIcons[alert.status as keyof typeof statusIcons]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-50 mb-1">{alert.title}</h3>
                        <p className="text-sm text-slate-400">{alert.description}</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 whitespace-nowrap">
                        {alert.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                      <span>📍 {alert.location}</span>
                      <span>🏷️ {alert.type}</span>
                      <span className="ml-auto">{alert.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
