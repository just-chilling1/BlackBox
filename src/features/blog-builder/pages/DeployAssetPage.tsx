"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { AiLoadingBar } from "@/components/ui/AiLoadingBar";
import { GenerationProgress } from "@/components/ui/generation-progress";
import { EarningsBanner } from "@/components/ui/earnings-banner";
import { useScrollToResult } from "@/hooks/useScrollToResult";
import { useBlogBuilder } from "../context/BlogBuilderContext";
import { GenerationTerminal } from "../components/GenerationTerminal";
import { DeploySitePreview } from "../components/DeploySitePreview";
import { getSiteTerritory } from "../lib/site-territory";
import type { ArmedLink, BlogSite } from "../types";
import { NICHE_OPTIONS } from "../types";

interface GenerationQuota {
  limit: number | null;
  usedToday: number;
  remaining: number | null;
  unlimited?: boolean;
}

type DeployPhase = "idle" | "setup" | "generating" | "publishing" | "complete" | "error";

const DEPLOY_LOADING_STEPS = [
  "Scanning your affiliate offer page…",
  "Researching your niche and product angle…",
  "Writing high-converting sales copy…",
  "Applying your chosen template design…",
  "Building your product promotion page…",
  "Preparing to publish your website…",
];

async function postJson(
  url: string,
  body: unknown
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> | null }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: Record<string, unknown> | null = null;
  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : null;
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

function busyError(status: number): string {
  if (status === 502 || status === 503 || status === 504 || status === 408 || status === 0) {
    return "The server got busy and timed out. Click Try Deploy Again to continue.";
  }
  return "The server returned an unexpected response. Click Try Deploy Again.";
}

function linkFingerprint(links: ArmedLink[]): string {
  return links
    .map((l) => l.url.trim())
    .filter(Boolean)
    .sort()
    .join("|");
}

function siteMatchesWizard(
  site: BlogSite,
  hobby: string,
  territory: string,
  armedLinks: ArmedLink[]
): boolean {
  const niche = (territory.trim() || hobby.trim()).toLowerCase();
  const siteNiche = getSiteTerritory(site).trim().toLowerCase();
  const siteLinks = linkFingerprint((site.armed_links ?? []) as ArmedLink[]);
  const currentLinks = linkFingerprint(armedLinks);
  return Boolean(niche) && siteNiche === niche && siteLinks === currentLinks;
}

