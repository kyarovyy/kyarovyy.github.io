"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { generateExercise } from "@/lib/generators";
import { getTopic, practiceTopics } from "@/lib/topics";
import { loadSettings, saveCurrentExercise } from "@/lib/storage";
import { TopicSlug } from "@/lib/types";

export function TopicStartClient({ topicSlug }: { topicSlug: TopicSlug }) {
  const router = useRouter();
  const topic = getTopic(topicSlug);

  function startExercise() {
    const settings = loadSettings();
    const enabledTopics = practiceTopics.filter((item) => settings.topics[item.slug].enabled).map((item) => item.slug);
    const difficulty = settings.topics[topicSlug]?.difficulty ?? "easy";
    const exercise = generateExercise(topicSlug, difficulty, enabledTopics);
    saveCurrentExercise(JSON.stringify(exercise));
    router.push("/practice");
  }

  if (!topic || topic.slug === "test") return <PageHeader title="Thema nicht gefunden" />;

  return (
    <section className="max-w-3xl">
      <PageHeader title={topic.title} eyebrow="Üben" />
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
        <p className="text-ink/70">{topic.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {topic.subtopics.map((subtopic) => (
            <span key={subtopic} className="rounded-md bg-black/5 px-2 py-1 text-sm text-ink/70">
              {subtopic}
            </span>
          ))}
        </div>
        <button
          onClick={startExercise}
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 font-semibold text-white hover:bg-leaf"
        >
          <Play size={18} aria-hidden />
          Neuen Fall starten
        </button>
      </div>
    </section>
  );
}
