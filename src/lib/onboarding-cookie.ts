import type { NextResponse } from "next/server";

export const ONBOARDING_COMPLETE_COOKIE = "bb_onboarding_complete";
export const ONBOARDING_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function setOnboardingCompleteCookie(response: NextResponse): void {
  response.cookies.set(ONBOARDING_COMPLETE_COOKIE, "1", {
    maxAge: ONBOARDING_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}
