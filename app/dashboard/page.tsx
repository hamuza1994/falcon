"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import { SidebarLayout } from "@/components/sidebar-layout";

const stats = [
  {
    label: "Active Operations",
    value: "24",
    icon: Activity,
    color: "text-emerald-500",
  },
  {
    label: "Critical Alerts",
    value: "3",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  { label: "Personnel", value: "842", icon: Users, color: "text-blue-500" },
  {
    label: "Incidents (7d)",
    value: "+12%",
    icon: TrendingUp,
    color: "text-amber-500",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="flex h-screen bg-slate-950">
      <SidebarNav />

      <SidebarLayout className="overflow-auto">
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
          {/* Header with User Info */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-50 break-words">
                  Operations Dashboard
                </h1>
                <p className="text-sm sm:text-base text-slate-400 mt-1 md:mt-2">
                  Real-time provincial coordination center
                </p>
              </div>
              {user && (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 sm:p-4 w-full sm:w-80 md:w-80 flex-shrink-0 mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="text-blue-400" size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs text-slate-500 uppercase font-bold flex-shrink-0">
                        Role
                      </span>
                      <span className="text-xs font-semibold text-blue-400 text-right truncate">
                        {user.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs text-slate-500 uppercase font-bold flex-shrink-0">
                        Clearance
                      </span>
                      <span className="text-xs font-semibold text-green-400 text-right truncate">
                        {user.clearance}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs text-slate-500 uppercase font-bold flex-shrink-0">
                        Organization
                      </span>
                      <span className="text-xs font-semibold text-slate-300 text-right truncate">
                        {user.organization}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-medium">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-slate-50 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-slate-800/50 ${stat.color}`}
                    >
                      <Icon size={24} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Content Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-50 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  {
                    type: "ALERT",
                    message: "Critical incident reported in Kasese sector",
                    time: "2m ago",
                  },
                  {
                    type: "UPDATE",
                    message: "Personnel status updated for North region",
                    time: "15m ago",
                  },
                  {
                    type: "COMPLETED",
                    message: "Operation SHIELD-07 successfully concluded",
                    time: "1h ago",
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "ALERT"
                          ? "bg-red-500"
                          : activity.type === "UPDATE"
                            ? "bg-blue-500"
                            : "bg-emerald-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm">
                        {activity.message}
                      </p>
                      <p className="text-slate-600 text-xs mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-50 mb-4">
                System Status
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Network",
                    status: "Optimal",
                    color: "text-emerald-500",
                  },
                  {
                    label: "Database",
                    status: "Optimal",
                    color: "text-emerald-500",
                  },
                  {
                    label: "API Gateway",
                    status: "Optimal",
                    color: "text-emerald-500",
                  },
                  {
                    label: "Cache Layer",
                    status: "Optimal",
                    color: "text-emerald-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{item.label}</span>
                    <span className={`text-xs font-bold ${item.color}`}>
                      ● {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </SidebarLayout>
    </div>
  );
}
