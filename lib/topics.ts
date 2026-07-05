import { AppSettings, Topic, TopicSlug } from "./types";

export const topics: Topic[] = [
  {
    slug: "journal-entries",
    title: "Buchungssätze",
    description: "Geschäftsvorfälle, Konten, Soll und Haben.",
    subtopics: ["Warenkauf", "Warenverkauf", "Bank", "Umsatzsteuer", "Vorsteuer"]
  },
  {
    slug: "taxes",
    title: "Steuern",
    description: "Umsatzsteuer, Vorsteuer und Zahllast.",
    subtopics: ["Umsatzsteuer", "Vorsteuer", "Zahllast"]
  },
  {
    slug: "financial-statements",
    title: "Bilanz und GuV",
    description: "Bilanzpositionen, Aufwand, Ertrag und Jahresüberschuss.",
    subtopics: ["Aktiva", "Passiva", "Aufwand", "Ertrag", "Jahresüberschuss"]
  },
  {
    slug: "depreciation",
    title: "Abschreibungen",
    description: "Anschaffungskosten, Nutzungsdauer, Restwert und Buchung.",
    subtopics: ["Linear", "Restwert", "Schaden", "Verkauf", "Nutzungsdaueränderung"]
  },
  {
    slug: "cash-flow",
    title: "Kapitalflussrechnung",
    description: "Operativer Cashflow, Investition und Finanzierung.",
    subtopics: ["Operativ", "Investition", "Finanzierung"]
  },
  {
    slug: "mixed",
    title: "Gemischte Klausurfälle",
    description: "Zufällige Mischung aus aktivierten Themen.",
    subtopics: ["Gemischt"]
  },
  {
    slug: "test",
    title: "Testmodus",
    description: "Mehrere Aufgaben mit Auswertung am Ende.",
    subtopics: []
  }
];

export const practiceTopics = topics.filter((topic) => topic.slug !== "test") as Array<
  Topic & { slug: TopicSlug }
>;

export function createDefaultSettings(): AppSettings {
  const topicSettings = Object.fromEntries(
    practiceTopics.map((topic) => [
      topic.slug,
      {
        enabled: true,
        difficulty: "easy",
        enabledSubtopics: Object.fromEntries(topic.subtopics.map((subtopic) => [subtopic, true]))
      }
    ])
  ) as AppSettings["topics"];

  return {
    topics: topicSettings,
    localAiEnabled: false
  };
}

export function getTopic(slug: TopicSlug | "test") {
  return topics.find((topic) => topic.slug === slug);
}
