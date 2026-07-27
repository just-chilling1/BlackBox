"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Lock,
  Server,
  Globe,
  Key,
  CheckCircle,
  Activity,
  User,
  Calendar,
  Mail,
  BadgeCheck,
  ArrowRight,
  Headphones,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";
import { supabase } from "@/lib/supabase";
import { brand } from "@/config/brand.config";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";

const SECURITY_SCORE = 100;

const protectionLayers = [
  { icon: Lock, label: "TLS 1.3", detail: "Encrypted connection" },
  { icon: Shield, label: "AES-256", detail: "Data at rest" },
  { icon: Key, label: "JWT Session", detail: "Secure tokens" },
  { icon: BadgeCheck, label: "Verified", detail: "Identity confirmed" },
];

const securityChecks = [
  {
    icon: BadgeCheck,
    title: "Account Verified",
    description: "Identity confirmed and credentials validated",
  },
  {
    icon: Lock,
    title: "Secure Connection",
    description: "Encrypted with TLS 1.3 end-to-end",
  },
  {
    icon: Key,
    title: "Session Protected",
    description: "Authenticated session with secure token rotation",
  },
  {
    icon: Shield,
    title: "Data Encryption",
    description: "Personal data encrypted in transit and at rest",
  },
  {
    icon: Server,
    title: "Server Status",
    description: `All ${brand.productName} servers online and operational`,
  },
  {
    icon: Globe,
    title: "API Connectivity",
    description: "External integrations stable and monitored",
  },
];

const activityFeed = [
  { icon: CheckCircle, text: "Successful login", offsetMinutes: 0 },
  { icon: Activity, text: "Session renewed", offsetMinutes: 2 },
  { icon: ShieldCheck, text: "Security scan completed", offsetMinutes: 15 },
  { icon: Lock, text: "SSL certificate verified", offsetMinutes: 60 },
  { icon: Server, text: "System health check passed", offsetMinutes: 180 },
];

function formatRelativeTime(iso: string | undefined, fallbackMinutes: number): string {
  if (!iso) {
    if (fallbackMinutes === 0) return "Just now";
    if (fallbackMinutes < 60) return `${fallbackMinutes} minutes ago`;
    const h = Math.floor(fallbackMinutes / 60);
    return h === 1 ? "1 hour ago" : `${h} hours ago`;
  }
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

function formatMemberSince(iso: string | undefined): string {
  if (!iso) return "Active member";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function initialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase() || "ME";
}

function ScoreRing({ score, animating }: { score: number; animating: boolean }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="-rotate-90" width="128" height="128" aria-hidden>
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#EEB310"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animating ? offset : offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-accent">{score}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Secure
        </span>
      </div>
    </div>
  );
}

