import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/brand.config";
import { storageKeys } from "@/lib/storage-keys";
import { AppProviders } from "@/components/layout/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: brand.metadata.title,
  description: brand.metadata.description,
  icons: {
    icon: brand.logo.type === "image" ? "/favicon.png" : "/favicon.ico",
    apple: brand.logo.type === "image" ? "/apple-touch-icon.png" : "/favicon.ico",
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
      className={`${inter.variable} ${outfit.variable}`}
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
        className="text-text-primary selection:bg-accent/30 antialiased"
        style={{ backgroundColor: brand.colors.page }}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
