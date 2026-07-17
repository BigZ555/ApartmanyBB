"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Globe, LogIn, LogOut, Home } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Header() {
  const { locale, setLocale, t } = useLanguage();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()
          .then(({ data }) =>
            setIsAdmin(data?.role?.trim().toLowerCase() === "admin")
          );
      } else {
        setIsAdmin(false);
      }
    });
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[var(--color-primary)]">
          <Home className="w-5 h-5" />
          <span>ApartmanyBB</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/apartments"
            className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] transition-colors"
          >
            {t.nav.apartments}
          </Link>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Globe className="w-4 h-4 text-gray-500 ml-1" />
            <button
              onClick={() => setLocale("sk")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                locale === "sk"
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              SK
            </button>
            <button
              onClick={() => setLocale("hu")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                locale === "hu"
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              HU
            </button>
          </div>

          {isAdmin ? (
            <>
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                {t.nav.admin}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.nav.logout}</span>
              </button>
            </>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.login}</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
