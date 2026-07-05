"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { generateExercise } from "@/lib/generators";
import { gradeAnswer } from "@/lib/grading";
import { getTopic, practiceTopics } from "@/lib/topics";
import { loadSettings, updateProgress } from "@/lib/storage";
import { Difficulty, Exercise, GradeResult, TopicSlug, UserAnswer } from "@/lib/types";

type StoredResult = {
  exercise: Exercise;
  answer: UserAnswer;
  grade: GradeResult;
};

export default function TestPage() {
  const [selectedTopics, setSelectedTopics] = useState<Record<TopicSlug, boolean>>(
    Object.fromEntries(practiceTopics.map((topic) => [topic.slug, topic.slug !== "mixed"])) as Record<TopicSlug, boolean>
  );
  const [questionsPerTopic, setQuestionsPerTopic] = useState(2);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [mixedOrder, setMixedOrder] = useState(true);
  const [questions, setQuestions] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<UserAnswer>({ calculation: "", journalEntry: "" });
  const [results, setResults] = useState<StoredResult[]>([]);
  const current = questions[index];
  const finished = questions.length > 0 && index >= questions.length;

  function startTest() {
    const settings = loadSettings();
    const active = practiceTopics
      .filter((topic) => topic.slug !== "mixed" && selectedTopics[topic.slug] && settings.topics[topic.slug].enabled)
      .map((topic) => topic.slug);
    const generated = active.flatMap((topic) =>
      Array.from({ length: questionsPerTopic }, () => generateExercise(topic, difficulty, active))
    );
    if (mixedOrder) generated.sort(() => Math.random() - 0.5);
    setQuestions(generated);
    setIndex(0);
    setResults([]);
    setAnswer({ calculation: "", journalEntry: "" });
  }

  function submit() {
    if (!current) return;
    const grade = gradeAnswer(current, answer);
    updateProgress(current.topic, grade.correct);
    setResults([...results, { exercise: current, answer, grade }]);
    setAnswer({ calculation: "", journalEntry: "" });
    setIndex(index + 1);
  }

  const totalScore = results.reduce((sum, result) => sum + result.grade.score, 0);
  const totalMax = results.reduce((sum, result) => sum + result.grade.maxScore, 0);

  return (
    <section className="max-w-5xl">
      <PageHeader title="Testmodus" eyebrow="Klausurähnliche Runde" />
      {!questions.length ? (
        <div className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-ink/70">Themen</p>
              <div className="mt-2 space-y-2">
                {practiceTopics.filter((topic) => topic.slug !== "mixed").map((topic) => (
                  <label key={topic.slug} className="flex items-center gap-2 rounded-md bg-black/5 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedTopics[topic.slug]}
                      onChange={(event) => setSelectedTopics({ ...selectedTopics, [topic.slug]: event.target.checked })}
                    />
                    {topic.title}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-ink/70">Fragen pro Thema</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={questionsPerTopic}
                  onChange={(event) => setQuestionsPerTopic(Number(event.target.value))}
                  className="focus-ring mt-2 w-full rounded-md border border-black/15 p-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-ink/70">Schwierigkeit</span>
                <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)} className="focus-ring mt-2 w-full rounded-md border border-black/15 p-2">
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                </select>
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={mixedOrder} onChange={(event) => setMixedOrder(event.target.checked)} />
                Gemischte Reihenfolge
              </label>
            </div>
          </div>
          <button onClick={startTest} className="focus-ring mt-6 rounded-md bg-ink px-4 py-2 font-semibold text-white hover:bg-leaf">
            Test starten
          </button>
        </div>
      ) : finished ? (
        <div className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Ergebnis: {totalScore} / {totalMax} Punkte</h2>
          <div className="mt-5 space-y-4">
            {results.map((result, resultIndex) => (
              <article key={result.exercise.id} className="rounded-lg bg-black/5 p-4">
                <p className="text-sm font-semibold">
                  {resultIndex + 1}. {getTopic(result.exercise.topic)?.title} · {result.grade.correct ? "richtig" : "falsch"}
                </p>
                <p className="mt-2 text-sm text-ink/70">{result.exercise.visibleCaseText}</p>
                <p className="mt-2 text-sm text-ink/80">{result.grade.feedback}</p>
              </article>
            ))}
          </div>
          <button onClick={() => setQuestions([])} className="focus-ring mt-6 rounded-md bg-ink px-4 py-2 font-semibold text-white">
            Neuen Test konfigurieren
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-coral">
            Frage {index + 1} / {questions.length} · {getTopic(current.topic)?.title}
          </p>
          <p className="mt-4 text-lg leading-8">{current.visibleCaseText}</p>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-ink/70">Berechnung</span>
            <textarea value={answer.calculation} onChange={(event) => setAnswer({ ...answer, calculation: event.target.value })} className="focus-ring mt-2 min-h-28 w-full rounded-md border border-black/15 p-3" />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink/70">Buchungssatz</span>
            <textarea value={answer.journalEntry} onChange={(event) => setAnswer({ ...answer, journalEntry: event.target.value })} className="focus-ring mt-2 min-h-24 w-full rounded-md border border-black/15 p-3" />
          </label>
          <button onClick={submit} className="focus-ring mt-5 rounded-md bg-leaf px-4 py-2 font-semibold text-white">
            Antwort speichern
          </button>
        </div>
      )}
    </section>
  );
}
