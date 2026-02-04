import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#035BCB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: "Shipex | Global Shipping Management",
    template: "%s | Shipex"
  },
  description: "Advanced multi-tenant shipping management system for merchants and couriers.",
  manifest: "/manifest.json",
  keywords: ["shipping", "logistics", "management", "SaaS", "ecommerce"],
  authors: [{ name: "Shipex Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shipex.io",
    siteName: "Shipex",
    title: "Shipex | Shipping Management Platform",
    description: "Scale your shipping operations with our premium dashboard ecosystem.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipex | Professional Logistics",
    description: "The complete ecosystem for modern shipping operations.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shipex",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <div className="aurora-bg">
                <div className="aurora-circle" style={{
                  top: '10%',
                  left: '20%',
                  width: '500px',
                  height: '500px',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)'
                }} />
                <div className="aurora-circle" style={{
                  top: '60%',
                  right: '10%',
                  width: '600px',
                  height: '600px',
                  background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)'
                }} />
              </div>
              <div className="grain-overlay" />
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'dark:bg-background-card-dark dark:text-text-main-dark',
          }}
        />
      </body>
    </html>
  );
}
