"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { practiceTopics } from "@/lib/topics";
import { loadSettings } from "@/lib/storage";
import { AppSettings } from "@/lib/types";

export default function TopicsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => setSettings(loadSettings()), []);

  return (
    <section>
      <PageHeader title="Themenbereiche" eyebrow="Nur aktivierte Inhalte werden abgefragt" />
      <div className="space-y-3">
        {practiceTopics.map((topic) => {
          const enabled = settings?.topics[topic.slug].enabled ?? true;
          return (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className={`focus-ring block rounded-lg border border-black/10 bg-white p-5 shadow-soft ${
                enabled ? "hover:border-leaf" : "opacity-45"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-ink">{topic.title}</h2>
                  <p className="mt-1 text-sm text-ink/65">{topic.description}</p>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${enabled ? "bg-leaf/10 text-leaf" : "bg-black/10 text-ink/50"}`}>
                  {enabled ? "aktiv" : "deaktiviert"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
