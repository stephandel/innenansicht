/* Drei Stilrichtungen für die Stilgalerie (Teil 6). Reine HTML/CSS-Attrappen im Smartphone-Rahmen,
   keine Bilder, keine Schriften von außen. Die Texte sind Beispieltexte von Stephan, keine echten Inhalte.
   Aussehen je Stil: mockups.css (Klassen .mk-ruhig, .mk-warm, .mk-klar). */
window.MOCKUPS = {
  stile: [
    {
      id: 'ruhig',
      name: 'Ruhig-minimalistisch',
      charakter: 'Viel Weißraum, eine Akzentfarbe, wenige Elemente.',
      schrift: 'Systemschrift · Grau und Salbei',
      anmutung: 'Anmutung wie Apple Health'
    },
    {
      id: 'warm',
      name: 'Warm-editorial',
      charakter: 'Serifen-Überschriften, erdige Töne, Papieranmutung.',
      schrift: 'Cormorant Garamond und Inter (mit Systemersatz) · Creme, Terrakotta, Tiefgrün',
      anmutung: 'Anmutung wie Kinfolk oder deine Visitenkarte'
    },
    {
      id: 'klar',
      name: 'Klar-strukturiert',
      charakter: 'Karten, dezente Linien, Übersichts-Gefühl.',
      schrift: 'Systemschrift · Navy, Weiß, ein Signalton',
      anmutung: 'Anmutung wie Notion'
    }
  ],

  /* Beispieltexte, für alle drei Stile gleich, damit nur die Gestaltung verglichen wird */
  texte: {
    datum: 'Montag, 26. Oktober',
    gruss: 'Guten Morgen',
    tagesfrage: 'Wie geht es dir heute?',
    skalaLinks: 'angespannt',
    skalaRechts: 'bei mir',
    start: 'Sitzung starten',
    startSub: 'Wochensitzung · etwa 20 Minuten',
    notizLabel: 'Letzte Notiz · vor 3 Tagen',
    notiz: '„Im Termin am Dienstag habe ich früher Stellung bezogen als sonst. Ungewohnt, und gut."',
    vereinbarungLabel: 'Vereinbarung mit mir',
    vereinbarung: 'Vor jeder Zusage eine Nacht warten.',
    vereinbarungBis: 'bis Freitag',
    krise: 'In akuten Krisen: Telefonseelsorge 0800 111 0 111, rund um die Uhr.',
    navZurueck: 'Zurück',
    navTitel: 'Wochensitzung',
    schritt: 'Schritt 3 von 6',
    frageArt: 'Skalierungsfrage',
    frage: 'Wo stehst du heute in Bezug auf das, was dir gerade wichtig ist?',
    hilfe: '0 heißt weit entfernt, 10 heißt genau da. Es gibt keinen richtigen Wert.',
    textLabel: 'Was macht den Unterschied zwischen heute und einer 5?',
    textInhalt: 'Ich habe mir am Montag Zeit genommen, bevor ich geantwortet habe. Dadurch …',
    weiter: 'Weiter',
    spaeter: 'Später weitermachen ist jederzeit möglich.'
  },

  /* Liefert das HTML eines Bildschirms: art = 'start' oder 'sitzung' */
  render: function (stilId, art) {
    var t = this.texte;
    var skala = function (aktiv, gross) {
      var h = '<div class="mk-skala' + (gross ? ' mk-skala-gross' : '') + '" aria-hidden="true">';
      for (var i = 0; i <= 10; i++) h += '<span class="' + (i === aktiv ? 'aktiv' : (i < aktiv ? 'davor' : '')) + '">' + i + '</span>';
      return h + '</div>';
    };
    var status = '<div class="mk-status" aria-hidden="true"><span>9:41</span><span class="mk-akku"></span></div>';
    var inhalt;
    if (art === 'start') {
      inhalt =
        status +
        '<header class="mk-kopf"><p class="mk-datum">' + t.datum + '</p><h1 class="mk-titel">' + t.gruss + '</h1></header>' +
        '<section class="mk-block"><p class="mk-label">' + t.tagesfrage + '</p>' + skala(6, false) +
        '<div class="mk-legende"><span>' + t.skalaLinks + '</span><span>' + t.skalaRechts + '</span></div></section>' +
        '<div class="mk-primary">' + t.start + '</div><p class="mk-sub">' + t.startSub + '</p>' +
        '<section class="mk-karte"><p class="mk-label">' + t.notizLabel + '</p><p class="mk-text">' + t.notiz + '</p></section>' +
        '<section class="mk-karte"><p class="mk-label">' + t.vereinbarungLabel + '</p><p class="mk-text">' + t.vereinbarung + '</p><span class="mk-chip">' + t.vereinbarungBis + '</span></section>' +
        '<footer class="mk-fuss">' + t.krise + '</footer>';
    } else {
      inhalt =
        status +
        '<header class="mk-nav"><span class="mk-zurueck">&#8249; ' + t.navZurueck + '</span><span class="mk-nav-titel">' + t.navTitel + '</span><span class="mk-schritt">3/6</span></header>' +
        '<div class="mk-progress" aria-hidden="true"><span style="width:50%"></span></div>' +
        '<p class="mk-label mk-label-oben">' + t.frageArt + ' · ' + t.schritt + '</p>' +
        '<h1 class="mk-frage">' + t.frage + '</h1>' +
        '<p class="mk-hilfe">' + t.hilfe + '</p>' +
        '<div class="mk-wert" aria-hidden="true">7</div>' + skala(7, true) +
        '<p class="mk-label mk-label-oben">' + t.textLabel + '</p>' +
        '<div class="mk-textfeld">' + t.textInhalt + '<span class="mk-cursor"></span></div>' +
        '<div class="mk-primary">' + t.weiter + '</div><p class="mk-sub">' + t.spaeter + '</p>';
    }
    return '<div class="phone mk mk-' + stilId + ' mk-' + art + '" aria-hidden="true">' + inhalt + '</div>';
  }
};
