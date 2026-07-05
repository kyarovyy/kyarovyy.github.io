"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProgressEntry, Topic } from "@/lib/types";

export function TopicCard({ topic, progress, disabled }: { topic: Topic; progress?: ProgressEntry; disabled?: boolean }) {
  const attempted = progress?.attempted ?? 0;
  const rate = attempted ? Math.round(((progress?.correct ?? 0) / attempted) * 100) : 0;

  return (
    <article className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
      <div className="flex min-h-32 flex-col justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">{topic.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">{topic.description}</p>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between text-sm text-ink/70">
            <span>{attempted} Aufgaben</span>
            <span>{rate}% richtig</span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-black/10">
            <div className="h-full bg-gold" style={{ width: `${rate}%` }} />
          </div>
          <Link
            href={topic.slug === "test" ? "/test" : `/topics/${topic.slug}`}
            className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
              disabled ? "pointer-events-none bg-black/10 text-ink/40" : "bg-ink text-white hover:bg-leaf"
            }`}
          >
            Üben
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
