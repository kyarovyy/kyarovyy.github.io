"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, RefreshCcw, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { generateExercise } from "@/lib/generators";
import { gradeAnswer } from "@/lib/grading";
import { getTopic, practiceTopics } from "@/lib/topics";
import { loadCurrentExercise, loadSettings, saveCurrentExercise, updateProgress } from "@/lib/storage";
import { Exercise, GradeResult, UserAnswer } from "@/lib/types";

export default function PracticePage() {
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [answer, setAnswer] = useState<UserAnswer>({ calculation: "", journalEntry: "" });
  const [result, setResult] = useState<GradeResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const raw = loadCurrentExercise();
    if (raw) setExercise(JSON.parse(raw) as Exercise);
  }, []);

  function checkAnswer() {
    if (!exercise) return;
    const grade = gradeAnswer(exercise, answer);
    setResult(grade);
    updateProgress(exercise.topic, grade.correct);
  }

  function nextCase() {
    if (!exercise) return;
    const settings = loadSettings();
    const enabledTopics = practiceTopics.filter((topic) => settings.topics[topic.slug].enabled).map((topic) => topic.slug);
    const generated = generateExercise(exercise.topic, settings.topics[exercise.topic].difficulty, enabledTopics);
    saveCurrentExercise(JSON.stringify(generated));
    setExercise(generated);
    setAnswer({ calculation: "", journalEntry: "" });
    setResult(null);
    setShowSolution(false);
  }

  if (!exercise) {
    return (
      <section>
        <PageHeader title="Kein aktiver Fall" />
        <button onClick={() => router.push("/dashboard")} className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white">
          Zum Dashboard
        </button>
      </section>
    );
  }

  const topic = getTopic(exercise.topic);

  return (
    <section className="max-w-4xl">
      <PageHeader title={topic?.title ?? "Übung"} eyebrow={`Schwierigkeit: ${exercise.difficulty}`} />
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
        <p className="text-lg leading-8 text-ink">{exercise.visibleCaseText}</p>
        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-ink/70">Berechnung / Rechenweg</span>
            <textarea
              value={answer.calculation}
              onChange={(event) => setAnswer({ ...answer, calculation: event.target.value })}
              className="focus-ring mt-2 min-h-32 w-full rounded-md border border-black/15 bg-white p-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink/70">Buchungssatz</span>
            <textarea
              value={answer.journalEntry}
              onChange={(event) => setAnswer({ ...answer, journalEntry: event.target.value })}
              className="focus-ring mt-2 min-h-24 w-full rounded-md border border-black/15 bg-white p-3"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={checkAnswer} className="focus-ring inline-flex items-center gap-2 rounded-md bg-leaf px-4 py-2 font-semibold text-white">
            <CheckCircle2 size={18} aria-hidden />
            Antwort prüfen
          </button>
          <button onClick={nextCase} className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 font-semibold text-white">
            <RefreshCcw size={18} aria-hidden />
            Nächster Fall
          </button>
          <button onClick={() => setShowSolution((value) => !value)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-4 py-2 font-semibold text-ink">
            <Eye size={18} aria-hidden />
            Lösung anzeigen
          </button>
          <button onClick={() => router.push("/settings")} className="focus-ring inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-4 py-2 font-semibold text-ink">
            <SlidersHorizontal size={18} aria-hidden />
            Schwierigkeit ändern
          </button>
        </div>
        {result ? (
          <div className={`mt-6 rounded-lg p-4 ${result.correct ? "bg-leaf/10 text-leaf" : "bg-coral/10 text-coral"}`}>
            <p className="font-semibold">{result.feedback}</p>
            <p className="mt-2 text-sm">Punkte: {result.score} / {result.maxScore}</p>
          </div>
        ) : null}
        {showSolution ? <div className="mt-4 rounded-lg bg-black/5 p-4 text-ink/80">{exercise.hiddenSolution}</div> : null}
      </div>
    </section>
  );
}
