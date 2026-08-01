"use client";

import { motion } from "framer-motion";
import { brand } from "@/config/brand.config";
import { BrandLogo } from "./BrandLogo";
import { FloatingSupportButton } from "@/components/support/FloatingSupportButton";

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
}

export function AuthLayout({ children, subtitle }: AuthLayoutProps) {
  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{ backgroundColor: brand.colors.authPage }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-6 sm:p-8 lg:p-10 flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <BrandLogo size="lg" showTagline={false} stacked />
            {subtitle && <p className="text-[15px] text-ink-3">{subtitle}</p>}
          </div>
          {children}
        </div>
      </motion.div>
      <FloatingSupportButton />
    </div>
  );
}
