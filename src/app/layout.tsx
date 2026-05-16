import type { Metadata } from "next";
import Script from "next/script";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Triman | Learning Journal",
  description:
    "A cozy digital journal documenting the journey of a curious self-learner growing alongside AI.",
  keywords: ["learning", "AI", "journal", "self-learner", "documentation"],
  icons: {
    icon: "/logo%20png.png",
  },
  openGraph: {
    title: "Triman | Learning Journal",
    description:
      "Just a self-learner trying to keep up with AI, documenting what I learn along the way.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo%20png.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/logo%20dark.png" media="(prefers-color-scheme: dark)" />
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
                var link = document.querySelector("link[rel='icon']") || document.createElement('link');
                link.rel = 'icon';
                link.href = isDark ? '/logo%20dark.png' : '/logo%20png.png';
                document.head.appendChild(link);
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
