"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

interface ContactFormProps {
  email: string;
}

export default function ContactForm({ email }: ContactFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: senderEmail,
          message,
          to: email,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setSenderEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">{t.apartments.name}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
      </div>
      <div>
        <label className="label">{t.apartments.email}</label>
        <input
          type="email"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          required
          className="input-field"
        />
      </div>
      <div>
        <label className="label">{t.apartments.message}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="input-field resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending" || status === "sent"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === "sending" ? (
          t.apartments.sending
        ) : status === "sent" ? (
          <>
            <CheckCircle className="w-4 h-4" />
            {t.apartments.sent}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {t.apartments.send}
          </>
        )}
      </button>

      {status === "error" && (
        <p className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {t.apartments.error}
        </p>
      )}
    </form>
  );
}
