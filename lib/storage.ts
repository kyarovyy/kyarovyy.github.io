"use client";

import { AppSettings, ProgressEntry, StoredDocument, TopicSlug } from "./types";
import { createDefaultSettings, practiceTopics } from "./topics";

const SETTINGS_KEY = "accounting-trainer-settings";
const PROGRESS_KEY = "accounting-trainer-progress";
const CURRENT_EXERCISE_KEY = "accounting-trainer-current-exercise";
const DB_NAME = "accounting-trainer-db";
const DB_VERSION = 1;
const DOCUMENT_STORE = "documents";

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return createDefaultSettings();
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (!raw) return createDefaultSettings();
  const parsed = JSON.parse(raw) as AppSettings;
  const defaults = createDefaultSettings();
  return {
    ...defaults,
    ...parsed,
    topics: { ...defaults.topics, ...parsed.topics }
  };
}

export function saveSettings(settings: AppSettings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadProgress(): Record<TopicSlug, ProgressEntry> {
  const empty = Object.fromEntries(
    practiceTopics.map((topic) => [topic.slug, { attempted: 0, correct: 0, incorrect: 0 }])
  ) as Record<TopicSlug, ProgressEntry>;
  if (typeof window === "undefined") return empty;
  const raw = window.localStorage.getItem(PROGRESS_KEY);
  return raw ? { ...empty, ...(JSON.parse(raw) as Record<TopicSlug, ProgressEntry>) } : empty;
}

export function saveProgress(progress: Record<TopicSlug, ProgressEntry>) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function updateProgress(topic: TopicSlug, correct: boolean) {
  const progress = loadProgress();
  const entry = progress[topic] ?? { attempted: 0, correct: 0, incorrect: 0 };
  progress[topic] = {
    attempted: entry.attempted + 1,
    correct: entry.correct + (correct ? 1 : 0),
    incorrect: entry.incorrect + (correct ? 0 : 1),
    lastPractice: new Date().toISOString()
  };
  saveProgress(progress);
}

export function resetAllLocalData() {
  window.localStorage.removeItem(SETTINGS_KEY);
  window.localStorage.removeItem(PROGRESS_KEY);
  window.localStorage.removeItem(CURRENT_EXERCISE_KEY);
}

export function saveCurrentExercise(exerciseJson: string) {
  window.localStorage.setItem(CURRENT_EXERCISE_KEY, exerciseJson);
}

export function loadCurrentExercise() {
  return window.localStorage.getItem(CURRENT_EXERCISE_KEY);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DOCUMENT_STORE)) {
        db.createObjectStore(DOCUMENT_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDocument(document: StoredDocument) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DOCUMENT_STORE, "readwrite");
    tx.objectStore(DOCUMENT_STORE).put(document);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function listDocuments(): Promise<StoredDocument[]> {
  const db = await openDb();
  const documents = await new Promise<StoredDocument[]>((resolve, reject) => {
    const tx = db.transaction(DOCUMENT_STORE, "readonly");
    const request = tx.objectStore(DOCUMENT_STORE).getAll();
    request.onsuccess = () => resolve(request.result as StoredDocument[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return documents.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}
