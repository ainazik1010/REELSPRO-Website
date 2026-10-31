# Anfragen → Google Sheet + E-Mail

`Code.gs` ist ein fertiges Google-Apps-Script. Einmal eingerichtet, landet
jede Anfrage vom Kontaktformular auf der Reelspro-Website automatisch als
neue Zeile in einer Google-Tabelle — und gleichzeitig als E-Mail an die in
`NOTIFY_EMAIL` hinterlegte Adresse.

## Einrichtung

Zwei Wege sind möglich — am einfachsten ist Weg A. Beide funktionieren mit
dem aktuellen `Code.gs`.

### Weg A: Skript direkt in der Tabelle erstellen (empfohlen)

1. Neue Google-Tabelle anlegen (z. B. "Reelspro – Anfragen").
2. In der Tabelle: **Erweiterungen → Apps Script**.
3. Den kompletten Inhalt von `Code.gs` dort einfügen (vorhandenen
   Platzhaltercode ersetzen). `SPREADSHEET_ID` kann leer (`''`) bleiben.
4. Weiter bei Schritt 4 unten ("Gemeinsame Schritte").

Falls beim Klick auf "Erweiterungen → Apps Script" eine Google-Fehlerseite
("Datei kann derzeit nicht geöffnet werden") erscheint: Das ist meist ein
Konto-/Sitzungskonflikt, wenn im Browser mehrere Google-Konten gleichzeitig
eingeloggt sind. Am einfachsten in einem Inkognito-/privaten Fenster erneut
versuchen, oder Weg B nutzen.

### Weg B: Eigenständiges Skript über script.new

1. Neue Google-Tabelle anlegen (z. B. "Reelspro – Anfragen") und offen lassen.
2. Aus der Adresszeile der Tabelle die **Tabellen-ID** kopieren: in der URL
   `https://docs.google.com/spreadsheets/d/TABELLEN_ID/edit` ist das der Teil
   zwischen `/d/` und `/edit`.
3. In einem neuen Tab `script.new` aufrufen — das öffnet ein neues,
   eigenständiges Apps-Script-Projekt.
4. Den kompletten Inhalt von `Code.gs` dort einfügen (vorhandenen
   Platzhaltercode ersetzen).
5. In der Zeile `var SPREADSHEET_ID = '';` die kopierte Tabellen-ID zwischen
   die Anführungszeichen eintragen.
6. Weiter bei Schritt 4 unten ("Gemeinsame Schritte").

### Gemeinsame Schritte

4. In Zeile `var NOTIFY_EMAIL = ...` die echte Empfänger-E-Mail-Adresse
   eintragen.
5. Oben rechts auf **Bereitstellen → Neue Bereitstellung**:
   - Typ: **Web-App**
   - Ausführen als: **Ich**
   - Zugriff: **Jeder**
6. Beim ersten Mal erscheint eine Google-Warnung ("Nicht verifizierte App")
   — das ist normal für private Skripte. Auf "Erweitert" → "Zu [Projektname]
   wechseln (unsicher)" klicken und bestätigen.
7. Die angezeigte **Web-App-URL** (endet auf `/exec`) kopieren.
8. Diese URL in `script.js` bei `FORM_ENDPOINT` eintragen (siehe Kommentar
   dort).

## Testen nach der Einrichtung

Die `/exec`-URL im Browser öffnen → es sollte stehen:
„Reelspro – Formular-Endpunkt ist aktiv.“

Erscheint stattdessen eine Google-Fehlerseite, war ein Schritt beim Deploy
falsch (meist: „Wer hat Zugriff“ steht nicht auf „Jeder“).

## Wenn sich später etwas ändert

- **Andere Empfänger-E-Mail:** in `Code.gs` die Zeile `NOTIFY_EMAIL` ändern.
- **Neues Deployment nötig** ist nur, wenn sich die URL ändern soll. Reine
  Code-Änderungen in `Code.gs` über „Bereitstellen → Bereitstellungen
  verwalten → Bearbeiten (Stift-Symbol) → Version: Neu → Bereitstellen“
  übernehmen, ohne dass sich die URL ändert.
