# Accounting Trainer

Private, lokale Web-App zur Accounting-Klausurvorbereitung. Die App nutzt keine kostenpflichtigen APIs, keine OpenAI API und keine Cloud-Dienste. Aufgaben werden regelbasiert generiert und bewertet.

## Lokal starten

```bash
npm install
npm run dev
```

Danach im Browser öffnen:

```text
http://localhost:3000
```

Falls PowerShell `npm` wegen der lokalen Skriptrichtlinie blockiert, nutze unter Windows:

```powershell
npm.cmd install
npm.cmd run dev
```

## Auf dem Handy nutzen, ohne dass der PC an ist

Die App ist als PWA und statische Website vorbereitet. Dafür muss sie einmal auf einem kostenlosen Static Host liegen, zum Beispiel GitHub Pages, Netlify, Cloudflare Pages oder Vercel.

```bash
npm run build
```

Der fertige statische Export liegt danach im Ordner `out/`. Diesen Ordner kannst du kostenlos hosten. Auf dem Handy öffnest du dann die gehostete URL und wählst im Browser „Zum Home-Bildschirm hinzufügen“.

Nach dem ersten Laden kann die App auf dem Handy offline weiterlaufen. Dein PC muss dann nicht an sein.

Wichtig: Fortschritt und hochgeladene Dateien werden lokal pro Gerät und Browser gespeichert. Dateien, die du am PC hochlädst, sind nicht automatisch auf dem Handy vorhanden. Lade sie auf dem Handy einmal hoch, dann bleiben sie dort gespeichert.

## GitHub Pages

Dieses Projekt ist für GitHub Pages vorbereitet. Die Datei `.github/workflows/deploy-github-pages.yml` baut die App automatisch und veröffentlicht den `out`-Ordner.

Vorgehen:

1. Neues GitHub-Repository erstellen, zum Beispiel `accounting-trainer`.
2. Den kompletten Projektordner in dieses Repository hochladen, nicht nur `out`.
3. In GitHub zu `Settings` → `Pages` gehen.
4. Bei `Build and deployment` als Source `GitHub Actions` auswählen.
5. Auf `main` oder `master` pushen.

Danach baut GitHub die App automatisch. Die URL sieht normalerweise so aus:

```text
https://DEIN-NAME.github.io/accounting-trainer/
```

Wenn dein Repository `DEIN-NAME.github.io` heißt, liegt die App direkt hier:

```text
https://DEIN-NAME.github.io/
```

## Enthalten

- Dashboard mit Themenkacheln
- Themen aktivieren/deaktivieren
- Unterthemen verwalten
- Regelbasierte Fallgenerierung
- Interne Musterlösungen
- Automatische Bewertung
- Fortschritt lokal speichern
- Testmodus mit Auswertung
- Upload-Seite mit lokaler IndexedDB-Speicherung
- PWA-Manifest und Offline-Cache
- Statischer Export für kostenloses Hosting

## Speicherung

Settings und Fortschritt liegen im Browser-Speicher. Dokumente werden in IndexedDB gespeichert. Es gibt keine Serverdatenbank und keine laufenden Kosten.

## Hinweise zum MVP

Abschreibungen sind als erster Bereich vollständig mit Accounting-Kommentarlogik umgesetzt. Buchungssätze, Bilanz und GuV, Steuern und Kapitalflussrechnung haben erste regelbasierte Templates und können einfach in `lib/generators.ts` erweitert werden.
