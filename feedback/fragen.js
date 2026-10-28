/* Feedback-Bogen zur App „Innenansicht“: alle Texte und Fragen.
   Hier ändert man Mailadresse, Begrüßung und die Fragen. Die Logik steht in app.js. */
window.FEEDBACK = {
  version: '1.0',
  titel: 'Kurzes Feedback',
  untertitel: 'zur App „Innenansicht“',
  mail: 'stephanhandel@gmx.de',
  mailBetreff: 'Feedback Innenansicht',
  speicherSchluessel: 'feedback-innenansicht-v1',

  begruessung: 'Du hast die App jetzt ein paar Tage. {n} Fragen, meist nur Sterne antippen, etwa zwei bis drei Minuten. Was du nicht benutzt hast, lässt du einfach aus.',
  sterneHinweis: '1 Stern = gar nicht, 5 Sterne = sehr',

  /* kurz: Bezeichnung in der Mail. typ „sterne“: 1 bis 5. typ „wahl“: genau eine Antwort. typ „text“: kurzer Freitext, optional.
     bild + bildText: kleines Bildschirmfoto aus der App mit einem Satz, worum es geht (Bilder in bilder/, aus der App mit Beispieldaten). */
  fragen: [
    { id: 'passung',    typ: 'sterne', kurz: 'Passung', text: 'Wie gut passt die App zu dem, was du von ihr erwartet hast?',
      bild: 'bilder/start.png', bildText: 'Der Startbildschirm: die Sitzung dieser Woche, dein Vorhaben aus der letzten, und was dir gerade wichtig ist.' },
    { id: 'bedienung',  typ: 'sterne', kurz: 'Bedienung', text: 'Wie leicht fällt dir die Bedienung?' },
    { id: 'fragen',     typ: 'sterne', kurz: 'Fragen der Sitzung', text: 'Wie gut helfen dir die Fragen der Wochensitzung weiter?',
      bild: 'bilder/sitzung.png', bildText: 'Die Wochensitzung: „Sitzung beginnen“ auf dem Startbildschirm, dann Schritt für Schritt Skalen und Fragen aus deinen Werkzeugen.' },
    { id: 'klarheit',   typ: 'sterne', kurz: 'Klarheit', text: 'Wie hilfreich ist der Bereich „Klarheit“?',
      bild: 'bilder/klarheit.png', bildText: 'Reiter „Klarheit“ unten: was dir jetzt wichtig ist und was bewusst nicht jetzt dran ist.' },
    { id: 'team',       typ: 'sterne', kurz: 'Inneres Team', text: 'Wie hilfreich ist das „Innere Team“?',
      bild: 'bilder/team.png', bildText: 'Reiter „Inneres Team“: die Anteile mit ihrem typischen Satz, abrufbar in der Sitzung.' },
    { id: 'sprache',    typ: 'sterne', kurz: 'Sprache', text: 'Wie gut passt die Sprache der App zu deiner Arbeit?' },
    { id: 'aussehen',   typ: 'sterne', kurz: 'Aussehen', text: 'Wie gefällt dir das Aussehen?' },
    { id: 'stil',       typ: 'wahl',   kurz: 'Lieblingsstil', text: 'Welcher Stil gefällt dir am besten?',
      bild: 'bilder/stil.png', bildText: 'Zahnrad oben rechts → „Darstellung“: hier wählst du den Stil, darunter Erscheinung, Farbe und Hintergrund.',
      optionen: ['Klar', 'Glas', 'Weich', 'Nacht', 'Farbe', 'Papier', 'Noch nicht ausprobiert'] },
    { id: 'nutzung',    typ: 'wahl',   kurz: 'Nutzung', text: 'Wie oft hast du die App bisher geöffnet?',
      optionen: ['Einmal', 'Zwei- bis dreimal', 'Mehr als dreimal'] },
    { id: 'empfehlung', typ: 'sterne', kurz: 'Empfehlung', text: 'Wie wahrscheinlich würdest du die App einer Coachee empfehlen?' },
    { id: 'stoert',     typ: 'text',   kurz: 'Stört', text: 'Was stört dich am meisten, falls etwas?', platzhalter: 'Ein Satz reicht, optional' },
    { id: 'fehlt',      typ: 'text',   kurz: 'Wunsch', text: 'Was würdest du dir zusätzlich wünschen?', platzhalter: 'Ein Satz reicht, optional' }
  ],

  ui: {
    senden: 'Per Mail an Stephan',
    sendenHinweis: 'Öffnet deine Mail-App mit den Antworten als Text. Nichts wird im Hintergrund übertragen.',
    kopieren: 'Text kopieren',
    kopiert: 'Kopiert',
    mailGekuerzt: 'Freitexte sind in der Mail auf {max} Zeichen gekürzt; die vollständige Fassung geht über „Text kopieren“.',
    kopierenFehler: 'Kopieren hat nicht geklappt. Markiere den Text unten und kopiere ihn von Hand.',
    textAnzeigen: 'Text anzeigen',
    stand: '{beantwortet} von {n} beantwortet · wird auf diesem Gerät zwischengespeichert',
    loeschen: 'Antworten löschen',
    loeschenFrage: 'Alle Antworten auf diesem Gerät löschen?',
    geloescht: 'Antworten gelöscht',
    sternLabel: '{n} von 5 Sternen',
    uebersprungen: 'ausgelassen',
    danke: 'Danke. Beim nächsten Gespräch gehen wir die Punkte durch.',
    fuss: 'Fassung {v} · keine Übertragung, alles bleibt in diesem Browser, bis du auf „Per Mail an Stephan“ tippst'
  }
};
