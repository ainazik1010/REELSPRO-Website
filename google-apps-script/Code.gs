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

var NOTIFY_EMAIL = 'team@reelspro.de';

// Nur nötig, wenn dieses Skript NICHT direkt in der Tabelle (Erweiterungen ->
// Apps Script) erstellt wurde, sondern eigenständig über script.google.com /
// script.new: dann hier die Tabellen-ID eintragen (aus der Sheet-URL, der
// Teil zwischen /d/ und /edit). Wurde das Skript direkt in der Tabelle
// erstellt, kann SPREADSHEET_ID leer ('') bleiben.
var SPREADSHEET_ID = '1sPikvR1H7wUXw9EV82jau5xHV2OlPxdBPLdKOlH1q9g';

var HEADER_ROW = [
  'Zeitstempel', 'Name', 'Unternehmen', 'E-Mail', 'Interesse', 'Nachricht'
];

function getSheet_() {
  var ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets()[0];
}

function doPost(e) {
  var sheet = getSheet_();
  var ss = sheet.getParent();

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
