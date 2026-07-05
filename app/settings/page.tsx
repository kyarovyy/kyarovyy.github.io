"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { practiceTopics } from "@/lib/topics";
import { loadSettings, resetAllLocalData, saveSettings } from "@/lib/storage";
import { AppSettings, Difficulty } from "@/lib/types";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => setSettings(loadSettings()), []);

  function commit(next: AppSettings) {
    setSettings(next);
    saveSettings(next);
  }

  if (!settings) return <PageHeader title="Settings" />;

  return (
    <section className="max-w-5xl">
      <PageHeader title="Settings" eyebrow="Themen und Unterthemen steuern" />
      <div className="space-y-4">
        {practiceTopics.map((topic) => {
          const topicSettings = settings.topics[topic.slug];
          return (
            <div key={topic.slug} className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-ink">{topic.title}</h2>
                  <p className="mt-1 text-sm text-ink/60">{topic.description}</p>
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={topicSettings.enabled}
                    onChange={(event) =>
                      commit({
                        ...settings,
                        topics: {
                          ...settings.topics,
                          [topic.slug]: { ...topicSettings, enabled: event.target.checked }
                        }
                      })
                    }
                  />
                  Aktiv
                </label>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
                <label className="block">
                  <span className="text-sm font-semibold text-ink/70">Schwierigkeit</span>
                  <select
                    value={topicSettings.difficulty}
                    onChange={(event) =>
                      commit({
                        ...settings,
                        topics: {
                          ...settings.topics,
                          [topic.slug]: { ...topicSettings, difficulty: event.target.value as Difficulty }
                        }
                      })
                    }
                    className="focus-ring mt-2 w-full rounded-md border border-black/15 bg-white p-2"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <p className="text-sm font-semibold text-ink/70">Unterthemen</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {topic.subtopics.map((subtopic) => (
                      <label key={subtopic} className="inline-flex items-center gap-2 rounded-md bg-black/5 px-2 py-1 text-sm">
                        <input
                          type="checkbox"
                          checked={topicSettings.enabledSubtopics[subtopic] ?? true}
                          onChange={(event) =>
                            commit({
                              ...settings,
                              topics: {
                                ...settings.topics,
                                [topic.slug]: {
                                  ...topicSettings,
                                  enabledSubtopics: {
                                    ...topicSettings.enabledSubtopics,
                                    [subtopic]: event.target.checked
                                  }
                                }
                              }
                            })
                          }
                        />
                        {subtopic}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-5 shadow-soft">
        <label className="inline-flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={settings.localAiEnabled}
            onChange={(event) => commit({ ...settings, localAiEnabled: event.target.checked })}
          />
          Lokale KI später vorbereiten
        </label>
        <button
          onClick={() => {
            resetAllLocalData();
            setSettings(loadSettings());
          }}
          className="focus-ring mt-5 block rounded-md bg-coral px-4 py-2 font-semibold text-white"
        >
          Daten zurücksetzen
        </button>
      </div>
    </section>
  );
}
