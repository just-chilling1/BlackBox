"use client";

import { useEffect, useMemo, useRef } from "react";
import { parseSalesPageDocument } from "../lib/product-sales-page-html";

interface QuestionnaireSiteEmbedProps {
  html: string;
}

/** Client-only mount avoids hydration mismatch from inline scripts in stored HTML. */
export function QuestionnaireSiteEmbed({ html }: QuestionnaireSiteEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { styles, bodyHtml, scripts, googleFontsUrl } = useMemo(
    () => parseSalesPageDocument(html),
    [html]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = bodyHtml;

    const injectedScripts: HTMLScriptElement[] = [];
    for (const content of scripts) {
      const script = document.createElement("script");
      script.textContent = content;
      container.appendChild(script);
      injectedScripts.push(script);
    }

    return () => {
      for (const script of injectedScripts) {
        script.remove();
      }
      container.innerHTML = "";
    };
  }, [bodyHtml, scripts]);

  return (
    <>
      {googleFontsUrl ? (
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      ) : null}
      {googleFontsUrl ? (
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      ) : null}
      {googleFontsUrl ? <link rel="stylesheet" href={googleFontsUrl} /> : null}
      {styles ? <style dangerouslySetInnerHTML={{ __html: styles }} /> : null}
      <div ref={containerRef} className="min-h-screen isolate" />
    </>
  );
}
