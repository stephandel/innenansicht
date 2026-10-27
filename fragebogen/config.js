/* Einstellungen und Texte des Fragebogens.
   Hier ändert man Mailadresse, Begrüßung, Schluss und alle Beschriftungen der Oberfläche.
   Die Fragen selbst stehen in fragen.js. */
window.CONFIG = {
  version: '1.0',
  titel: 'Fragebogen Selbst-Coaching-App',
  mail: 'stephanhandel@gmx.de',
  mailBetreff: 'Fragebogen Selbst-Coaching-App',
  speicherSchluessel: 'fragebogen-selbstcoaching-v1',
  dauer: '10–15 Minuten',

  /* Begrüßung: persönlich, Ich-Form Stephan. Jeder Absatz ein Eintrag.
     Platzhalter in eckigen Klammern werden auf dem Bildschirm sichtbar als Platzhalter markiert. */
  begruessung: [
    'Hallo, du hast neulich von einer App gesprochen, mit der man die Beziehung zu sich selbst managen kann. Die Idee hat mich nicht losgelassen, und ich würde sie gern für dich bauen.',
    'Bevor ich loslege, möchte ich wissen, was du dir genau vorstellst, und dafür bist du die Expertin. Der Fragebogen dauert etwa 10 bis 15 Minuten, nichts davon ist verbindlich, und du kannst jederzeit unterbrechen und später weitermachen.'
  ],
  safariHinweis: 'Am besten in Safari öffnen, dann bleibt dein Zwischenstand erhalten.',

  /* Hinweis zum Home-Bildschirm: erscheint nur in Safari auf iPhone/iPad, solange der Fragebogen nicht installiert ist */
  installHinweis: {
    titel: 'Als App auf den Home-Bildschirm',
    schritte: ['Unten das Menü-Symbol antippen', '„Teilen“ wählen', '„Zum Home-Bildschirm“ antippen'],
    text: 'Danach öffnet sich der Fragebogen wie eine App, ohne Adressleiste.',
    weg: 'Nicht mehr zeigen'
  },

  /* Schluss: persönlich. Dank, was als Nächstes passiert, kein Zeitdruck. */
  schluss: [
    'Danke, dass du dir die Zeit genommen hast. Mit deinen Antworten mache ich jetzt ein erstes Konzept, und dann reden wir in Ruhe darüber, bevor ich etwas baue.',
    'Es gibt keinen Zeitdruck, weder für dich noch für mich. Schick mir die Zusammenfassung einfach über „Teilen", und wenn dir noch etwas einfällt, sag es mir beim nächsten Treffen.'
  ],

  /* Beschriftungen der Oberfläche */
  ui: {
    untertitelStart: 'Klärung, was die App leisten soll',
    fragenHinweis: '{n} Fragen in sechs Teilen · etwa {dauer} · pausieren jederzeit möglich',
    losGehts: 'Los geht’s',
    weitermachen: 'Weitermachen bei Frage {x}',
    zusammenfassungAnsehen: 'Zur Zusammenfassung',
    neuStarten: 'Neu starten',
    neuStartenFrage: 'Alle bisherigen Antworten verwerfen und von vorn beginnen?',
    zwischenstand: 'Du hast bei Frage {x} von {n} aufgehört. Deine Antworten sind gespeichert.',
    fertigGespeichert: 'Du hast den Fragebogen abgeschlossen. Deine Antworten sind gespeichert.',
    zurueck: 'Zurück',
    weiter: 'Weiter',
    abschliessen: 'Abschließen',
    ueberspringen: 'Überspringen',
    fortschritt: 'Frage {x} von {n}',
    teilLabel: 'Teil {t}',
    uebersicht: 'Übersicht der Teile',
    uebersichtHinweis: 'Antippen springt zum Anfang des Teils. Teile, die noch nicht erreicht sind, bleiben gesperrt.',
    teilStatus: '{beantwortet} von {n} beantwortet',
    schliessen: 'Schließen',
    pflicht: 'Diese Frage braucht eine Angabe zu jedem Szenario, damit die weiteren Fragen passen.',
    pflichtFehlt: 'Bitte gib für jedes Szenario eine Stufe an.',
    ergaenzung: 'Ergänzung (optional)',
    ergaenzungPlatzhalter: 'Was dir dazu noch wichtig ist …',
    mehrfachHinweis: 'Mehrere Antworten möglich.',
    mehrfachMax: 'Höchstens {max} Antworten.',
    rangfolgeHinweis: 'Tippe die {max} wichtigsten in deiner Reihenfolge an. Nochmaliges Antippen hebt die Wahl auf.',
    gewichtungHinweis: 'Je Szenario eine Stufe antippen: 0, 25, 50, 75 oder 100 %.',
    prozent: '%',
    stilGalerieTitel: 'Drei Beispiele, wie es aussehen könnte. Nichts davon ist festgelegt.',
    stilVorschau: 'Vorschau ansehen',
    stilWaehlen: 'Diese Richtung spricht mich an',
    stilGewaehlt: 'Gewählt',
    stilBeispiel: 'Ein Beispiel, wie es aussehen könnte. Nichts davon ist festgelegt.',
    stilStart: 'Startbildschirm',
    stilSitzung: 'Beispielsitzung',
    stilHinweisSchrift: 'Schriften werden nur gezeigt, wenn sie auf dem Gerät vorhanden sind; sonst springt die Systemschrift ein.',
    zusammenfassung: 'Deine Antworten',
    zusammenfassungHinweis: 'So geht die Zusammenfassung an Stephan. Freitexte sind eingerückt, übersprungene Fragen sind markiert.',
    uebersprungen: 'übersprungen',
    teilen: 'Teilen',
    kopieren: 'Text kopieren',
    kopiert: 'Kopiert',
    kopierenFehler: 'Kopieren hat nicht geklappt. Du kannst den Text unter „Text anzeigen" markieren.',
    textAnzeigen: 'Text anzeigen (Markdown)',
    perMail: 'Per Mail an Stephan',
    perMailHinweis: 'Die Mail enthält nur die Auswahl, keine Freitexte. Vollständige Fassung bitte per Teilen oder Kopieren.',
    mailNachsatz: 'Vollständige Fassung bitte per Teilen oder Kopieren.',
    mailTeil: 'Teil {t}',
    mailFreitext: '(Freitext, siehe vollständige Fassung)',
    mailErgaenzung: '(+ Ergänzung)',
    loeschen: 'Antworten löschen',
    loeschenFrage: 'Alle Antworten auf diesem Gerät löschen? Das lässt sich nicht rückgängig machen.',
    geloescht: 'Antworten gelöscht',
    antwortenVom: 'Antworten vom {datum}',
    markdownTitel: 'Fragebogen Selbst-Coaching-App',
    markdownFassung: 'Fassung {v}',
    platzhalterLabel: 'Platzhalter',
    versionLabel: 'Fassung {v} · keine Übertragung, alles bleibt in diesem Browser'
  }
};
