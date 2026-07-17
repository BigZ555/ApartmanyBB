import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApartmanyBB",
  description: "BB Apartmány – ubytovanie v srdci mesta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="bg-[var(--color-primary)] text-white py-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} ApartmanyBB. All rights reserved.</p>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
