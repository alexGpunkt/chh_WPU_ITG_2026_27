# Datenschutz / Telemetrie

Die Plattform kann ohne Supabase rein lokal getestet werden. In diesem Modus werden keine Lernstandsdaten an einen Server gesendet.

Nach Aktivierung von Supabase werden nur die für das Lehrerdashboard vorgesehenen Lernstandsdaten übertragen: freigeschaltete Schüler-ID/Anzeigename, Kurs, stabile `client_id`, tabbezogene `session_id`, aktuelle Einheit/Phase, Antwort richtig/falsch, Fortschritt und Zeitstempel. Freitextlösungen aus den handschriftlichen/praktischen Aufgaben werden nicht übertragen.

Externe Übungen und Videos sind normale Links und werden **nicht** in die Seite eingebettet. Erst ein bewusster Klick öffnet den jeweiligen Drittanbieter.

Die Supabase-Tabellen sind mit Row Level Security geschützt. Lernende schreiben ausschließlich über begrenzte Datenbankfunktionen; nur explizit in `itg_teachers` freigeschaltete Auth-Konten lesen Dashboarddaten oder verwalten die Freigabeliste.

Für den schulischen Produktivbetrieb sind die schulischen Datenschutzvorgaben sowie konkrete Aufbewahrungs- und Löschfristen zu ergänzen.
