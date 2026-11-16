# chh_WPU_ITG_2026_27

Interaktive GitHub-Pages-Lernplattform für den WPU ITG am Campus Hannah Höch, Schuljahr 2026/27.

## Umfang

- **74 Einheiten / 11 Module**, exakt entlang der bereitgestellten Jahresplanung
- pro Einheit: Einstieg und Rückblick, konkrete Basisaufgaben, Merkwissen, bei geeigneten Themen ein externes Lernangebot, zwei Übungsfragen mit Feedback, Erweiterungsaufgaben und ein Abschlusstest mit drei anderen Fragen. Arbeitsblätter sind als PDF und als druckbare Webansicht verfügbar.
- Basis- und Erweiterungsaufgaben
- responsiv und als statische GitHub-Pages-App lauffähig
- PWA/Service-Worker für Kernseiten und Daten
- Schüler-Anmeldung und Lehrerdashboard nach dem Muster der Mathe-/Chemie-Projekte
- stabile `client_id` + separate `session_id`, damit neue Tabs/Sitzungen nicht als neue Lernende gezählt werden
- Offline-Queue für Tracking-Events

## Quellen im Repository

- `assets/material/Jahresplanung_WPU_ITG_2026-27.pdf`
- `assets/material/Skript_WPU_ITG_komplett.pdf`
- `assets/arbeitsblaetter/AB-01 ... AB-74`
- `assets/material/Schulinternes_Curriculum_WPU_Informatik.docx`

## GitHub Pages

1. Inhalt dieses Ordners in ein neues GitHub-Repository hochladen.
2. In **Settings → Pages**: Deploy from branch, `main` / root.
3. Die Startseite ist `index.html`.

Es wird kein Build-System benötigt.

## Supabase / Lehrerdashboard aktivieren

1. Ein eigenes Supabase-Projekt verwenden und `supabase/setup.sql` ausführen.
2. Unter **Authentication → Users** ein Lehrer-Konto mit E-Mail/Passwort anlegen.
3. Das Konto einmalig als Lehrkraft freischalten (E-Mail ersetzen):

```sql
insert into public.itg_teachers (user_id)
select id from auth.users where email = 'lehrkraft@example.org'
on conflict (user_id) do nothing;
```

4. `assets/js/supabase-config.js` mit der Projekt-URL und einem **Publishable Key** ergänzen. Niemals `service_role` oder einen Secret Key in die Website eintragen:

```js
window.ITG_SUPABASE = {
  url: 'https://DEIN-PROJEKT.supabase.co',
  anonKey: 'DEIN_PUBLISHABLE_KEY',
  enabled: true,
  heartbeatSeconds: 20,
  classCode: 'WPU-ITG',
  appName: 'chh_wpu_itg'
};
```

5. `dashboard/` öffnen, als Lehrkraft anmelden und Schüler freischalten (`nachname.vorname`).
6. Lernende melden sich beim ersten Öffnen mit diesem Benutzernamen und dem Kurscode an.

Anonyme Lernende haben keinen direkten Tabellenzugriff. Ereignisse und Fortschritt werden über begrenzte Datenbankfunktionen geschrieben; Dashboard-Zugriff erhalten nur Konten in `itg_teachers`.

## Dashboard-Daten

- `itg_students`: Freigabeliste
- `itg_events`: Heartbeats, Phasen, Antworten, Abschlusstests
- `itg_progress`: letzter Fortschritt je Schüler / Einheit / Pfad

Das Dashboard zählt primär über `student_id`; `client_id` bleibt zusätzlich als dauerhafte Geräte-/Browserkennung vorhanden. `session_id` wird nur zur Sitzungstrennung verwendet.

## Curriculum-Hinweis

Die 74-Stunden-Jahresplanung und das schulinterne WPU-Curriculum sind nicht vollständig deckungsgleich: Im WPU-Curriculum 9/10 ist ein Datenbankblock obligatorisch, in der 74-Einheiten-ITG-Planung fehlt er. Die App verändert deshalb die 74 Einheiten nicht. Ein klar markierter Zusatzvorschlag liegt unter `optional/Datenbanken_Erweiterung.md`.

## Externe Angebote

Externe Ressourcen werden nur verlinkt, nicht eingebettet. Die Auswahl enthält thematisch passende Angebote, darunter Internet-ABC, Microsoft Support, Scratch, MakeCode und TypingClub. Nicht für jede Einheit ist ein externes Angebot notwendig. Links können sich ändern; Zugänglichkeit, Datenschutz und Freigaben im Schulnetz sollten vor dem Einsatz überprüft werden.

## Validierung

`node tools/validate-project.mjs` prüft Einheiten, Arbeitsblätter, Fragen und die Struktur externer Links.
