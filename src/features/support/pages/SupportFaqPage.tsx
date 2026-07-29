"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { faqSections } from "@/config/faq.config";
import { support, supportRoutes } from "@/config/support.config";
import { SupportPageLayout } from "../components/SupportPageLayout";
import {
  SupportFaqAccordion,
  SupportFaqCardHeader,
} from "../components/SupportFaqAccordion";
import { containerVariants, itemVariants } from "../components/SupportRefundSection";

const allFaqs = faqSections.flatMap((section) => section.items);

export default function SupportFaqPage() {
  const contactHref = support.contactUrl || `mailto:${support.email}`;

  return (
    <SupportPageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      >
        <motion.div variants={itemVariants} className="card-base overflow-hidden p-0 lg:col-span-3">
          <SupportFaqCardHeader />
          <div className="px-4 pb-2 sm:px-6">
            <SupportFaqAccordion items={allFaqs} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="card-base sticky top-6 p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
              <MessageCircle className="h-8 w-8 text-accent-readable" />
            </div>
            <h2 className="ds-h3 mb-2">Got a Question?</h2>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help. Reach
              out and we&apos;ll get back to you within 24–48 hours.
            </p>
            <Link href={supportRoutes.contact} className="btn-primary w-full">
              <Mail className="h-4 w-4" />
              {support.ctaLabel}
            </Link>
            <a
              href={contactHref}
              className="mt-4 block break-all text-xs text-text-muted hover:text-accent-readable hover:underline"
            >
              {support.email}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </SupportPageLayout>
  );
}
