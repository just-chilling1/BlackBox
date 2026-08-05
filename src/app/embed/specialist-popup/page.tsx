"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SpecialistWelcomePopup } from "@/components/ui/specialist-welcome-popup";

function EmbedInner() {
  const searchParams = useSearchParams();
  const previewParam = searchParams.get("preview");
  const previewSecret = process.env.NEXT_PUBLIC_SPECIALIST_POPUP_PREVIEW_SECRET;
  const preview =
    (process.env.NODE_ENV === "development" && previewParam === "1") ||
    (!!previewSecret && previewParam === previewSecret);

  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
  }, []);

  const notifyParent = useCallback((open: boolean) => {
    try {
      window.parent?.postMessage({ type: "bb-specialist-popup", open }, "*");
    } catch {
      // host page may block messaging
    }
  }, []);

  return <SpecialistWelcomePopup forceOpen={preview} onOpenChange={notifyParent} />;
}

export default function SpecialistPopupEmbedPage() {
  return (
    <Suspense fallback={null}>
      <EmbedInner />
    </Suspense>
  );
}
