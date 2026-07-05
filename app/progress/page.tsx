"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { practiceTopics } from "@/lib/topics";
import { loadProgress } from "@/lib/storage";
import { ProgressEntry, TopicSlug } from "@/lib/types";

export default function ProgressPage() {
  const [progress, setProgress] = useState<Record<TopicSlug, ProgressEntry> | null>(null);

  useEffect(() => setProgress(loadProgress()), []);

  return (
    <section>
      <PageHeader title="Fortschritt" eyebrow="Lokal gespeichert" />
      <div className="grid gap-4 lg:grid-cols-2">
        {practiceTopics.map((topic) => {
          const entry = progress?.[topic.slug] ?? { attempted: 0, correct: 0, incorrect: 0 };
          const errorRate = entry.attempted ? Math.round((entry.incorrect / entry.attempted) * 100) : 0;
          return (
            <article key={topic.slug} className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
              <h2 className="font-semibold text-ink">{topic.title}</h2>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md bg-black/5 p-3">
                  <p className="text-2xl font-semibold">{entry.attempted}</p>
                  <p className="text-xs text-ink/60">bearbeitet</p>
                </div>
                <div className="rounded-md bg-leaf/10 p-3 text-leaf">
                  <p className="text-2xl font-semibold">{entry.correct}</p>
                  <p className="text-xs">richtig</p>
                </div>
                <div className="rounded-md bg-coral/10 p-3 text-coral">
                  <p className="text-2xl font-semibold">{errorRate}%</p>
                  <p className="text-xs">Fehlerquote</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink/60">
                Letzte Übung: {entry.lastPractice ? new Date(entry.lastPractice).toLocaleString("de-DE") : "noch keine"}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