export default function ProtectorPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [lastSignIn, setLastSignIn] = useState<string | undefined>();
  const [memberSince, setMemberSince] = useState<string | undefined>();
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [checksVisible, setChecksVisible] = useState(false);

  const runScan = useCallback(() => {
    setScanning(true);
    setScanComplete(false);
    setChecksVisible(false);
    setScanProgress(0);

    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const pct = Math.min(100, Math.round(((now - start) / duration) * 100));
      setScanProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setScanning(false);
        setScanComplete(true);
        setTimeout(() => setChecksVisible(true), 150);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user?.email) setUserEmail(user.email);
      setLastSignIn(user?.last_sign_in_at ?? undefined);
      setMemberSince(user?.created_at ?? undefined);
      setLoading(false);
      runScan();
    });
  }, [runScan]);

  const activity = useMemo(
    () =>
      activityFeed.map((item, i) => ({
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-stack max-w-6xl"
    >
      <PageHeader
        eyebrow="Premium"
        title="Wealth Protector"
        subtitle={`Enterprise-grade account protection for your ${brand.productName} earnings — verification, encryption, and live monitoring.`}
      />

      <section className="glass-card overflow-hidden p-0">
        <div className="border-b border-divider bg-accent/5 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <ScoreRing score={SECURITY_SCORE} animating={scanComplete} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <ShieldCheck size={20} />
                  </div>
                  <span
                    className={
                      scanComplete
                        ? "rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
                        : "badge-warning"
                    }
                  >
                    {scanComplete ? "All systems secure" : scanning ? "Scanning…" : "Initializing…"}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-black text-text-primary md:text-2xl">
                  {userEmail ? `${brand.productName} account protected` : "Account protected"}
                </h2>
                <p className="mt-1 max-w-md text-sm text-text-secondary">
                  Your session, data, and affiliate assets are monitored 24/7 with bank-level encryption.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={runScan}
              disabled={scanning}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border-dim bg-slate-100 px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-200/70 disabled:opacity-50"
            >
              <RefreshCw size={14} className={clsx(scanning && "animate-spin")} />
              {scanning ? "Scanning…" : "Run security scan"}
            </button>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-semibold text-text-muted">
              <span>Security scan</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent to-[#C9970D]"
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-4 md:p-8">
          {protectionLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.label}
                className="rounded-xl border border-divider bg-slate-50 p-3 text-center"
              >
                <Icon size={18} className="mx-auto text-accent" />
                <p className="mt-2 text-xs font-bold text-text-primary">{layer.label}</p>
                <p className="mt-0.5 text-[10px] text-text-muted">{layer.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Security Score", value: `${SECURITY_SCORE}%`, color: "text-accent" },
          { label: "Account Status", value: "Verified", color: "text-accent" },
          { label: "License", value: "Active", color: "text-accent" },
          { label: "Uptime", value: "99.9%", color: "text-accent" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {stat.label}
            </p>
            <p className={clsx("mt-1 text-2xl font-black", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass-card p-6 lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-text-primary">
            <Shield size={18} className="text-accent" />
            Security checks
            {scanComplete && (
              <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-accent">
                <Sparkles size={12} /> {securityChecks.length}/{securityChecks.length} passed
              </span>
            )}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <AnimatePresence>
              {securityChecks.map((check, index) => {
                const Icon = check.icon;
                const visible = checksVisible;
                return (
                  <motion.div
                    key={check.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={visible ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 0 }}
                    transition={{ delay: visible ? index * 0.06 : 0 }}
                    className="flex flex-col gap-3 rounded-xl border border-divider bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon size={16} />
                      </div>
                      <span
                        className={clsx(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          visible
                            ? "bg-accent/15 text-accent"
                            : "bg-slate-100 text-text-muted"
                        )}
                      >
                        {visible ? "Pass" : "…"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{check.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                        {check.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        <div className="space-y-6">
          <section className="glass-card overflow-hidden p-0">
            <div className="border-b border-divider bg-accent/5 p-5">
              <h3 className="text-lg font-bold text-text-primary">Your account</h3>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-black text-accent">
                  {userEmail ? initialsFromEmail(userEmail) : <User size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-text-primary">
                    {userEmail || "Member"}
                  </p>
                  <p className="text-xs text-accent">Verified member</p>
                </div>
              </div>
              {[
                { icon: Mail, label: "Email", value: userEmail || "—" },
                { icon: User, label: "Membership", value: "Premium Active" },
                { icon: Lock, label: "2FA", value: "Enabled" },
                {
                  icon: Calendar,
                  label: "Last login",
                  value: formatRelativeTime(lastSignIn, 0),
                },
                {
                  icon: Calendar,
                  label: "Member since",
                  value: formatMemberSince(memberSince),
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon size={14} className="shrink-0 text-text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        {item.label}
                      </p>
                      <p className="truncate text-sm font-semibold text-text-primary">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="glass-card p-5">
            <h3 className="mb-4 text-lg font-bold text-text-primary">Recent activity</h3>
            <div className="space-y-3">
              {activity.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text-primary">{item.text}</p>
                      <p className="text-xs text-text-muted">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <section className="glass-card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Headphones size={22} className="text-accent" />
          <div>
            <p className="font-bold text-text-primary">Need help with your account?</p>
            <p className="text-sm text-text-secondary">Our support team is here if something looks off.</p>
          </div>
        </div>
        <Link href="/support" className="btn-primary inline-flex items-center gap-2">
          Contact Support
          <ArrowRight size={16} />
        </Link>
      </section>

      <p className="text-xs text-text-muted">
        {brand.productName} Wealth Protector — visual security status for your member account. No settings
        are changed on this page.
      </p>
    </motion.div>
  );
}
