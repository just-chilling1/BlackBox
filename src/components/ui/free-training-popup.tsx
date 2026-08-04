"use client";

import { useEffect, useRef, useState } from "react";

const FREE_TRAINING_URL = "https://the7figuresociety.com/earn-1k-2k-per-day";

const PLAYER_ID = "vid-6a723793e82132383c2edc33";
const PLAYER_SCRIPT_SRC =
  "https://scripts.converteai.net/e9cd97bc-7bc8-4a23-bb2f-224a56a84d6b/players/6a723793e82132383c2edc33/v4/player.js";
const COUNTDOWN_SECONDS = 10 * 60;
const OPEN_DELAY_MS = 1200;
const SESSION_SHOWN_KEY = "bb_free_training_popup_shown";

const POPUP_STYLES = `
@keyframes ftpPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
.ftp-cta-pulse{animation:ftpPulse 1.6s ease-in-out infinite}
.ftp-popup-card{display:grid;grid-template-columns:1fr}
@media (min-width:768px){.ftp-popup-card{grid-template-columns:1.25fr 1fr;align-items:stretch;overflow:hidden}}
.ftp-video-shell{background:#000;min-width:0}
@media (max-width:767px){.ftp-video-host{aspect-ratio:16/9;width:100%}}
@media (min-width:768px){
  .ftp-video-shell{height:100%;min-height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
  .ftp-video-host{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
  .ftp-video-host vturb-smartplayer{display:block!important;margin:0 auto!important;padding-top:0!important}
  .ftp-video-host .vturb-player-placeholder{padding-top:0!important;width:100%!important;height:100%!important}
  .ftp-video-host iframe,.ftp-video-host video{width:100%!important;height:100%!important;object-fit:cover}
}
`;

function loadVturbPlayerScript(scriptSrc: string, playerId: string) {
  document
    .querySelectorAll(`script[data-vturb-player="${playerId}"]`)
    .forEach((node) => node.remove());

  const script = document.createElement("script");
  script.src = scriptSrc;
  script.async = true;
  script.dataset.vturbPlayer = playerId;
  document.head.appendChild(script);
}

function fitVturbPlayer(host: HTMLElement) {
  if (window.innerWidth < 768) return;

  const shell = host.closest(".ftp-video-shell") as HTMLElement | null;
  const player = host.querySelector("vturb-smartplayer") as HTMLElement | null;
  if (!shell || !player) return;

  const shellHeight = shell.clientHeight;
  const shellWidth = host.clientWidth;
  if (shellHeight < 1 || shellWidth < 1) return;

  const ratio = 16 / 9;
  let width = shellWidth;
  let height = width / ratio;
  if (height > shellHeight) {
    height = shellHeight;
    width = height * ratio;
  }

  player.style.width = `${Math.floor(width)}px`;
  player.style.height = `${Math.floor(height)}px`;
  player.style.maxWidth = "100%";
  player.style.maxHeight = "100%";

  host.querySelectorAll(".vturb-player-placeholder, iframe, video").forEach((node) => {
    const el = node as HTMLElement;
    el.style.paddingTop = "0";
    el.style.width = "100%";
    el.style.height = "100%";
    if (el.tagName === "VIDEO") {
      (el as HTMLVideoElement).style.objectFit = "cover";
    }
  });
}

function watchVturbPlayer(host: HTMLElement) {
  const run = () => fitVturbPlayer(host);
  run();

  const observer = new MutationObserver(run);
  observer.observe(host, { childList: true, subtree: true, attributes: true });

  const onResize = () => run();
  window.addEventListener("resize", onResize);

  const poll = window.setInterval(run, 400);
  const stopPoll = window.setTimeout(() => window.clearInterval(poll), 10000);

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    window.clearInterval(poll);
    window.clearTimeout(stopPoll);
  };
}

export function FreeTrainingPopup() {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const playerHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_SHOWN_KEY) === "1") return;

    sessionStorage.setItem(SESSION_SHOWN_KEY, "1");

    const timer = setTimeout(() => {
      setSecondsLeft(COUNTDOWN_SECONDS);
      setOpen(true);
    }, OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (!open || !playerHostRef.current) return;

    const host = playerHostRef.current;
    host.innerHTML = "";

    const player = document.createElement("vturb-smartplayer");
    player.id = PLAYER_ID;
    player.setAttribute("style", "display: block; width: 100%;");

    const placeholder = document.createElement("div");
    placeholder.className = "vturb-player-placeholder";
    placeholder.setAttribute(
      "style",
      "position: relative; width: 100%; z-index: 0; background-color: black;"
    );
    player.appendChild(placeholder);
    host.appendChild(player);

    let stopWatch = () => {};

    const mountTimer = window.setTimeout(() => {
      loadVturbPlayerScript(PLAYER_SCRIPT_SRC, PLAYER_ID);
      stopWatch = watchVturbPlayer(host);
    }, 0);

    return () => {
      window.clearTimeout(mountTimer);
      stopWatch();
      host.innerHTML = "";
    };
  }, [open]);

  if (!open) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 sm:p-6">
      <style>{POPUP_STYLES}</style>
      <div className="ftp-popup-card relative max-h-[92dvh] w-full max-w-[980px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-2 z-10 rounded-full bg-white/80 px-2 py-0.5 text-xl leading-none text-gray-400 transition-colors hover:text-gray-700"
        >
          &#10005;
        </button>
        <div className="ftp-video-shell">
          <div ref={playerHostRef} className="ftp-video-host" />
        </div>
        <div className="flex flex-col items-center gap-3 px-5 py-6 text-center sm:gap-4 sm:px-7 sm:py-8 md:justify-center">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Free Training
          </span>
          <h2 className="text-lg font-extrabold leading-snug text-gray-900 sm:text-[22px]">
            Wake Up With An Extra $1,000&ndash;$5,000 In Your Bank Account Tomorrow
          </h2>
          <p className="text-[13px] leading-relaxed text-gray-500 sm:text-sm">
            Discover how to scale to $1,000&ndash;$5,000 every single day &mdash; without doing any
            extra work.
          </p>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-red-700">
              This offer expires in
            </span>
            <span className="text-4xl font-extrabold tabular-nums text-gray-900 sm:text-5xl">
              {minutes}:{seconds}
            </span>
          </div>
          <a
            href={FREE_TRAINING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ftp-cta-pulse block w-full rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 px-5 py-4 text-base font-extrabold text-gray-900 shadow-[0_10px_26px_rgba(245,158,11,0.45)] sm:text-lg"
          >
            Watch The Free Training &gt;&gt;
          </a>
          <span className="text-xs text-gray-400">Warning: This will be taken down soon</span>
        </div>
      </div>
    </div>
  );
}
