import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Toaster } from "sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Indigo Commerce | Enterprise Dashboard",
  description: "Billion-dollar SaaS e-commerce intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${inter.variable} font-sans antialiased`}>
        <Providers>
          <DashboardLayout>
            {children}
          </DashboardLayout>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
