"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Construction, ArrowLeft } from "lucide-react";

export default function BServisPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center section-padding">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
          <Construction className="w-12 h-12 text-[var(--color-accent)]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
          {t.bServis.title}
        </h1>
        <p className="text-xl font-medium text-[var(--color-accent)] mb-3">
          {t.bServis.underWork}
        </p>
        <p className="text-[var(--color-text-muted)] mb-8">{t.bServis.underWorkDesc}</p>
        <Link href="/" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          {t.bServis.backHome}
        </Link>
      </div>
    </div>
  );
}
