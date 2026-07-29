"use client";

import { motion } from "framer-motion";
import { Headphones, Mail } from "lucide-react";
import { support } from "@/config/support.config";
import { ContactSupportWidget } from "@/components/dashboard/ContactSupportWidget";
import { SupportPageLayout } from "../components/SupportPageLayout";
import { SupportChannelCards } from "../components/SupportChannelCards";
import { SupportStatCards } from "../components/SupportStatCards";
import {
  SupportRefundSection,
  containerVariants,
  itemVariants,
} from "../components/SupportRefundSection";

export default function SupportPage() {
  const contactHref = support.contactUrl || `mailto:${support.email}`;

  return (
    <SupportPageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6"
      >
        <motion.div variants={itemVariants}>
          <SupportChannelCards />
        </motion.div>

        <motion.div variants={itemVariants} className="card-base flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 shadow-sm">
              <Headphones className="text-accent-readable" size={24} />
            </div>
            <div className="min-w-0">
              <h2 className="brand-font text-xl text-text-heading sm:text-2xl">{support.headline}</h2>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{support.subcopy}</p>
            </div>
          </div>

          <a href={contactHref} className="btn-primary-prominent w-full sm:w-fit">
            <Mail size={18} />
            {support.ctaLabel}
          </a>

          <SupportStatCards />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ContactSupportWidget />
        </motion.div>

        <SupportRefundSection />
      </motion.div>
    </SupportPageLayout>
  );
}
