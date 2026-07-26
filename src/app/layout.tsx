import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { brand } from "@/config/brand.config";
import { storageKeys } from "@/lib/storage-keys";
import { AppProviders } from "@/components/layout/AppProviders";

export const metadata: Metadata = {
  title: brand.metadata.title,
  description: brand.metadata.description,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: brand.productName,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: brand.colors.page,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        className="text-white selection:bg-accent/30 antialiased"
        style={{ backgroundColor: brand.colors.page }}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
