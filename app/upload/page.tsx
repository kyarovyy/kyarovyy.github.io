"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { listDocuments, saveDocument } from "@/lib/storage";
import { StoredDocument } from "@/lib/types";

export default function UploadPage() {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [tags, setTags] = useState("");

  async function refresh() {
    setDocuments(await listDocuments());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const isTextLike = file.type.startsWith("text/") || /\.(md|csv|txt)$/i.test(file.name);
      const text = isTextLike
        ? await file.text()
        : `Datei lokal gespeichert. Automatische Textextraktion ist in diesem MVP für ${file.type || "diesen Dateityp"} noch nicht verfügbar.`;
      await saveDocument({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type || "unbekannt",
        size: file.size,
        uploadedAt: new Date().toISOString(),
        file,
        text,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      });
    }
    setTags("");
    refresh();
  }

  function openDocument(document: StoredDocument) {
    if (!document.file) {
      alert("Diese Datei wurde vor der Datei-Speicherung hochgeladen. Bitte einmal neu hochladen.");
      return;
    }

    const url = URL.createObjectURL(document.file);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  return (
    <section>
      <PageHeader title="Dokumenten-Upload" eyebrow="Vorlesung, Tutorium, Probeklausur" />
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
        <p className="mb-5 rounded-md bg-leaf/10 p-3 text-sm font-semibold text-leaf">
          Einmal hochgeladene Dateien bleiben lokal in diesem Browser gespeichert.
        </p>
        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Begriffe oder Unterthemen markieren</span>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="z. B. Abschreibung, Umsatzsteuer, GuV"
            className="focus-ring mt-2 w-full rounded-md border border-black/15 p-3"
          />
        </label>
        <label className="focus-ring mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-black/25 bg-black/[0.02] p-8 text-center font-semibold text-ink/70">
          Dateien auswählen
          <input type="file" multiple className="sr-only" onChange={(event) => handleFiles(event.target.files)} />
        </label>
      </div>
      <div className="mt-6 space-y-3">
        {documents.map((document) => (
          <article key={document.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
            <h2 className="font-semibold">{document.name}</h2>
            <p className="mt-1 text-sm text-ink/60">
              {(document.size / 1024).toFixed(1)} KB · {new Date(document.uploadedAt).toLocaleString("de-DE")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {document.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-gold/15 px-2 py-1 text-xs font-semibold text-ink">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/65">{document.text}</p>
            <button
              onClick={() => openDocument(document)}
              className="focus-ring mt-4 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-leaf"
            >
              Datei öffnen
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
