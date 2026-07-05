"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TopicCard } from "@/components/TopicCard";
import { topics } from "@/lib/topics";
import { loadProgress, loadSettings } from "@/lib/storage";
import { AppSettings, ProgressEntry, TopicSlug } from "@/lib/types";

export default function DashboardPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [progress, setProgress] = useState<Record<TopicSlug, ProgressEntry> | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
    setProgress(loadProgress());
  }, []);

  return (
    <section>
      <PageHeader title="Klausurtraining" eyebrow="Lokal, kostenlos, privat" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard
            key={topic.slug}
            topic={topic}
            progress={topic.slug !== "test" ? progress?.[topic.slug] : undefined}
            disabled={topic.slug !== "test" && settings ? !settings.topics[topic.slug].enabled : false}
          />
        ))}
      </div>
    </section>
  );
}
