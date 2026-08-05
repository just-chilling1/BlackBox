import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/brand.config";
import { storageKeys } from "@/lib/storage-keys";
import { AppProviders } from "@/components/layout/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: brand.metadata.title,
  description: brand.metadata.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo-icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: brand.productName,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: brand.colors.sidebar,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
      style={{ colorScheme: "light" }}
    >
      <head>
        <Script
          id="sidebar-collapse-restore"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k=${JSON.stringify(storageKeys.sidebarCollapsed)};if(localStorage.getItem(k)==='1'){document.documentElement.dataset.sidebar='collapsed';document.documentElement.style.setProperty('--sidebar-w','76px');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="text-text-primary selection:bg-brass-200 antialiased"
        style={{ backgroundColor: brand.colors.page }}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
