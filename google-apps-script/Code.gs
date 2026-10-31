/**
 * Reelspro — Formular-Endpunkt
 *
 * Was das hier macht:
 * 1. Jede Anfrage vom Kontaktformular auf der Reelspro-Website landet als
 *    neue Zeile in diesem Google Sheet.
 * 2. Gleichzeitig verschickt es automatisch eine E-Mail an NOTIFY_EMAIL
 *    mit denselben Angaben.
 *
 * Einrichtung: siehe google-apps-script/README.md.
 * Danach hier nichts mehr ändern nötig — einfach laufen lassen.
 */

var NOTIFY_EMAIL = 'DEINE-EMAIL@BEISPIEL.de'; // TODO: durch die echte Empfänger-Adresse ersetzen

var HEADER_ROW = [
  'Zeitstempel', 'Name', 'Unternehmen', 'E-Mail', 'Interesse', 'Nachricht'
];

function doPost(e) {
  // Wichtig: Dieses Skript muss über "Erweiterungen -> Apps Script" DIREKT
  // IN der Google-Tabelle erstellt worden sein (nicht als eigenes Projekt
  // auf script.google.com) — nur dann weiß getActiveSpreadsheet(), welche
  // Tabelle gemeint ist.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
    sheet.getRange(1, 1, 1, HEADER_ROW.length).setFontWeight('bold');
  }

  var p = (e && e.parameter) || {};

  // Honeypot-Feld: ist es ausgefüllt, war es vermutlich ein Bot — stillschweigend ignorieren.
  if (p._gotcha) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    p.name || '',
    p.company || '',
    p.email || '',
    p.interest || '',
    p.message || ''
  ]);

  var subject = 'Neue Anfrage – ' + (p.company || p.name || 'Reelspro');
  var body = [
    'Neue Anfrage über die Reelspro-Website',
    '',
    'Name:        ' + (p.name || '—'),
    'Unternehmen: ' + (p.company || '—'),
    'E-Mail:      ' + (p.email || '—'),
    'Interesse:   ' + (p.interest || '—'),
    '',
    'Nachricht:',
    (p.message || '—'),
    '',
    'Alle Anfragen in der Tabelle: ' + ss.getUrl()
  ].join('\n');

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: p.email || NOTIFY_EMAIL,
    subject: subject,
    body: body
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Zum Testen: Diese URL im Browser öffnen sollte diesen Text zeigen. */
function doGet(e) {
  return ContentService.createTextOutput('Reelspro – Formular-Endpunkt ist aktiv.');
}
