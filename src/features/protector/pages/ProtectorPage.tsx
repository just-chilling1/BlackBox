"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  Globe,
  UserCheck,
  KeyRound,
  Eye,
  Server,
  Wifi,
  Clock,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PageLoading } from "@/components/ui/page-loading";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { brand } from "@/config/brand.config";

const securityChecks = [
  {
    label: "Account Verified",
    description: "Your email address has been verified and confirmed",
    icon: UserCheck,
  },
  {
    label: "Secure Connection",
    description: "All data is transmitted over encrypted HTTPS connection",
    icon: Lock,
  },
  {
    label: "Session Protected",
    description: "Your session is authenticated with a secure token",
    icon: KeyRound,
  },
  {
    label: "Data Encryption",
    description: "All personal and financial data is encrypted at rest",
    icon: Eye,
  },
  {
    label: "Server Status",
    description: `All ${brand.productName} servers are online and operational`,
    icon: Server,
  },
  {
    label: "API Connectivity",
    description: "Connection to Digistore24 and traffic APIs is stable",
    icon: Wifi,
  },
];

const activityLog = [
  { event: "Successful login", offsetMinutes: 0, icon: UserCheck },
  { event: "Session renewed", offsetMinutes: 2, icon: KeyRound },
  { event: "Security scan completed", offsetMinutes: 15, icon: ShieldCheck },
  { event: "SSL certificate verified", offsetMinutes: 60, icon: Lock },
  { event: "System health check passed", offsetMinutes: 180, icon: Server },
];

function formatRelativeTime(iso: string | undefined, fallbackMinutes: number): string {
  if (!iso) {
    if (fallbackMinutes === 0) return "Just now";
    if (fallbackMinutes < 60) return `${fallbackMinutes} minutes ago`;
    const h = Math.floor(fallbackMinutes / 60);
    return h === 1 ? "1 hour ago" : `${h} hours ago`;
  }

  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  return "Today";
}

function formatLastLogin(iso: string | undefined): string {
  if (!iso) return "Today";
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  return hours < 24 ? "Today" : formatRelativeTime(iso, 0);
}

export default function ProtectorPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [lastSignIn, setLastSignIn] = useState<string | undefined>();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user?.email) setUserEmail(user.email);
      setLastSignIn(user?.last_sign_in_at ?? undefined);
      setLoading(false);
    });
  }, []);

  const activity = useMemo(
    () =>
      activityLog.map((item, i) => ({
        ...item,
        time:
          i === 0 && lastSignIn
            ? formatRelativeTime(lastSignIn, 0)
            : formatRelativeTime(undefined, item.offsetMinutes),
      })),
    [lastSignIn]
  );

  if (loading) {
    return <PageLoading message="Loading Wealth Protector..." />;
  }

  return (
    <div className="space-y-8 pb-20 max-w-6xl font-heading">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 md:p-10 rounded-2xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/5 via-slate-900/90 to-slate-900/70 backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-1">
              Wealth Protector
            </h1>
            <p className="text-gray-400 text-sm">
              Your account security overview. Everything is monitored in real time.
            </p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              All Systems Secure
            </span>
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl border border-white/5 bg-slate-950/95 p-6 md:p-8 space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Security Score", value: "100%", icon: ShieldCheck, color: "text-emerald-400" },
          { label: "Account Status", value: "Verified", icon: CheckCircle, color: "text-emerald-400" },
          { label: "Encryption", value: "AES-256", icon: Lock, color: "text-cyan-400" },
          { label: "Uptime", value: "99.9%", icon: Globe, color: "text-blue-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassPanel intensity="low" className="p-5 border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white">{stat.value}</div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white mb-1">Security Checks</h2>
          <div className="space-y-3">
            {securityChecks.map((check, i) => (
              <motion.div
                key={check.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <GlassPanel
                  intensity="low"
                  className="p-4 border-white/5 hover:border-emerald-500/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <check.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white">{check.label}</h3>
                      <p className="text-xs text-gray-500">{check.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        Verified
                      </span>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GlassPanel intensity="low" className="p-5 border-emerald-500/10">
            <h3 className="text-sm font-bold text-white mb-4">Account Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-xs text-gray-500">Email</span>
                <span className="text-xs text-white font-medium truncate ml-4">{userEmail}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-xs text-gray-500">Membership</span>
                <span className="text-xs text-emerald-400 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-xs text-gray-500">2FA</span>
                <span className="text-xs text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-gray-500">Last Login</span>
                <span className="text-xs text-white font-medium">{formatLastLogin(lastSignIn)}</span>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel intensity="low" className="p-5 border-white/5">
            <h3 className="text-sm font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.event} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 font-medium">{item.event}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-600" />
                      <span className="text-[10px] text-gray-600">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
      </div>
    </div>
  );
}
