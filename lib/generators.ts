import { Difficulty, Exercise, TopicSlug } from "./types";

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function id(topic: TopicSlug) {
  return `${topic}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function roundTo(value: number, step = 10) {
  return Math.round(value / step) * step;
}

function gross(net: number) {
  return Math.round(net * 1.19 * 100) / 100;
}

export function generateExercise(topic: TopicSlug, difficulty: Difficulty, enabledTopics: TopicSlug[]): Exercise {
  if (topic === "mixed") {
    const pool = enabledTopics.filter((slug) => slug !== "mixed");
    return generateExercise(pick(pool.length ? pool : ["depreciation"]), difficulty, enabledTopics);
  }

  const generators: Record<Exclude<TopicSlug, "mixed">, (difficulty: Difficulty) => Exercise> = {
    depreciation: generateDepreciation,
    "journal-entries": generateJournalEntry,
    "financial-statements": generateFinancialStatement,
    taxes: generateTax,
    "cash-flow": generateCashFlow
  };

  return generators[topic](difficulty);
}

export function generateDepreciation(difficulty: Difficulty): Exercise {
  const cost = roundTo(20000 + Math.random() * (difficulty === "hard" ? 100000 : 50000), 500);
  const usefulLife = pick(difficulty === "easy" ? [4, 5, 8] : [3, 4, 5, 6, 8, 10]);
  const residualValue = difficulty === "easy" ? 0 : roundTo(cost * pick([0.05, 0.1, 0.15]), 100);
  const annualDepreciation = Math.round(((cost - residualValue) / usefulLife) * 100) / 100;

  // Accounting logic: linear depreciation allocates the depreciable amount evenly over useful life.
  const visibleCaseText = `Ein Unternehmen kauft eine Maschine für ${eur.format(cost)}. Die geplante Nutzungsdauer beträgt ${usefulLife} Jahre${residualValue ? `, der Restwert ${eur.format(residualValue)}` : ""}. Berechne die jährliche lineare Abschreibung und gib den Buchungssatz an.`;

  return {
    id: id("depreciation"),
    topic: "depreciation",
    difficulty,
    visibleCaseText,
    hiddenSolution: `Jährliche Abschreibung: (${eur.format(cost)} - ${eur.format(residualValue)}) / ${usefulLife} = ${eur.format(annualDepreciation)}. Buchung: Abschreibungen an Maschinen ${eur.format(annualDepreciation)}.`,
    expectedCalculations: { annualDepreciation, usefulLife, cost, residualValue },
    expectedJournalEntries: [{ debit: "Abschreibungen", credit: "Maschinen", amount: annualDepreciation }],
    gradingRubric: ["Abschreibungsbetrag", "lineare Methode", "Soll-Konto", "Haben-Konto"],
    createdAt: new Date().toISOString()
  };
}

export function generateJournalEntry(difficulty: Difficulty): Exercise {
  const useTax = difficulty !== "easy";
  const variants = [
    {
      text: "Kauf von Büromaterial gegen Banküberweisung",
      debit: "Büromaterial",
      credit: "Bank"
    },
    {
      text: "Verkauf von Waren auf Ziel",
      debit: "Forderungen",
      credit: "Umsatzerlöse"
    },
    {
      text: "Begleichung einer Lieferantenrechnung per Bank",
      debit: "Verbindlichkeiten",
      credit: "Bank"
    }
  ];
  const variant = pick(variants);
  const net = roundTo(800 + Math.random() * 9000, 100);
  const amount = useTax && variant.credit === "Umsatzerlöse" ? gross(net) : net;
  const taxLine = useTax
    ? variant.credit === "Umsatzerlöse"
      ? ` Der Nettobetrag beträgt ${eur.format(net)} zzgl. 19 % Umsatzsteuer.`
      : ` Der Betrag beträgt ${eur.format(net)} ohne Umsatzsteuerbetrachtung.`
    : ` Der Betrag beträgt ${eur.format(net)}.`;

  const entries =
    useTax && variant.credit === "Umsatzerlöse"
      ? [
          { debit: "Forderungen", credit: "Umsatzerlöse", amount: net },
          { debit: "Forderungen", credit: "Umsatzsteuer", amount: Math.round(net * 0.19 * 100) / 100 }
        ]
      : [{ debit: variant.debit, credit: variant.credit, amount }];

  return {
    id: id("journal-entries"),
    topic: "journal-entries",
    difficulty,
    visibleCaseText: `${variant.text}.${taxLine} Erstelle den Buchungssatz.`,
    hiddenSolution: entries.map((entry) => `${entry.debit} an ${entry.credit} ${eur.format(entry.amount)}`).join("; "),
    expectedCalculations: { amount, net, tax: useTax ? Math.round(net * 0.19 * 100) / 100 : 0 },
    expectedJournalEntries: entries,
    gradingRubric: ["Soll-Konto", "Haben-Konto", "Betrag", "Steuerbehandlung falls relevant"],
    createdAt: new Date().toISOString()
  };
}

export function generateFinancialStatement(difficulty: Difficulty): Exercise {
  const revenue = roundTo(50000 + Math.random() * 120000, 1000);
  const material = roundTo(revenue * pick([0.32, 0.38, 0.44]), 500);
  const wages = roundTo(revenue * pick([0.18, 0.22, 0.28]), 500);
  const depreciation = roundTo(revenue * pick([0.06, 0.08, 0.1]), 100);
  const profit = revenue - material - wages - depreciation;

  return {
    id: id("financial-statements"),
    topic: "financial-statements",
    difficulty,
    visibleCaseText: `Für die GuV liegen vor: Umsatzerlöse ${eur.format(revenue)}, Materialaufwand ${eur.format(material)}, Personalaufwand ${eur.format(wages)}, Abschreibungen ${eur.format(depreciation)}. Berechne den Jahresüberschuss.`,
    hiddenSolution: `${eur.format(revenue)} - ${eur.format(material)} - ${eur.format(wages)} - ${eur.format(depreciation)} = ${eur.format(profit)} Jahresüberschuss.`,
    expectedCalculations: { profit, revenue, material, wages, depreciation },
    expectedJournalEntries: [],
    gradingRubric: ["Erlöse addiert", "Aufwendungen abgezogen", "Jahresüberschuss korrekt"],
    createdAt: new Date().toISOString()
  };
}

export function generateTax(difficulty: Difficulty): Exercise {
  const salesNet = roundTo(20000 + Math.random() * 90000, 1000);
  const purchasesNet = roundTo(salesNet * pick([0.35, 0.45, 0.55]), 500);
  const vat = Math.round(salesNet * 0.19 * 100) / 100;
  const inputVat = Math.round(purchasesNet * 0.19 * 100) / 100;
  const payable = vat - inputVat;

  return {
    id: id("taxes"),
    topic: "taxes",
    difficulty,
    visibleCaseText: `Umsätze netto: ${eur.format(salesNet)}. Eingangsleistungen netto: ${eur.format(purchasesNet)}. Umsatzsteuersatz: 19 %. Berechne die Umsatzsteuer-Zahllast.`,
    hiddenSolution: `Umsatzsteuer ${eur.format(vat)} minus Vorsteuer ${eur.format(inputVat)} = Zahllast ${eur.format(payable)}.`,
    expectedCalculations: { vat, inputVat, payable },
    expectedJournalEntries: [],
    gradingRubric: ["Umsatzsteuer", "Vorsteuer", "Zahllast"],
    createdAt: new Date().toISOString()
  };
}

export function generateCashFlow(difficulty: Difficulty): Exercise {
  const profit = roundTo(12000 + Math.random() * 70000, 1000);
  const depreciation = roundTo(profit * pick([0.12, 0.2, 0.28]), 500);
  const receivablesIncrease = roundTo(profit * pick([0.08, 0.14, 0.18]), 500);
  const operatingCashFlow = profit + depreciation - receivablesIncrease;

  return {
    id: id("cash-flow"),
    topic: "cash-flow",
    difficulty,
    visibleCaseText: `Indirekte Kapitalflussrechnung: Jahresüberschuss ${eur.format(profit)}, Abschreibungen ${eur.format(depreciation)}, Forderungsanstieg ${eur.format(receivablesIncrease)}. Berechne den operativen Cashflow.`,
    hiddenSolution: `${eur.format(profit)} + ${eur.format(depreciation)} - ${eur.format(receivablesIncrease)} = ${eur.format(operatingCashFlow)} operativer Cashflow.`,
    expectedCalculations: { operatingCashFlow, profit, depreciation, receivablesIncrease },
    expectedJournalEntries: [],
    gradingRubric: ["Jahresüberschuss startet Cashflow", "nicht zahlungswirksame Abschreibung addiert", "Forderungsanstieg abgezogen"],
    createdAt: new Date().toISOString()
  };
}
