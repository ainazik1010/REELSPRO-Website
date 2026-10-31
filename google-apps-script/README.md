# Anfragen → Google Sheet + E-Mail

`Code.gs` ist ein fertiges Google-Apps-Script. Einmal eingerichtet, landet
jede Anfrage vom Kontaktformular auf der Reelspro-Website automatisch als
neue Zeile in einer Google-Tabelle — und gleichzeitig als E-Mail an die in
`NOTIFY_EMAIL` hinterlegte Adresse.

## Einrichtung

1. Neue Google-Tabelle anlegen (z. B. "Reelspro – Anfragen").
2. In der Tabelle: **Erweiterungen → Apps Script**.
   **Wichtig:** Das Skript muss so, direkt in der Tabelle, erstellt werden
   (nicht als eigenständiges Projekt auf script.google.com). Nur so weiß
   das Skript automatisch, in welche Tabelle es schreiben soll.
3. Den kompletten Inhalt von `Code.gs` dort einfügen (vorhandenen
   Platzhaltercode ersetzen).
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