export default function DeployAssetPage() {
  const router = useRouter();
  const {
    sessionLoaded,
    linksArmed,
    themeChosen,
    hobby,
    territory,
    niche,
    themeConfig,
    deployArmedLinks,
    deployed,
    generationLog,
    setGenerating,
    markDeployed,
    appendLog,
    beginNewSiteGeneration,
  } = useBlogBuilder();

  const [phase, setPhase] = useState<DeployPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [site, setSite] = useState<BlogSite | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [deployLoaded, setDeployLoaded] = useState(false);
  const [canResume, setCanResume] = useState(false);
  const [resumeLabel, setResumeLabel] = useState("");
  const [quota, setQuota] = useState<GenerationQuota | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showOfferBanner, setShowOfferBanner] = useState(false);
  const deployRunning = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isGenerating = phase === "generating" || phase === "publishing";

  useScrollToResult(isGenerating, resultsRef);

  const bumpProgress = (target: number) => {
    setProgress((current) => Math.max(current, target));
  };

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!linksArmed) router.replace("/arm-links");
    else if (!territory.trim() && !niche.trim()) router.replace("/territory");
    else if (!themeChosen) router.replace("/theme");
  }, [linksArmed, themeChosen, territory, niche, sessionLoaded, router]);

  useEffect(() => {
    if (!sessionLoaded) return;

    let cancelled = false;

    async function loadDeployState() {
      try {
        const res = await fetch("/api/blog/deploy-state", { cache: "no-store" });
        const data = res.ok ? await res.json() : null;
        if (cancelled || !data) return;

        if (data.quota) setQuota(data.quota as GenerationQuota);

        const loadedSite = data.site as BlogSite | null;
        const matchesCurrent =
          loadedSite && siteMatchesWizard(loadedSite, hobby, territory, deployArmedLinks);
        const isSessionSite =
          !data.session?.site_id || !loadedSite || data.session.site_id === loadedSite.id;

        if (loadedSite && matchesCurrent && isSessionSite) {
          setSite(loadedSite);

          if (data.session?.deployed || deployed) {
            setPhase("complete");
            setProgress(100);
          } else if (data.canResume) {
            setCanResume(true);
            if (data.isProductSite && !loadedSite.sales_page_html) {
              setResumeLabel("Continue — finish building your product page");
            } else if (data.isProductSite && loadedSite.sales_page_html) {
              setResumeLabel("Publish your product website");
            } else {
              setResumeLabel("Continue deployment");
            }
          }
        }
      } finally {
        if (!cancelled) setDeployLoaded(true);
      }
    }

    loadDeployState();
    return () => {
      cancelled = true;
    };
  }, [sessionLoaded, deployed, hobby, territory, deployArmedLinks]);

  const bootstrapping = phase === "setup" || phase === "generating";

  useEffect(() => {
    if (!bootstrapping) return;
    setLoadingStep(0);
    const timer = setInterval(() => {
      setLoadingStep((step) => (step + 1) % DEPLOY_LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [bootstrapping]);

  const prepareFreshDeploy = () => {
    beginNewSiteGeneration();
    setPhase("idle");
    setSite(null);
    setProductName(null);
    setCanResume(false);
    setError(null);
    setProgress(0);
  };

  const publishSite = async (siteId: string, siteSlug: string) => {
    setPhase("publishing");
    bumpProgress(92);
    appendLog("Publishing your product website...");

    const { ok: pubOk, status: pubStatus, data: pubData } = await postJson("/api/blog/publish", {
      siteId,
    });
    if (!pubOk) throw new Error((pubData?.error as string) || busyError(pubStatus));

    bumpProgress(100);
    appendLog("Your product promotion website is live.");
    markDeployed(siteId, siteSlug);
    setPhase("complete");
    setCanResume(false);
    setGenerating(false);
  };

  const deploy = async (resume = false) => {
    if (deployRunning.current) return;
    deployRunning.current = true;

    setError(null);
    setCanResume(false);
    setGenerating(true);
    setShowOfferBanner(true);

    const deployNicheLabel =
      NICHE_OPTIONS.find((n) => n.value === niche)?.label ??
      (territory.trim() || hobby.trim() || niche.trim());

    if (!deployNicheLabel) {
      setError("Missing niche — go back to Step 2 and pick a niche first.");
      setPhase("error");
      setGenerating(false);
      deployRunning.current = false;
      return;
    }

    if (deployArmedLinks.length === 0 && !resume) {
      setError("No product links found — go back to Step 1 and add at least one affiliate link.");
      setPhase("error");
      setGenerating(false);
      deployRunning.current = false;
      return;
    }

    let resumeSiteId: string | null = site?.id ?? null;

    try {
      let activeSite = site;
      let productContext = "";
      let scrapedTitle: string | undefined;
      let scrapedDescription: string | undefined;

      const affiliateUrl = deployArmedLinks[0]?.url;

      if (affiliateUrl) {
        appendLog("Scanning affiliate offer page...");
        try {
          const scrapeRes = await fetch("/api/blog/scrape", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: affiliateUrl }),
          });
          const scrapeData = await scrapeRes.json();
          if (scrapeRes.ok) {
            productContext = scrapeData.context || "";
            scrapedTitle = scrapeData.data?.title;
            scrapedDescription = scrapeData.data?.description;
            appendLog(scrapeData.cached ? "Offer page loaded from cache." : "Offer page scanned.");
          }
        } catch {
          appendLog("Could not scan offer page — using niche defaults.");
        }
      }

      if (resume && activeSite?.sales_page_html) {
        setPhase("generating");
        bumpProgress(85);
        await publishSite(activeSite.id, activeSite.slug);
        deployRunning.current = false;
        return;
      }

      if (!resume || !activeSite) {
        setPhase("setup");
        setProgress(0);
        setSite(null);
        setProductName(null);
        beginNewSiteGeneration();

        appendLog("Creating your product website record...");
        bumpProgress(10);

        const { ok: createOk, status: createStatus, data: createData } = await postJson(
          "/api/blog/create-site",
          {
            hobby: deployNicheLabel,
            territory: deployNicheLabel,
            armedLinks: deployArmedLinks,
            themeConfig,
          }
        );
        if (!createOk || !createData) {
          throw new Error((createData?.error as string) || busyError(createStatus));
        }
        if (createData.quota) setQuota(createData.quota as GenerationQuota);

        activeSite = createData.site as BlogSite;
        setSite(activeSite);
        resumeSiteId = activeSite.id;
        bumpProgress(20);
      }

      if (!activeSite) throw new Error("Site record missing");

      if (!activeSite.sales_page_html) {
        setPhase("generating");
        appendLog("Writing sales copy and building your themed product page...");
        bumpProgress(35);

        const { ok: genOk, status: genStatus, data: genData } = await postJson(
          "/api/blog/generate-product-site",
          {
            siteId: activeSite.id,
            niche: deployNicheLabel,
            armedLinks: deployArmedLinks,
            themeConfig,
            productContext,
            scrapedTitle,
            scrapedDescription,
          }
        );

        if (!genOk || !genData) {
          throw new Error((genData?.error as string) || busyError(genStatus));
        }

        activeSite = genData.site as BlogSite;
        setSite(activeSite);
        setProductName((genData.productName as string) || activeSite.title);
        bumpProgress(85);
        appendLog(`Product page ready: ${genData.productName || activeSite.title}`);
      }

      await publishSite(activeSite.id, activeSite.slug);
    } catch (e) {
      let msg = e instanceof Error ? e.message : "Deploy failed";
      if (msg === "Unauthorized") {
        msg = "Not signed in. Please log in at /login and try again.";
      }
      appendLog(`Error: ${msg}`);

      if (resumeSiteId) {
        setCanResume(true);
        setResumeLabel("Continue — finish building your product page");
      }

      setError(msg);
      setPhase("error");
      setGenerating(false);
    } finally {
      deployRunning.current = false;
    }
  };

  if (!sessionLoaded || !deployLoaded) {
    return <p className="text-[#6b7280] text-sm animate-pulse">Loading your deploy session...</p>;
  }

  const terminalPhase =
    phase === "complete"
      ? "complete"
      : phase === "setup" || phase === "generating" || phase === "publishing"
        ? "running"
        : "idle";

  const showContent =
    Boolean(site) &&
    (phase === "generating" || phase === "publishing" || phase === "error");
  const isComplete = phase === "complete" && Boolean(site);

  return (
    <div className="deploy-page-shell page-stack page-container w-full">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Step 4</p>
        <h1 className="brand-font text-2xl sm:text-3xl lg:text-4xl text-[#C5C6C7] tracking-tight">
          {isComplete ? "Your Website Is Live" : "Launch Your Product Website"}
        </h1>
        {!isComplete && (
          <p className="text-[#9fb0b5] text-base sm:text-lg max-w-2xl leading-relaxed">
            We build a niche product promotion page styled with your chosen template — complete with
            sales copy, benefits, FAQs, and your affiliate link on every button. Then it goes live
            instantly.
          </p>
        )}
        {!isComplete && quota && !quota.unlimited && (
          <p className="text-xs text-[#45A29E]/90">
            {quota.remaining} of {quota.limit} new websites remaining today ({quota.usedToday}{" "}
            generated).
          </p>
        )}
      </div>

      {bootstrapping && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#45A29E]/20 bg-black/40 p-4 sm:p-5 flex flex-col gap-3"
        >
          <AiLoadingBar
            label={DEPLOY_LOADING_STEPS[loadingStep]}
            progress={progress}
            active
            className="w-full"
          />
          <p className="text-[11px] text-[#6b7280] leading-relaxed">
            Building your product promotion website with AI copy and your selected template…
          </p>
        </motion.div>
      )}

      {phase === "setup" && (
        <GenerationTerminal phase={terminalPhase} progress={progress} logLines={generationLog} />
      )}

      {showContent && site && (
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-w-0 max-w-full flex-col gap-4 scroll-mt-24 overflow-x-clip"
        >
          <DeploySitePreview site={site} />

          {(phase === "generating" || phase === "publishing") && (
            <GenerationProgress
              active
              label={
                phase === "publishing"
                  ? "Publishing your product website"
                  : "Generating your product promotion page"
              }
            />
          )}
        </motion.div>
      )}

      {isComplete && site && (
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-w-0 max-w-full flex-col gap-5 scroll-mt-24 overflow-x-clip"
        >
          <div className="rounded-2xl border border-[#45A29E]/25 bg-[#45A29E]/5 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="shrink-0 text-[#45A29E]" size={32} />
              <div className="min-w-0">
                <p className="brand-font text-lg sm:text-xl text-[#C5C6C7]">
                  {productName || site.title}
                </p>
                <p className="mt-1 text-sm text-[#9fb0b5]">
                  Published and ready to share. Open it below or start another site.
                </p>
              </div>
            </div>
          </div>

          <DeploySitePreview site={site} showLiveLink />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <motion.button
              type="button"
              onClick={() => {
                prepareFreshDeploy();
                router.push("/territory");
              }}
              whileHover={{ scale: 1.01 }}
              className="w-full py-4 px-4 rounded-xl font-bold text-base text-[#0B0C10] border border-[#D4AF37]/40"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #b8942a 100%)",
                boxShadow: "0 0 40px rgba(212, 175, 55, 0.25)",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Rocket size={18} />
                Generate Another Site
              </span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push("/asset")}
              whileHover={{ scale: 1.01 }}
              className="w-full py-4 px-4 rounded-xl font-bold text-base text-[#0B0C10]"
              style={{
                background: "linear-gradient(135deg, #45A29E 0%, #2d7a76 100%)",
                boxShadow: "0 0 40px rgba(69, 162, 158, 0.35)",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                View Asset Vault
                <ArrowRight size={18} />
              </span>
            </motion.button>
          </div>

          {showOfferBanner && (
            <EarningsBanner compact onDismiss={() => setShowOfferBanner(false)} />
          )}
        </motion.div>
      )}

      {error && (
        <p className="text-sm text-red-400/90 text-center rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          {error}
        </p>
      )}

      {phase === "idle" && !canResume && (
        <GenerationTerminal phase="idle" progress={0} logLines={generationLog} />
      )}

      {phase === "idle" && canResume && (
        <motion.button
          type="button"
          onClick={() => deploy(true)}
          whileHover={{ scale: 1.01 }}
          className="w-full max-w-lg mx-auto py-4 sm:py-5 px-4 sm:px-8 rounded-xl font-bold text-base sm:text-lg text-[#0B0C10]"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #b8942a 100%)",
            boxShadow: "0 0 40px rgba(212, 175, 55, 0.35)",
          }}
        >
          <span className="flex items-center justify-center gap-3">
            <RotateCcw size={20} />
            {resumeLabel || "Continue Deployment"}
          </span>
        </motion.button>
      )}

      {phase === "idle" && !canResume && (
        <motion.button
          type="button"
          onClick={() => deploy(false)}
          disabled={!quota?.unlimited && quota !== null && (quota.remaining ?? 0) <= 0}
          whileHover={{ scale: !quota?.unlimited && quota !== null && (quota.remaining ?? 0) <= 0 ? 1 : 1.01 }}
          className="w-full max-w-lg mx-auto py-4 sm:py-5 px-4 sm:px-8 rounded-xl font-bold text-base sm:text-lg text-[#0B0C10] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #45A29E 0%, #2d7a76 100%)",
            boxShadow: "0 0 40px rgba(69, 162, 158, 0.35)",
          }}
        >
          <span className="flex items-center justify-center gap-3">
            <Rocket size={22} />
            Launch My Product Website
            <ArrowRight size={22} />
          </span>
        </motion.button>
      )}

      {phase === "error" && (
        <motion.button
          type="button"
          onClick={() => deploy(canResume)}
          whileHover={{ scale: 1.01 }}
          className="w-full max-w-lg mx-auto py-4 sm:py-5 px-4 sm:px-8 rounded-xl font-bold text-base sm:text-lg text-[#0B0C10] border border-[#45A29E]/40"
          style={{
            background: "linear-gradient(135deg, #45A29E 0%, #2d7a76 100%)",
          }}
        >
          <span className="flex items-center justify-center gap-3">
            <RotateCcw size={20} />
            Try Deploy Again
          </span>
        </motion.button>
      )}
    </div>
  );
}
