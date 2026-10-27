/* Innenansicht: alle Texte der Oberfläche. Diese Datei ist die Schicht, die inhaltlich geändert werden darf,
   ohne die Logik anzufassen. Alles personenneutral, „du“, nüchtern. Platzhalter in {geschweiften} Klammern füllt die App. */
window.INHALTE = {
  titel: 'Innenansicht',
  fassung: 'Fassung 1 · alles nur auf diesem Gerät',

  /* Vier Reiter unten */
  tabs: [
    { id: 'start', text: 'Start' },
    { id: 'klarheit', text: 'Klarheit' },
    { id: 'team', text: 'Inneres Team' },
    { id: 'verlauf', text: 'Verlauf' }
  ],

  /* Erster Start: drei Bildschirme, einmalig */
  erststart: [
    {
      titel: 'Innenansicht',
      untertitel: 'Eine Sitzung pro Woche mit dir selbst.',
      absaetze: [
        'Einmal in der Woche nimmst du dir 20 bis 30 Minuten. Die App führt dich mit Fragen durch sechs Schritte: ankommen, deinen Standort bestimmen, die Stimmen in dir anhören, den Blick von außen einnehmen, klären, was dir wichtig ist, und abschließen.',
        'Aus den Sitzungen wachsen drei Bereiche: Klarheit, Inneres Team und Verlauf.',
        'Nichts wird bewertet, nichts verglichen, nichts gezählt. Du bestimmst das Tempo.'
      ]
    },
    {
      titel: 'Was die App nicht tut',
      absaetze: [
        'Sie stellt keine Diagnose, sie behandelt nicht, und sie ersetzt keine ärztliche oder psychologische Hilfe.',
        'Sie ist ein Werkzeug für die Arbeit an dir selbst in ruhigen Zeiten.'
      ],
      krise: true
    },
    {
      titel: 'Deine Daten',
      absaetze: [
        'Alles bleibt auf diesem Gerät. Es gibt kein Konto, keinen Server, keine Übertragung.',
        'Wenn du den Browser-Speicher löschst oder das Gerät wechselst, sind die Einträge weg. Die App erinnert dich alle paar Wochen an eine Sicherungsdatei, die du selbst aufbewahrst.'
      ]
    }
  ],
  /* Vierter Bildschirm: Anrede, optional */
  erststartName: {
    titel: 'Wie dürfen wir dich ansprechen?',
    text: 'Dein Vorname erscheint nur in der Begrüßung auf dem Startbildschirm. Du kannst das Feld leer lassen.',
    platzhalter: 'Vorname, optional',
    hinweis: 'Bleibt auf diesem Gerät.',
    label: 'Vorname'
  },
  erststartWeiter: 'Weiter',
  erststartLos: 'Verstanden, los',
  erststartSchritt: '{x} von {n}',

  /* Begrüßung nach Uhrzeit; mit Name wird „, {name}“ angehängt */
  begruessung: { morgen: 'Guten Morgen', tag: 'Guten Tag', abend: 'Guten Abend' },

  /* Krisenhinweis: eine Zeile im Fuß, ausführlich in den Einstellungen */
  krise: {
    zeile: 'In einer akuten Krise: Telefonseelsorge 0800 111 0 111, kostenlos, rund um die Uhr.',
    titel: 'Wenn es dir sehr schlecht geht',
    absaetze: [
      'Diese App ist für ruhige Zeiten gedacht. Wenn du in einer akuten Krise bist, dich selbst gefährdet fühlst oder nicht mehr weiterweißt, sprich mit einem Menschen, nicht mit einer App.',
      'Telefonseelsorge: 0800 111 0 111 oder 0800 111 0 222, kostenlos, rund um die Uhr, anonym. Auch per Chat unter telefonseelsorge.de.',
      'In Notfällen: 112.'
    ],
    telefon: '0800 111 0 111',
    telefonLink: 'tel:08001110111'
  },

  /* Startbildschirm */
  start: {
    einstiegTitel: 'Deine erste Sitzung',
    einstieg: [
      'Noch keine Sitzung. Die erste dauert etwas länger, weil du deine Liste „Wichtig jetzt“ anlegst und vielleicht einen ersten Anteil deines inneren Teams benennst.',
      'Nimm dir 30 Minuten und einen ruhigen Ort.'
    ],
    ersteSitzung: 'Erste Sitzung beginnen',
    dieseWoche: 'Diese Woche',
    offen: 'Sitzung offen',
    offenHinweis: 'Diese Woche steht die Sitzung noch aus.',
    beginnen: 'Sitzung beginnen',
    entwurf: 'Angefangene Sitzung',
    weitermachen: 'Weitermachen bei Schritt {n}',
    erledigt: 'Sitzung erledigt am {tag}',
    erledigtHinweis: 'Die nächste Sitzung ist in der kommenden Woche dran.',
    zusammenfassung: 'Zusammenfassung ansehen',
    deinSchritt: 'Dein Schritt',
    deinSchrittHinweis: 'Dein Vorhaben aus der letzten Sitzung.',
    wichtigJetzt: 'Wichtig jetzt',
    sicherung: 'Sicherung',
    sicherungNie: 'Du hast noch keine Sicherungsdatei erstellt. Browserdaten können verloren gehen.',
    sicherungAlt: 'Die letzte Sicherung ist {n} Tage alt.',
    sichernKnopf: 'Sicherungsdatei erstellen'
  },

  /* Platzhalter, solange Teil B und C fehlen */
  platzhalter: {
    sitzung: 'Die Sitzung kommt in Teil B.',
    bereich: 'Dieser Bereich kommt in Teil C.',
    zusammenfassung: 'Die Zusammenfassung kommt in Teil C.'
  },

  /* Einstellungen (Zahnrad) */
  einstellungen: {
    titel: 'Einstellungen',
    fertig: 'Fertig',
    anrede: 'Anrede',
    anredeText: 'Erscheint nur in der Begrüßung auf dem Startbildschirm.',
    anredePlatzhalter: 'Vorname, optional',
    darstellung: 'Darstellung',
    farbprofil: 'Farbe',
    erscheinung: 'Erscheinung',
    erscheinungen: [
      { id: 'auto', text: 'Automatisch' },
      { id: 'hell', text: 'Hell' },
      { id: 'dunkel', text: 'Dunkel' }
    ],
    sicherung: 'Sicherung',
    sicherungText: 'Eine Sicherungsdatei enthält alle Einträge dieser App als Textdatei. Bewahre sie an einem Ort auf, dem du vertraust, zum Beispiel in „Dateien“.',
    sichern: 'Sicherungsdatei erstellen',
    einlesen: 'Sicherung einlesen',
    letzteSicherung: 'Letzte Sicherung: {wann}',
    nochNie: 'noch nie',
    vorTagen: 'vor {n} Tagen',
    heute: 'heute',
    gestern: 'gestern',
    gesichert: 'Sicherungsdatei erstellt',
    sichernFehler: 'Die Sicherungsdatei konnte nicht erstellt werden.',
    importTitel: 'Sicherung einlesen',
    importVorschau: '{sitzungen} Sitzungen, {anteile} Anteile, Stand vom {datum}.',
    importWarnung: 'Ersetzt alle Einträge auf diesem Gerät durch den Inhalt der Datei.',
    importErsetzen: 'Ersetzen',
    importFehler: 'Die Datei lässt sich nicht einlesen.',
    importiert: 'Sicherung eingelesen',
    abbrechen: 'Abbrechen',
    loeschen: 'Alle Daten auf diesem Gerät löschen',
    loeschenTitel1: 'Alle Daten löschen?',
    loeschenText1: 'Alle Sitzungen, Listen und Anteile auf diesem Gerät werden entfernt. Eine Sicherungsdatei bleibt davon unberührt.',
    loeschenWeiter: 'Weiter',
    loeschenTitel2: 'Wirklich alles löschen?',
    loeschenText2: 'Das lässt sich nicht rückgängig machen. Wenn du keine Sicherungsdatei hast, sind die Einträge danach weg.',
    loeschenEndgueltig: 'Endgültig löschen',
    geloescht: 'Alle Daten gelöscht',
    hinweise: 'Hinweise',
    wasTitel: 'Was die App ist',
    was: [
      'Innenansicht ist ein Werkzeug für eine wöchentliche Sitzung mit dir selbst. Die Fragen stammen aus der systemischen Coaching-Arbeit und sind kuratiert, nicht automatisch erzeugt.',
      'Die App bewertet nicht, vergleicht nicht und schickt keine Nachrichten. Sie stellt keine Diagnose, behandelt nicht und ersetzt keine ärztliche oder psychologische Hilfe.'
    ],
    datenTitel: 'Deine Daten',
    daten: 'Alles liegt nur auf diesem Gerät, im Speicher dieses Browsers. Es gibt keinen Server und keine Übertragung. Letzte Sicherung: {wann}.',
    datenUmfang: '{sitzungen} Sitzungen, {anteile} Anteile.'
  },

  /* Farbprofile: Primärfarbe und Akzent. Die Farbwerte selbst stehen in styles.css (data-profil). */
  profile: [
    { id: 'navy', text: 'Navy' },
    { id: 'petrol', text: 'Petrol' },
    { id: 'graphit', text: 'Graphit' },
    { id: 'tanne', text: 'Tanne' },
    { id: 'pflaume', text: 'Pflaume' }
  ],

  /* Hinweis zum Home-Bildschirm: nur in Safari auf iPhone/iPad, solange nicht installiert */
  install: {
    titel: 'Als App auf den Home-Bildschirm',
    schritte: ['Unten das Menü-Symbol antippen', '„Teilen“ wählen', '„Zum Home-Bildschirm“ antippen'],
    text: 'Danach öffnet sich Innenansicht wie eine App, ohne Adressleiste.',
    weg: 'Nicht mehr zeigen'
  },
  safariHinweis: 'Am besten in Safari öffnen, dann bleiben deine Einträge erhalten.',

  /* Ungültiger Speicherstand */
  fehler: {
    titel: 'Gespeicherte Daten unlesbar',
    text: 'Die auf diesem Gerät gespeicherten Daten haben nicht die erwartete Form. Sie wurden nicht verändert. Du kannst sie als Datei sichern und dann neu beginnen.',
    sichern: 'Sicherungsdatei erstellen',
    neu: 'Neu beginnen',
    neuTitel: 'Neu beginnen?',
    neuText: 'Der unlesbare Stand wird verworfen. Wenn du ihn noch brauchst, erstelle zuerst die Sicherungsdatei.',
    neuJa: 'Verwerfen und neu beginnen',
    speichern: 'Speichern nicht möglich. Erstelle eine Sicherungsdatei, bevor du die App schließt.'
  },

  /* Allgemeine Beschriftungen */
  ui: {
    einstellungen: 'Einstellungen',
    schliessen: 'Schließen',
    zurueck: 'Zurück',
    weiter: 'Weiter',
    krisenzeileLabel: 'Krisenhinweis ausführlich lesen'
  },

  /* ---------- Sitzung ---------- */
  /* Skalen-Dimensionen der Standortbestimmung, in dieser Reihenfolge: { id, name, frage, pole: [bei 0, bei 10], satzFrage (optional), zeigtLiga (optional) }.
     Die id nie ändern, sonst reißt der Verlauf ab. Neue Dimensionen mit neuer id ergänzen. */
  dimensionen: [
    { id: 'gesamt', name: 'Gesamt', frage: 'Wo stehst du heute insgesamt?', pole: ['ganz unten', 'ganz oben'] },
    { id: 'fuehren', name: 'Führen wollen', frage: 'Wie deutlich ist heute dein Ja zum Führen?', pole: ['gar nicht', 'ganz deutlich'] },
    { id: 'liga', name: 'Meine Liga', frage: 'Wie nah bist du heute der Liga, in der du spielen willst?', pole: ['weit entfernt', 'bin dort'], zeigtLiga: true },
    { id: 'selbstgespraech', name: 'Selbstgespräch', frage: 'Wie wohlwollend hast du diese Woche mit dir gesprochen?', pole: ['hart', 'wohlwollend'], satzFrage: 'Ein Satz, den du dir diese Woche gesagt hast' }
  ],

  /* Nachfrage-Pfade für die vertiefte Skala. Zuerst zählt die Veränderung zur letzten Sitzung (veraenderungAb / veraenderungBis),
     dann der Wert (wertVon bis wertBis). Je Pfad zwei Fragen, je eine pro Bildschirm.
     uebernehmen: Knopf „In Ressourcen übernehmen“; anteilWaehlen: zweite Frage wählt einen Anteil, der in Schritt 3 vorgeschlagen wird. */
  pfade: {
    anstieg: {
      name: 'Höher als zuletzt', werkzeug: 'Ressourcen', bedingung: { veraenderungAb: 2 }, uebernehmen: true,
      fragen: ['Was hast du seit der letzten Sitzung anders gemacht?', 'Was davon willst du beibehalten?']
    },
    abfall: {
      name: 'Niedriger als zuletzt', werkzeug: 'Inneres Team', bedingung: { veraenderungBis: -2 }, anteilWaehlen: true,
      fragen: ['Was war diese Woche anders?', 'Welcher Anteil in dir hat sich dabei gemeldet?']
    },
    ausnahme: {
      name: 'Ausnahme', werkzeug: 'Ausnahmefrage', bedingung: { wertVon: 0, wertBis: 3 },
      fragen: ['Wann in den letzten Wochen war es, und sei es kurz, ein wenig anders?', 'Was war da anders, und was davon lässt sich wiederholen?']
    },
    schritt: {
      name: 'Ein Punkt höher', werkzeug: 'Skalierungs-Nachfrage', bedingung: { wertVon: 4, wertBis: 7 },
      fragen: ['Woran würdest du merken, dass es einen Punkt höher steht?', 'Was wäre ein erster kleiner Schritt dahin?']
    },
    ressource: {
      name: 'Was trägt', werkzeug: 'Ressourcen', bedingung: { wertVon: 8, wertBis: 10 }, uebernehmen: true,
      fragen: ['Was trägt dazu bei?', 'Was davon willst du bewusst halten?']
    }
  },

  /* Texte der sechs Schritte. {n}, {x}, {name} usw. füllt die App. */
  sitzung: {
    titel: 'Sitzung {n}',
    schliessen: 'Schließen',
    zurueck: 'Zurück',
    weiter: 'Weiter',
    schrittVon: 'Schritt {x} von {n}',
    schritte: ['Ankommen', 'Standortbestimmung', 'Inneres Team', 'Außensicht', 'Klarheit', 'Abschluss'],
    dauer: ['1–2 Min.', '4–6 Min.', '5–8 Min.', '2–3 Min.', '3–4 Min.', '2 Min.'],
    datumZeile: '{datum} · Sitzung {n}',
    platzhalter: 'Ein paar Worte, optional',

    /* Schritt 1 · Ankommen */
    rueckkehrAb: 14, /* Rückkehrfrage, wenn mehr Tage als hier seit der letzten Sitzung vergangen sind */
    rueckkehr: 'Seit der letzten Sitzung sind {n} Tage vergangen. Was hat sich in der Zwischenzeit verändert?',
    vorhaben: {
      frage: 'Dein Schritt war: „{text}“. Wie ist es gelaufen?',
      antworten: [
        { id: 'getan', text: 'getan' },
        { id: 'teilweise', text: 'teilweise' },
        { id: 'nicht', text: 'nicht getan' },
        { id: 'anders', text: 'anders gekommen' }
      ],
      notiz: 'Ein Satz dazu, optional'
    },
    rueckblickAlle: 4, /* jede vierte Sitzung beginnt mit dem Rückblick */
    rueckblick: {
      titel: 'Rückblick',
      text: 'Deine Werte aus den letzten Sitzungen.',
      frage: 'Was fällt dir auf, wenn du die letzten Wochen so siehst? Welches Muster erkennst du?',
      spalte: 'S. {n}',
      leer: 'Aus früheren Sitzungen liegen noch keine Werte vor.'
    },
    thema: { frage: 'Worum geht es heute?', vorschlaege: 'Aus „Wichtig jetzt“ übernehmen:' },

    /* Schritt 2 · Standortbestimmung */
    standort: { zuletzt: 'Zuletzt: {n}', liga: 'Deine Liga: „{text}“', skalaLabel: 'Wert von 0 bis 10' },
    auswahl: {
      frage: 'Welche davon willst du heute vertiefen?',
      text: 'Vorgeschlagen ist die Skala mit der größten Veränderung zur letzten Sitzung, sonst die mit dem niedrigsten Wert.',
      wert: 'heute {wert}',
      zuletzt: 'zuletzt {n}',
      keine: 'Heute keine vertiefen'
    },
    nachfrage: 'Nachfrage · {werkzeug}',
    nachfrageKontext: '{dimension}: heute {wert}',
    nachfrageKontextZuletzt: '{dimension}: heute {wert}, zuletzt {zuletzt}',
    uebernehmen: 'In Ressourcen übernehmen',
    uebernommen: 'In Ressourcen übernommen',
    uebernehmenLeer: 'Schreib zuerst etwas in das Feld.',
    uebernehmenToast: 'In „Was mich trägt“ übernommen',

    /* Schritt 3 · Inneres Team */
    team: {
      frage: 'Wer in dir hat zu diesem Thema etwas zu sagen?',
      erklaerung: 'Stell dir vor, verschiedene Stimmen in dir sitzen an einem Tisch. Jede will etwas für dich.',
      hinweis: 'Bis zu drei antippen.',
      keine: 'Noch keine Anteile angelegt.',
      neu: 'Neuer Anteil',
      sagt: 'Was sagt {name} dazu?',
      will: 'Was will {name} damit für dich erreichen?',
      anteilVon: 'Stimme {x} von {n}',
      leitung: 'Und du, als Leitung dieses Teams: Was sagst du den Stimmen heute?'
    },
    anteilNeu: {
      titel: 'Neuer Anteil',
      name: 'Name',
      namePlatzhalter: 'z. B. Die Antreiberin',
      satz: 'Typischer Satz',
      satzPlatzhalter: 'z. B. Mach schneller.',
      anlegen: 'Anlegen',
      abbrechen: 'Abbrechen',
      nameFehlt: 'Bitte einen Namen eintragen.'
    },

    /* Schritt 4 · Außensicht */
    aussensicht: {
      frage: 'Wenn {person} dich diese Woche beobachtet hätte: Woran würde {person} merken, wo du stehst?',
      frageOhne: 'Wenn jemand, der dich gut kennt, dich diese Woche beobachtet hätte: Woran würde diese Person merken, wo du stehst?',
      person: 'Wen nimmst du dafür?',
      neu: 'Neue Person',
      neuTitel: 'Neue Person',
      neuLabel: 'Vorname oder Rolle',
      neuPlatzhalter: 'z. B. meine Stellvertretung',
      neuHinweis: 'Nur ein Vorname oder eine Rolle, kein Nachname.',
      uebernehmen: 'Übernehmen',
      nameFehlt: 'Bitte einen Vornamen oder eine Rolle eintragen.',
      ueberspringen: 'Außensicht überspringen'
    },

    /* Schritt 5 · Klarheit */
    klarheit: {
      frage: 'Was ist dir gerade wichtig?',
      ersteMal: 'Schreib ein bis drei Dinge auf, die dir gerade wichtig sind.',
      maxEintraege: 5,
      voll: 'Höchstens {n} Einträge. Verschiebe einen nach „Nicht jetzt“, um Platz zu schaffen.',
      neuLabel: 'Neuer Eintrag',
      neuPlatzhalter: 'Was ist dir wichtig?',
      dazu: 'Hinzufügen',
      nichtJetzt: 'Nicht jetzt',
      streichen: 'Streichen',
      nichtJetztAnzahl: 'Unter „Nicht jetzt“: {n}',
      ligaTitel: 'Meine Liga',
      ligaAendern: 'Ändern',
      ligaFrage: 'In welcher Liga willst du Führungskraft sein?',
      ligaText: 'Ein Satz, der bleibt, bis du ihn änderst.',
      ligaSpeichern: 'Speichern',
      vorhaben: 'Was tust du bis zur nächsten Sitzung, das zu dem passt, was dir wichtig ist?',
      vorhabenText: 'Ein Satz, optional. In der nächsten Sitzung fragt die App nach.'
    },

    /* Schritt 6 · Abschluss */
    abschluss: {
      ressource: 'Was hat dich diese Woche getragen?',
      ressourceText: 'Ein Eintrag für deine Liste „Was mich trägt“.',
      satz: 'Ein Satz an dich selbst zum Abschluss.',
      zusammenfassung: 'Deine Sitzung',
      zusammenfassungText: 'Das hast du festgehalten. Mit „Zurück“ kannst du noch etwas ändern.',
      abschliessen: 'Sitzung abschließen',
      gespeichert: 'Gespeichert auf diesem Gerät',
      sicherungText: 'Es ist Zeit für eine Sicherungsdatei. Browserdaten können verloren gehen; die Datei bewahrst du selbst auf.',
      sicherungJetzt: 'Sicherungsdatei erstellen',
      spaeter: 'Später'
    },

    /* Beschriftungen der Zusammenfassung */
    zusammenfassung: {
      datum: 'Datum',
      rueckkehr: 'Seit der letzten Sitzung',
      vorhabenRueckblick: 'Dein Schritt aus der letzten Sitzung',
      muster: 'Muster',
      thema: 'Thema',
      werte: 'Standort',
      vertieft: 'Nachfrage',
      team: 'Inneres Team',
      leitung: 'Als Leitung',
      aussensicht: 'Außensicht',
      vorhaben: 'Vorhaben bis zur nächsten Sitzung',
      ressource: 'Was dich getragen hat',
      abschlusssatz: 'Satz an dich',
      leer: 'Noch nichts festgehalten.'
    }
  }
};
