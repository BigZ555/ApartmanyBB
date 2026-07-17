"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Building2, Home, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center section-padding">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-3">
          {t.home.title}
        </h1>
        <p className="text-lg text-[var(--color-text-muted)]">{t.home.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
        <Link href="/b-servis" className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
              <Building2 className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
              {t.home.company}
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">{t.home.companyDesc}</p>
            <span className="inline-flex items-center gap-2 text-[var(--color-accent)] font-medium group-hover:gap-3 transition-all">
              {t.home.select}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        <Link href="/apartments" className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors">
              <Home className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
              {t.home.apartments}
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">{t.home.apartmentsDesc}</p>
            <span className="inline-flex items-center gap-2 text-[var(--color-accent)] font-medium group-hover:gap-3 transition-all">
              {t.home.select}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
