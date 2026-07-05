import { Exercise, GradeResult, UserAnswer } from "./types";

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9,.-]/g, " ");
}

function extractNumbers(text: string) {
  return [...text.matchAll(/(?:\d{1,3}(?:[.\s']\d{3})+|\d+)(?:[,.]\d+)?/g)]
    .map((match) => parseLocalizedNumber(match[0]))
    .filter((number) => Number.isFinite(number));
}

function parseLocalizedNumber(raw: string) {
  const value = raw.replace(/\s|'/g, "");
  const hasComma = value.includes(",");
  const hasDot = value.includes(".");

  if (hasComma && hasDot) {
    const lastComma = value.lastIndexOf(",");
    const lastDot = value.lastIndexOf(".");
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    return decimalSeparator === ","
      ? Number(value.replace(/\./g, "").replace(",", "."))
      : Number(value.replace(/,/g, ""));
  }

  if (hasDot) {
    const looksLikeGermanThousands = /^\d{1,3}(?:\.\d{3})+$/.test(value);
    return Number(looksLikeGermanThousands ? value.replace(/\./g, "") : value);
  }

  if (hasComma) {
    const looksLikeEnglishThousands = /^\d{1,3}(?:,\d{3})+$/.test(value);
    return Number(looksLikeEnglishThousands ? value.replace(/,/g, "") : value.replace(",", "."));
  }

  return Number(value);
}

function roughlyEquals(a: number, b: number) {
  return Math.abs(a - b) <= Math.max(1, Math.abs(b) * 0.01);
}

export function gradeAnswer(exercise: Exercise, answer: UserAnswer): GradeResult {
  const details: string[] = [];
  let score = 0;
  let maxScore = 0;
  const calculationText = normalize(answer.calculation);
  const journalText = normalize(answer.journalEntry);
  const numbers = extractNumbers(`${answer.calculation} ${answer.journalEntry}`);

  const expectedValues = Object.values(exercise.expectedCalculations).filter(
    (value): value is number => typeof value === "number"
  );

  if (expectedValues.length) {
    maxScore += 2;
    const mainValue = expectedValues[0];
    const hasValue = numbers.some((number) => roughlyEquals(number, mainValue));
    if (hasValue) {
      score += 2;
      details.push("Der zentrale Betrag passt.");
    } else {
      details.push(`Der zentrale Betrag sollte ${mainValue.toLocaleString("de-DE")} sein.`);
    }
  }

  if (exercise.expectedJournalEntries.length) {
    for (const entry of exercise.expectedJournalEntries) {
      maxScore += 3;
      const debitOk = journalText.includes(normalize(entry.debit));
      const creditOk = journalText.includes(normalize(entry.credit));
      const amountOk = numbers.some((number) => roughlyEquals(number, entry.amount));
      if (debitOk) score += 1;
      if (creditOk) score += 1;
      if (amountOk) score += 1;
      details.push(
        `${entry.debit} an ${entry.credit}: ${debitOk && creditOk && amountOk ? "korrekt" : "noch nicht vollständig"}.`
      );
    }
  } else {
    maxScore += 1;
    const containsMethodWords =
      calculationText.includes("minus") ||
      calculationText.includes("-") ||
      calculationText.includes("geteilt") ||
      calculationText.includes("/") ||
      calculationText.includes("+");
    if (containsMethodWords || answer.calculation.length > 12) {
      score += 1;
      details.push("Der Rechenweg ist plausibel beschrieben.");
    } else {
      details.push("Beschreibe den Rechenweg etwas genauer.");
    }
  }

  const correct = score >= Math.ceil(maxScore * 0.8);
  const feedback = correct
    ? `Richtig. ${exercise.hiddenSolution}`
    : `Nicht ganz. ${details[0] ?? "Prüfe Betrag, Methode und Zuordnung noch einmal"} ${exercise.hiddenSolution}`;

  return {
    score,
    maxScore,
    correct,
    feedback,
    details
  };
}
