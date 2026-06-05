import type { Metadata } from "next";
import { Cairo, Tajawal, Almarai, Readex_Pro, IBM_Plex_Sans_Arabic, Rubik } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] });
const tajawal = Tajawal({ variable: "--font-tajawal", subsets: ["arabic", "latin"], weight: ["300", "400", "500", "700"] });
const almarai = Almarai({ variable: "--font-almarai", subsets: ["arabic"], weight: ["300", "400", "700", "800"] });
const readexPro = Readex_Pro({ variable: "--font-readex-pro", subsets: ["arabic", "latin"] });
const ibmPlex = IBM_Plex_Sans_Arabic({ variable: "--font-ibm-plex", subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600", "700"] });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "FBT.sa | معرض الأعمال الشخصي",
  description: "الموقع الشخصي ومعرض أعمال FBT.sa لمشاريع تطوير الويب والخدمات التقنية.",
};

import { Toaster } from 'sonner';
import { DynamicCssInjector } from '@/components/ui/DynamicCssInjector';

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`dark ${cairo.variable} ${tajawal.variable} ${almarai.variable} ${readexPro.variable} ${ibmPlex.variable} ${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <DynamicCssInjector />
        {children}
        <Toaster richColors position="bottom-left" />
      </body>
    </html>
  );
}
