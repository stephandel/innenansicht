/* Teil C: die Bereiche Klarheit, Inneres Team und Verlauf (mit SVG-Kurven) sowie die Sitzungszusammenfassung.
   Setzt INNENANSICHT.bereiche.klarheit / team / verlauf = function (container) {…}, dazu kurve() und zusammenfassungHtml() für Teil B. */
(function () {
  'use strict';
  var A = window.INNENANSICHT, I = window.INHALTE, H = A.hilfe, esc = H.esc, fmt = H.fmt;

  /* Texte der Bereiche (Teil C). Personenneutral, „du“, nüchtern. */
  var T = {
    zurueck: 'Zurück',
    schliessen: 'Schließen',
    speichern: 'Speichern',
    abbrechen: 'Abbrechen',
    klarheit: {
      wichtig: 'Wichtig jetzt',
      nichtJetzt: 'Nicht jetzt',
      seit: 'seit {datum}',
      wichtigLeer: 'Noch nichts eingetragen. In der Sitzung fragt dich die App, was dir gerade wichtig ist.',
      nichtJetztLeer: 'Hier landet, was du bewusst zurückstellst.',
      neuWichtig: 'Neuer Eintrag für „Wichtig jetzt“',
      neuNichtJetzt: 'Neuer Eintrag für „Nicht jetzt“',
      platzhalter: 'Eintrag hinzufügen',
      hinzufuegen: 'Hinzufügen',
      voll: 'Höchstens fünf, verschiebe erst etwas nach Nicht jetzt.',
      eintrag: 'Eintrag',
      text: 'Text',
      nachNichtJetzt: 'Nach „Nicht jetzt“ verschieben',
      nachWichtig: 'Nach „Wichtig jetzt“ verschieben',
      streichen: 'Streichen',
      gestrichen: 'Eintrag gestrichen',
      verschoben: 'Verschoben nach „{liste}“',
      liga: 'Meine Liga',
      ligaGeaendert: 'zuletzt geändert am {datum}',
      ligaLeer: 'Noch kein Satz. In der Sitzung kannst du festhalten, in welcher Liga du Führungskraft sein willst.',
      ligaBearbeiten: 'Bearbeiten',
      ligaFestlegen: 'Satz festhalten',
      ligaTitel: 'Meine Liga',
      ligaLabel: 'In welcher Liga willst du Führungskraft sein?',
      traegt: 'Was mich trägt',
      traegtLeer: 'Am Ende jeder Sitzung fragt dich die App, was dich getragen hat. Das sammelt sich hier.',
      ressourceStreichen: 'Streichen: {text}',
      ressourceTitel: 'Eintrag streichen?',
      ressourceText: '„{text}“ wird aus der Liste entfernt. Die Sitzung, aus der er stammt, bleibt unverändert.'
    },
    team: {
      neu: 'Neuer Anteil',
      leer: 'Stell dir vor, verschiedene Stimmen in dir sitzen an einem Tisch; in der Sitzung lernst du sie kennen, und hier kannst du auch selbst einen Anteil anlegen.',
      zuletzt: 'zuletzt gemeldet: Sitzung {n}',
      nochNie: 'noch in keiner Sitzung gemeldet',
      inSitzungen: 'in {n} Sitzungen',
      inSitzung: 'in 1 Sitzung',
      anliegen: 'Anliegen',
      keinSatz: 'Noch kein typischer Satz notiert.',
      archiviert: 'Archiviert ({n})',
      zurueckholen: 'Zurückholen',
      zurueckgeholt: '{name} ist wieder im Team',
      bearbeiten: 'Bearbeiten',
      archivieren: 'Archivieren',
      archivTitel: '{name} archivieren?',
      archivText: 'Der Anteil verschwindet aus der Übersicht. Seine Äußerungen bleiben in den Sitzungen erhalten, und du kannst ihn jederzeit zurückholen.',
      archiviertToast: '{name} archiviert',
      aeusserungen: 'Äußerungen aus Sitzungen',
      keineAeusserung: 'Dieser Anteil hat sich noch in keiner Sitzung gemeldet.',
      sagt: 'sagt',
      will: 'will',
      leitung: 'Leitung',
      titelNeu: 'Neuer Anteil',
      titelBearbeiten: 'Anteil bearbeiten',
      name: 'Name',
      namePlatz: 'z. B. die Antreiberin',
      satz: 'Typischer Satz',
      satzPlatz: 'Was sagt dieser Anteil oft?',
      anliegenPlatz: 'Was will er für dich erreichen? Optional',
      nameFehlt: 'Bitte gib dem Anteil einen Namen.',
      gespeichert: 'Gespeichert'
    },
    verlauf: {
      standort: 'Standort',
      kurvenLeer: 'Die Kurven erscheinen ab der zweiten Sitzung. Jede Sitzung setzt einen Punkt.',
      kurveHinweis: 'Tippe auf einen Punkt, um Datum, Wert und Satz zu sehen.',
      kurveLabel: '{name}: Werte aus {n} Sitzungen, Skala 0 bis 10',
      punktLabel: 'Sitzung {n}, {datum}: {wert}',
      punktInfo: 'Sitzung {n} · {datum} · Wert {wert}',
      skala: 'Skala 0 bis 10, Sitzung {von} bis {bis}',
      muster: 'Erkannte Muster',
      musterLeer: 'Ab der vierten Sitzung fragt dich die App nach Mustern.',
      sitzungen: 'Sitzungen',
      sitzungenLeer: 'Noch keine abgeschlossene Sitzung. Nach der ersten steht sie hier.',
      sitzung: 'Sitzung {n}',
      vertieft: 'vertieft: {name}'
    },
    zf: {
      thema: 'Thema',
      rueckkehr: 'Nach der Pause',
      vorhabenRueckblick: 'Dein Schritt aus der letzten Sitzung',
      standort: 'Standort',
      vertieft: 'Vertieft',
      team: 'Inneres Team',
      leitung: 'Du als Leitung',
      aussensicht: 'Außensicht',
      vorhaben: 'Vorhaben bis zur nächsten Sitzung',
      ressource: 'Was dich getragen hat',
      abschlusssatz: 'Satz an dich selbst',
      leer: 'In dieser Sitzung wurde nichts eingetragen.',
      status: { getan: 'getan', teilweise: 'teilweise', nicht: 'nicht getan', anders: 'anders gekommen' }
    }
  };

  /* Fallbacks, solange inhalte.js (Teil B) keine Dimensionen und Pfade liefert */
  var DIM_FALLBACK = [
    { id: 'gesamt', name: 'Gesamt' },
    { id: 'fuehren', name: 'Führen wollen' },
    { id: 'liga', name: 'Meine Liga' },
    { id: 'selbstgespraech', name: 'Selbstgespräch' }
  ];
  var PFAD_FALLBACK = { anstieg: 'Anstieg', abfall: 'Rückgang', ausnahme: 'Ausnahme', schritt: 'Nächster Schritt', ressource: 'Ressource' };
  var WT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  var CHEVRON = '<svg class="ic klein" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';

  /* ---------- Zustand der Unteransichten ---------- */
  var unter = { team: null, verlauf: null }; /* Anteil-Id bzw. Sitzungs-Id */
  var archivOffen = false, aktuell = null, scrollVorher = 0;

  var Z = function () { return A.zustand(); };
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var kopf = function () { return document.getElementById('kopf'); };

  /* ---------- Hilfen ---------- */
  function datum(iso) { var d = new Date(iso); return isNaN(d) ? null : d; }
  function tagMonat(iso) { var d = datum(iso); return d ? d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }) : ''; }
  function wtTagMonat(iso) { var d = datum(iso); return d ? WT[d.getDay()] + ', ' + tagMonat(iso) : ''; }
  function sitzungsDatum(s) { return s.beendet || s.begonnen; }
  function dimensionen() { return (I.dimensionen && I.dimensionen.length) ? I.dimensionen : DIM_FALLBACK; }
  function dimName(id) {
    var d = dimensionen().filter(function (x) { return x.id === id; })[0] || DIM_FALLBACK.filter(function (x) { return x.id === id; })[0];
    return d ? (d.name || d.id) : id;
  }
  function pfadName(p) { var x = I.pfade && I.pfade[p]; return (x && (x.name || x.titel)) || PFAD_FALLBACK[p] || p; }
  function pfadFragen(p) {
    var x = I.pfade && I.pfade[p], f = x && x.fragen;
    return Array.isArray(f) ? f.map(function (q) { return typeof q === 'string' ? q : (q && (q.frage || q.text)) || ''; }) : [];
  }
  function sitzungenSortiert() { return Z().sitzungen.slice().sort(function (a, b) { return (a.nummer || 0) - (b.nummer || 0); }); }
  function wertVon(s, dim) { var v = s.werte && s.werte[dim]; return v && typeof v.wert === 'number' ? v.wert : null; }
  function gefuellt(t) { return t != null && String(t).trim() !== ''; }
  function anteilName(id) { var a = Z().anteile.filter(function (x) { return x.id === id; })[0]; return a ? a.name : ''; }
  function kopfGross(titel, extra) {
    kopf().innerHTML = '<div class="kopf-gross"><h1 class="t-large-title" data-fokus>' + esc(titel) + '</h1></div>' + (extra || '');
  }
  function kopfZurueck(titel) {
    kopf().innerHTML = '<button class="text-knopf c-zurueck" data-aktion="c-zurueck">' + CHEVRON + '<span>' + esc(T.zurueck) + '</span></button>' +
      '<h1 class="titel" data-fokus>' + esc(titel) + '</h1><span class="c-kopf-platz" aria-hidden="true"></span>';
  }
  function tabText(id) { var t = I.tabs.filter(function (x) { return x.id === id; })[0]; return t ? t.text : id; }
  function abschnitt(titel, innen, id) { return '<section class="abschnitt"' + (id ? ' id="' + id + '"' : '') + '><h2 class="t-caption">' + esc(titel) + '</h2>' + innen + '</section>'; }
  function leer(text) { return '<p class="t-sub c-leer">' + esc(text) + '</p>'; }

  /* Neu zeichnen ohne Sprung nach oben (nach Änderungen in derselben Ansicht) */
  function zeichne() {
    var y = window.scrollY, c = document.getElementById('inhalt');
    if (aktuell && B[aktuell]) B[aktuell](c);
    window.scrollTo(0, y);
  }
  function aendern(fn) { fn(Z()); A.speichern(); zeichne(); }
  function oeffneUnter(bereich, id) { scrollVorher = window.scrollY; unter[bereich] = id; A.render(); }
  function schliesseUnter() {
    var b = aktuell; if (!b) return;
    unter[b] = null; A.render(); window.scrollTo(0, scrollVorher);
  }
  function dlgFeld(id) { var f = $('#dlg #' + id); return f ? f.value.trim() : ''; }
  function dlgHinweis(text) { var h = $('#dlg .c-dlg-hinweis'); if (h) h.textContent = text; }

  /* ---------- Klarheit ---------- */
  function eintragZeile(e, liste) {
    return '<li><button class="liste-zeile" data-aktion="c-eintrag" data-liste="' + liste + '" data-id="' + esc(e.id) + '">' +
      '<span class="text">' + esc(e.text) + '</span><span class="nebentext">' + esc(fmt(T.klarheit.seit, { datum: tagMonat(e.seit) })) + '</span></button></li>';
  }
  function neuFeld(liste) {
    var K = T.klarheit, label = liste === 'wichtig' ? K.neuWichtig : K.neuNichtJetzt;
    return '<form class="c-neu" data-c-form="' + liste + '"><label class="vh" for="c-neu-' + liste + '">' + esc(label) + '</label>' +
      '<input type="text" id="c-neu-' + liste + '" placeholder="' + esc(K.platzhalter) + '" enterkeyhint="done" autocomplete="off">' +
      '<button class="button leise" type="submit">' + esc(K.hinzufuegen) + '</button></form>';
  }
  function klarheit(c) {
    aktuell = 'klarheit'; kopfGross(tabText('klarheit'));
    var K = T.klarheit, k = Z().klarheit, voll = k.wichtig.length >= 5;
    var html = '';
    html += abschnitt(K.wichtig, '<div class="karte" id="c-wichtig">' +
      (k.wichtig.length ? '<ul class="liste">' + k.wichtig.map(function (e) { return eintragZeile(e, 'wichtig'); }).join('') + '</ul>' : leer(K.wichtigLeer)) +
      neuFeld('wichtig') + '<p class="t-hinweis c-voll" role="status">' + (voll ? esc(K.voll) : '') + '</p></div>');
    html += abschnitt(K.nichtJetzt, '<div class="karte" id="c-nichtjetzt">' +
      (k.nichtJetzt.length ? '<ul class="liste">' + k.nichtJetzt.map(function (e) { return eintragZeile(e, 'nichtJetzt'); }).join('') + '</ul>' : leer(K.nichtJetztLeer)) +
      neuFeld('nichtJetzt') + '</div>');
    var liga = k.liga && gefuellt(k.liga.text) ? k.liga : null;
    html += abschnitt(K.liga, '<div class="karte" id="c-liga">' +
      (liga ? '<p class="c-liga-satz">' + esc(liga.text) + '</p><p class="t-hinweis">' + esc(fmt(K.ligaGeaendert, { datum: tagMonat(liga.geaendert) })) + '</p>' : leer(K.ligaLeer)) +
      '<div class="reihe"><button class="button leise breit" data-aktion="c-liga">' + esc(liga ? K.ligaBearbeiten : K.ligaFestlegen) + '</button></div></div>');
    var res = Z().ressourcen.slice().sort(function (a, b) { return String(b.datum).localeCompare(String(a.datum)); });
    html += abschnitt(K.traegt, '<div class="karte" id="c-ressourcen">' + (res.length ? '<ul class="liste">' + res.map(function (r) {
      return '<li class="liste-zeile"><span class="text">' + esc(r.text) + '<span class="c-datum">' + esc(tagMonat(r.datum)) + '</span></span>' +
        '<button class="icon-knopf" data-aktion="c-ressource-weg" data-id="' + esc(r.id) + '" aria-label="' + esc(fmt(K.ressourceStreichen, { text: r.text })) + '">' + H.icons.zu + '</button></li>';
    }).join('') + '</ul>' : leer(K.traegtLeer)) + '</div>');
    c.innerHTML = html;
  }
  function eintragFinden(liste, id) { return Z().klarheit[liste].filter(function (e) { return e.id === id; })[0]; }

  /* ---------- Inneres Team ---------- */
  function auftritte(anteilId) {
    return sitzungenSortiert().filter(function (s) { return (s.team || []).some(function (t) { return t.anteilId === anteilId; }); });
  }
  function team(c) {
    aktuell = 'team';
    var TT = T.team, alle = Z().anteile.slice().sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'de'); });
    if (unter.team) {
      var a = alle.filter(function (x) { return x.id === unter.team; })[0];
      if (a) return teamDetail(c, a);
      unter.team = null;
    }
    kopfGross(tabText('team'), '<button class="text-knopf" data-aktion="c-anteil-neu">' + esc(TT.neu) + '</button>');
    var aktiv = alle.filter(function (x) { return !x.archiviert; }), arch = alle.filter(function (x) { return x.archiviert; });
    var html = aktiv.length ? aktiv.map(function (x) {
      var auf = auftritte(x.id), letzte = auf[auf.length - 1];
      var meta = (letzte ? fmt(TT.zuletzt, { n: letzte.nummer }) : TT.nochNie) + (auf.length ? ' · ' + (auf.length === 1 ? TT.inSitzung : fmt(TT.inSitzungen, { n: auf.length })) : '');
      return '<button class="karte c-anteil" data-aktion="c-anteil" data-id="' + esc(x.id) + '">' +
        '<span class="c-anteil-name">' + esc(x.name) + '</span>' +
        (gefuellt(x.satz) ? '<span class="c-anteil-satz">„' + esc(x.satz) + '“</span>' : '') +
        (gefuellt(x.anliegen) ? '<span class="c-anteil-anliegen"><span class="c-marke">' + esc(TT.anliegen) + '</span> ' + esc(x.anliegen) + '</span>' : '') +
        '<span class="c-anteil-meta">' + esc(meta) + '</span>' + CHEVRON.replace('ic klein', 'ic klein c-pfeil') + '</button>';
    }).join('') : '<section class="karte">' + leer(TT.leer) + '<div class="reihe"><button class="button breit" data-aktion="c-anteil-neu">' + esc(TT.neu) + '</button></div></section>';
    if (arch.length) {
      html += '<details class="c-archiv"' + (archivOffen ? ' open' : '') + '><summary>' + esc(fmt(TT.archiviert, { n: arch.length })) + '</summary><div class="karte"><ul class="liste">' +
        arch.map(function (x) {
          return '<li class="liste-zeile"><span class="text">' + esc(x.name) + '</span><button class="button leise" data-aktion="c-anteil-zurueck" data-id="' + esc(x.id) + '">' + esc(TT.zurueckholen) + '</button></li>';
        }).join('') + '</ul></div></details>';
    }
    c.innerHTML = html;
  }
  function teamDetail(c, a) {
    var TT = T.team; kopfZurueck(a.name);
    var html = '<section class="karte" id="c-anteil-kopf">' +
      '<p class="c-anteil-satz">' + (gefuellt(a.satz) ? '„' + esc(a.satz) + '“' : '<span class="t-sub">' + esc(TT.keinSatz) + '</span>') + '</p>' +
      (gefuellt(a.anliegen) ? '<p><span class="c-marke">' + esc(TT.anliegen) + '</span> ' + esc(a.anliegen) + '</p>' : '') +
      '<div class="reihe"><button class="button leise" data-aktion="c-anteil-bearbeiten" data-id="' + esc(a.id) + '">' + esc(TT.bearbeiten) + '</button>' +
      '<button class="button rand" data-aktion="c-anteil-archivieren" data-id="' + esc(a.id) + '">' + esc(TT.archivieren) + '</button></div></section>';
    var auf = auftritte(a.id);
    html += abschnitt(TT.aeusserungen, auf.length ? auf.map(function (s) {
      var t = s.team.filter(function (x) { return x.anteilId === a.id; })[0];
      return '<article class="karte c-aeusserung"><p class="t-hinweis">' + esc(fmt(T.verlauf.sitzung, { n: s.nummer }) + ' · ' + wtTagMonat(sitzungsDatum(s))) + '</p>' +
        (gefuellt(s.thema) ? '<p class="c-thema">' + esc(s.thema) + '</p>' : '') + '<dl class="c-zf">' +
        (gefuellt(t.sagt) ? zeile(TT.sagt, esc(t.sagt)) : '') + (gefuellt(t.will) ? zeile(TT.will, esc(t.will)) : '') +
        (gefuellt(s.leitung) ? zeile(TT.leitung, esc(s.leitung)) : '') + '</dl></article>';
    }).join('') : '<div class="karte">' + leer(TT.keineAeusserung) + '</div>', 'c-aeusserungen');
    c.innerHTML = html;
  }
  function anteilDialog(a) {
    var TT = T.team;
    H.dialog('<div class="dialog-kopf"><h2>' + esc(a ? TT.titelBearbeiten : TT.titelNeu) + '</h2><button class="icon-knopf" data-aktion="dialog-zu" aria-label="' + esc(T.schliessen) + '">' + H.icons.zu + '</button></div>' +
      '<div class="feld"><label class="feld-label" for="c-a-name">' + esc(TT.name) + '</label><input type="text" id="c-a-name" value="' + esc(a ? a.name : '') + '" placeholder="' + esc(TT.namePlatz) + '" autocomplete="off"></div>' +
      '<div class="feld"><label class="feld-label" for="c-a-satz">' + esc(TT.satz) + '</label><input type="text" id="c-a-satz" value="' + esc(a ? a.satz || '' : '') + '" placeholder="' + esc(TT.satzPlatz) + '" autocomplete="off"></div>' +
      '<div class="feld"><label class="feld-label" for="c-a-anliegen">' + esc(TT.anliegen) + '</label><input type="text" id="c-a-anliegen" value="' + esc(a ? a.anliegen || '' : '') + '" placeholder="' + esc(TT.anliegenPlatz) + '" autocomplete="off"></div>' +
      '<p class="t-hinweis c-dlg-hinweis" role="status"></p>' +
      '<div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(T.abbrechen) + '</button><button class="button" data-aktion="c-anteil-speichern"' + (a ? ' data-id="' + esc(a.id) + '"' : '') + '>' + esc(T.speichern) + '</button></div>');
  }

  /* ---------- Verlauf: Kurven ---------- */
  /* SVG ohne viewBox: x in Prozent der Breite, y in Pixeln, damit Kreise rund und Tippflächen 44 px bleiben */
  function kurve(dimId, sitzungen) {
    var liste = (sitzungen || []).slice().sort(function (a, b) { return (a.nummer || 0) - (b.nummer || 0); });
    var n = liste.length, L = 7, R = 86, HOCH = 72, OBEN = 14, UNTEN = 58;
    var x = function (i) { return (n < 2 ? (L + R) / 2 : L + i * (R - L) / (n - 1)).toFixed(2) + '%'; };
    var y = function (w) { return (UNTEN - (w / 10) * (UNTEN - OBEN)).toFixed(1); };
    var s = '<svg class="c-kurve" width="100%" height="' + HOCH + '" role="group" data-dim="' + esc(dimId) + '" aria-label="' + esc(fmt(T.verlauf.kurveLabel, { name: dimName(dimId), n: n })) + '">';
    [0, 10].forEach(function (w) {
      s += '<line class="c-gitter" x1="' + L + '%" x2="' + R + '%" y1="' + y(w) + '" y2="' + y(w) + '"/>' +
        '<text class="c-achse" x="97%" y="' + y(w) + '" dy="4" text-anchor="end">' + w + '</text>';
    });
    for (var i = 1; i < n; i++) {
      var a = wertVon(liste[i - 1], dimId), b = wertVon(liste[i], dimId);
      if (a != null && b != null) s += '<line class="c-linie" x1="' + x(i - 1) + '" y1="' + y(a) + '" x2="' + x(i) + '" y2="' + y(b) + '"/>';
    }
    liste.forEach(function (st, j) {
      var w = wertVon(st, dimId); if (w == null) return;
      var lab = fmt(T.verlauf.punktLabel, { n: st.nummer, datum: wtTagMonat(sitzungsDatum(st)), wert: w });
      s += '<g class="c-punkt" role="button" tabindex="0" aria-pressed="false" data-aktion="c-punkt" data-dim="' + esc(dimId) + '" data-id="' + esc(st.id) + '" aria-label="' + esc(lab) + '">' +
        '<circle class="c-treffer" cx="' + x(j) + '" cy="' + y(w) + '" r="22"/><circle class="c-marke-punkt" cx="' + x(j) + '" cy="' + y(w) + '" r="4"/></g>';
    });
    return s + '</svg>';
  }
  function punktInfo(dimId, sid) {
    var st = Z().sitzungen.filter(function (x) { return x.id === sid; })[0]; if (!st) return '';
    var v = st.werte && st.werte[dimId];
    return '<span class="c-info-kopf">' + esc(fmt(T.verlauf.punktInfo, { n: st.nummer, datum: wtTagMonat(sitzungsDatum(st)), wert: v.wert })) + '</span>' +
      (v && gefuellt(v.satz) ? '<span class="c-info-satz">' + esc(v.satz) + '</span>' : '');
  }

  /* ---------- Sitzungszusammenfassung ---------- */
  function zeile(dt, ddHtml) { return '<div class="c-zf-zeile"><dt>' + esc(dt) + '</dt><dd>' + ddHtml + '</dd></div>'; }
  function zusammenfassungHtml(s) {
    if (!s) return '';
    var Zf = T.zf, h = '';
    if (gefuellt(s.thema)) h += zeile(Zf.thema, esc(s.thema));
    if (gefuellt(s.rueckkehr)) h += zeile(Zf.rueckkehr, esc(s.rueckkehr));
    var vr = s.vorhabenRueckblick;
    if (vr && vr.status) {
      var vorher = Z().sitzungen.filter(function (x) { return x.nummer === s.nummer - 1; })[0];
      h += zeile(Zf.vorhabenRueckblick, (vorher && gefuellt(vorher.vorhaben) ? '<span class="c-zf-zitat">„' + esc(vorher.vorhaben) + '“</span>' : '') +
        '<span>' + esc(Zf.status[vr.status] || vr.status) + '</span>' + (gefuellt(vr.notiz) ? '<span class="c-zf-satz">' + esc(vr.notiz) + '</span>' : ''));
    }
    var werte = dimensionen().filter(function (d) { return wertVon(s, d.id) != null; });
    if (werte.length) {
      h += zeile(Zf.standort, '<ul class="c-zf-werte">' + werte.map(function (d) {
        var v = s.werte[d.id];
        return '<li><span class="c-zf-dim">' + esc(d.name || d.id) + '</span><span class="c-zf-wert zahlen">' + esc(v.wert) + '</span>' +
          (gefuellt(v.satz) ? '<span class="c-zf-satz">' + esc(v.satz) + '</span>' : '') + '</li>';
      }).join('') + '</ul>');
    }
    var vt = s.vertieft;
    if (vt && vt.dimension) {
      var fr = pfadFragen(vt.pfad), antw = (vt.antworten || []).map(function (t, i) { return { t: t, f: fr[i] }; }).filter(function (x) { return gefuellt(x.t); });
      h += zeile(Zf.vertieft, '<span>' + esc(dimName(vt.dimension) + (vt.pfad ? ' · ' + pfadName(vt.pfad) : '')) + '</span>' +
        antw.map(function (x) { return (x.f ? '<span class="c-zf-frage">' + esc(x.f) + '</span>' : '') + '<span class="c-zf-satz">' + esc(x.t) + '</span>'; }).join(''));
    }
    var tm = (s.team || []).filter(function (t) { return gefuellt(t.sagt) || gefuellt(t.will) || anteilName(t.anteilId); });
    if (tm.length) {
      h += zeile(Zf.team, '<ul class="c-zf-team">' + tm.map(function (t) {
        return '<li><span class="c-zf-dim">' + esc(anteilName(t.anteilId) || '–') + '</span>' +
          (gefuellt(t.sagt) ? '<span class="c-zf-satz"><span class="c-marke">' + esc(T.team.sagt) + '</span> ' + esc(t.sagt) + '</span>' : '') +
          (gefuellt(t.will) ? '<span class="c-zf-satz"><span class="c-marke">' + esc(T.team.will) + '</span> ' + esc(t.will) + '</span>' : '') + '</li>';
      }).join('') + '</ul>');
    }
    if (gefuellt(s.leitung)) h += zeile(Zf.leitung, esc(s.leitung));
    if (s.aussensicht && gefuellt(s.aussensicht.text)) {
      var p = Z().personen.filter(function (x) { return x.id === s.aussensicht.personId; })[0];
      h += zeile(Zf.aussensicht, (p ? '<span class="c-zf-dim">' + esc(p.name) + '</span>' : '') + '<span class="c-zf-satz">' + esc(s.aussensicht.text) + '</span>');
    }
    if (gefuellt(s.vorhaben)) h += zeile(Zf.vorhaben, esc(s.vorhaben));
    if (gefuellt(s.ressource)) h += zeile(Zf.ressource, esc(s.ressource));
    if (gefuellt(s.abschlusssatz)) h += zeile(Zf.abschlusssatz, esc(s.abschlusssatz));
    return h ? '<dl class="c-zf">' + h + '</dl>' : '<p class="t-sub">' + esc(Zf.leer) + '</p>';
  }

  /* ---------- Verlauf ---------- */
  function verlauf(c) {
    aktuell = 'verlauf';
    var V = T.verlauf, alle = sitzungenSortiert();
    if (unter.verlauf) {
      var s = alle.filter(function (x) { return x.id === unter.verlauf; })[0];
      if (s) {
        kopfZurueck(fmt(V.sitzung, { n: s.nummer }));
        var d = datum(sitzungsDatum(s));
        c.innerHTML = '<section class="karte" id="c-zusammenfassung"><p class="t-sub c-zf-datum">' + esc(d ? H.datumLang(d) : '') + '</p>' + zusammenfassungHtml(s) + '</section>';
        return;
      }
      unter.verlauf = null;
    }
    kopfGross(tabText('verlauf'));
    var html = '';
    if (alle.length < 2) html += abschnitt(V.standort, '<div class="karte">' + leer(V.kurvenLeer) + '</div>', 'c-kurven');
    else {
      html += abschnitt(V.standort, dimensionen().map(function (dm) {
        return '<div class="karte c-kurve-karte"><h3 class="c-kurve-titel">' + esc(dm.name || dm.id) + '</h3>' + kurve(dm.id, alle) +
          '<p class="t-hinweis c-kurve-info" aria-live="polite">' + esc(V.kurveHinweis) + '</p></div>';
      }).join('') + '<p class="t-hinweis c-skala">' + esc(fmt(V.skala, { von: alle[0].nummer, bis: alle[alle.length - 1].nummer })) + '</p>', 'c-kurven');
    }
    var mu = Z().muster.slice().sort(function (a, b) { return String(b.datum).localeCompare(String(a.datum)); });
    html += abschnitt(V.muster, '<div class="karte">' + (mu.length ? '<ul class="liste" id="c-muster">' + mu.map(function (m) {
      return '<li class="liste-zeile c-muster"><span class="text">' + esc(m.text) + '<span class="c-datum">' + esc(wtTagMonat(m.datum)) + '</span></span></li>';
    }).join('') + '</ul>' : leer(V.musterLeer)) + '</div>');
    html += abschnitt(V.sitzungen, '<div class="karte">' + (alle.length ? '<ul class="liste" id="c-sitzungen">' + alle.slice().reverse().map(function (st) {
      var teile = [fmt(V.sitzung, { n: st.nummer }), wtTagMonat(sitzungsDatum(st))];
      if (gefuellt(st.thema)) teile.push(st.thema);
      if (st.vertieft && st.vertieft.dimension) teile.push(fmt(V.vertieft, { name: dimName(st.vertieft.dimension) }));
      return '<li><button class="liste-zeile" data-aktion="c-sitzung" data-id="' + esc(st.id) + '"><span class="text">' + esc(teile.join(' · ')) + '</span>' + CHEVRON.replace('ic klein', 'ic klein c-pfeil') + '</button></li>';
    }).join('') + '</ul>' : leer(V.sitzungenLeer)) + '</div>');
    c.innerHTML = html;
  }

  /* ---------- Vertrag ---------- */
  var B = A.bereiche;
  B.klarheit = klarheit; B.team = team; B.verlauf = verlauf;
  B.kurve = kurve; B.zusammenfassungHtml = zusammenfassungHtml;

  /* Tab-Leiste: Reiter beginnt wieder oben, Unteransichten zu */
  var tabAlt = A.aktionen.tab;
  Object.assign(A.aktionen, {
    'tab': function (el, ev) { unter.team = null; unter.verlauf = null; archivOffen = false; tabAlt(el, ev); },
    'zusammenfassung': function (el) { unter.verlauf = el.dataset.id; scrollVorher = 0; A.navigiere('verlauf'); },
    'c-zurueck': function () { schliesseUnter(); },

    /* Klarheit */
    'c-eintrag': function (el) {
      var K = T.klarheit, liste = el.dataset.liste, e = eintragFinden(liste, el.dataset.id); if (!e) return;
      H.dialog('<div class="dialog-kopf"><h2>' + esc(K.eintrag) + '</h2><button class="icon-knopf" data-aktion="dialog-zu" aria-label="' + esc(T.schliessen) + '">' + H.icons.zu + '</button></div>' +
        '<label class="feld-label" for="c-e-text">' + esc(K.text) + '</label><textarea id="c-e-text" rows="2">' + esc(e.text) + '</textarea>' +
        '<p class="t-hinweis c-dlg-hinweis" role="status"></p>' +
        '<div class="reihe stapel"><button class="button breit" data-aktion="c-eintrag-speichern" data-liste="' + liste + '" data-id="' + esc(e.id) + '">' + esc(T.speichern) + '</button>' +
        '<button class="button leise breit" data-aktion="c-eintrag-verschieben" data-liste="' + liste + '" data-id="' + esc(e.id) + '">' + esc(liste === 'wichtig' ? K.nachNichtJetzt : K.nachWichtig) + '</button>' +
        '<button class="button rot breit" data-aktion="c-eintrag-streichen" data-liste="' + liste + '" data-id="' + esc(e.id) + '">' + esc(K.streichen) + '</button></div>');
    },
    'c-eintrag-speichern': function (el) {
      var t = dlgFeld('c-e-text'); if (!t) return;
      aendern(function () { var e = eintragFinden(el.dataset.liste, el.dataset.id); if (e) e.text = t; });
      H.dialogZu();
    },
    'c-eintrag-verschieben': function (el) {
      var K = T.klarheit, von = el.dataset.liste, nach = von === 'wichtig' ? 'nichtJetzt' : 'wichtig', k = Z().klarheit;
      if (nach === 'wichtig' && k.wichtig.length >= 5) { dlgHinweis(K.voll); return; }
      var t = dlgFeld('c-e-text');
      aendern(function () {
        var e = eintragFinden(von, el.dataset.id); if (!e) return;
        k[von] = k[von].filter(function (x) { return x !== e; });
        if (t) e.text = t;
        e.seit = new Date().toISOString(); k[nach].push(e);
      });
      H.dialogZu(); H.toast(fmt(K.verschoben, { liste: nach === 'wichtig' ? K.wichtig : K.nichtJetzt }));
    },
    'c-eintrag-streichen': function (el) {
      aendern(function (z) { z.klarheit[el.dataset.liste] = z.klarheit[el.dataset.liste].filter(function (x) { return x.id !== el.dataset.id; }); });
      H.dialogZu(); H.toast(T.klarheit.gestrichen);
    },
    'c-liga': function () {
      var K = T.klarheit, l = Z().klarheit.liga;
      H.dialog('<div class="dialog-kopf"><h2>' + esc(K.ligaTitel) + '</h2><button class="icon-knopf" data-aktion="dialog-zu" aria-label="' + esc(T.schliessen) + '">' + H.icons.zu + '</button></div>' +
        '<label class="feld-label" for="c-liga-text">' + esc(K.ligaLabel) + '</label><textarea id="c-liga-text" rows="3">' + esc(l ? l.text : '') + '</textarea>' +
        '<div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(T.abbrechen) + '</button><button class="button" data-aktion="c-liga-speichern">' + esc(T.speichern) + '</button></div>');
    },
    'c-liga-speichern': function () {
      var t = dlgFeld('c-liga-text');
      aendern(function (z) { z.klarheit.liga = t ? { text: t, geaendert: new Date().toISOString() } : null; });
      H.dialogZu();
    },
    'c-ressource-weg': function (el) {
      var K = T.klarheit, r = Z().ressourcen.filter(function (x) { return x.id === el.dataset.id; })[0]; if (!r) return;
      H.dialog('<h2>' + esc(K.ressourceTitel) + '</h2><p>' + esc(fmt(K.ressourceText, { text: r.text })) + '</p>' +
        '<div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(T.abbrechen) + '</button><button class="button rot" data-aktion="c-ressource-weg-ja" data-id="' + esc(r.id) + '">' + esc(K.streichen) + '</button></div>');
    },
    'c-ressource-weg-ja': function (el) {
      aendern(function (z) { z.ressourcen = z.ressourcen.filter(function (x) { return x.id !== el.dataset.id; }); });
      H.dialogZu(); H.toast(T.klarheit.gestrichen);
    },

    /* Inneres Team */
    'c-anteil': function (el) { oeffneUnter('team', el.dataset.id); },
    'c-anteil-neu': function () { anteilDialog(null); },
    'c-anteil-bearbeiten': function (el) { var a = Z().anteile.filter(function (x) { return x.id === el.dataset.id; })[0]; if (a) anteilDialog(a); },
    'c-anteil-speichern': function (el) {
      var name = dlgFeld('c-a-name'), satz = dlgFeld('c-a-satz'), anl = dlgFeld('c-a-anliegen');
      if (!name) { dlgHinweis(T.team.nameFehlt); var f = $('#dlg #c-a-name'); if (f) f.focus(); return; }
      var id = el.dataset.id;
      H.dialogZu();
      aendern(function (z) {
        if (id) { var a = z.anteile.filter(function (x) { return x.id === id; })[0]; if (a) { a.name = name; a.satz = satz; a.anliegen = anl; } }
        else z.anteile.push({ id: H.id(), name: name, satz: satz, anliegen: anl, erstellt: new Date().toISOString(), archiviert: false });
      });
      H.toast(T.team.gespeichert);
    },
    'c-anteil-archivieren': function (el) {
      var TT = T.team, a = Z().anteile.filter(function (x) { return x.id === el.dataset.id; })[0]; if (!a) return;
      H.dialog('<h2>' + esc(fmt(TT.archivTitel, { name: a.name })) + '</h2><p>' + esc(TT.archivText) + '</p>' +
        '<div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(T.abbrechen) + '</button><button class="button" data-aktion="c-anteil-archivieren-ja" data-id="' + esc(a.id) + '">' + esc(TT.archivieren) + '</button></div>');
    },
    'c-anteil-archivieren-ja': function (el) {
      var a = Z().anteile.filter(function (x) { return x.id === el.dataset.id; })[0]; if (!a) return;
      a.archiviert = true; A.speichern(); H.dialogZu();
      schliesseUnter(); H.toast(fmt(T.team.archiviertToast, { name: a.name }));
    },
    'c-anteil-zurueck': function (el) {
      var name = '';
      aendern(function (z) { var a = z.anteile.filter(function (x) { return x.id === el.dataset.id; })[0]; if (a) { a.archiviert = false; name = a.name; } });
      H.toast(fmt(T.team.zurueckgeholt, { name: name }));
    },

    /* Verlauf */
    'c-sitzung': function (el) { oeffneUnter('verlauf', el.dataset.id); },
    'c-punkt': function (el) {
      var svg = el.closest('svg'), info = svg && svg.parentNode.querySelector('.c-kurve-info');
      svg.querySelectorAll('.c-punkt').forEach(function (p) { p.setAttribute('aria-pressed', String(p === el)); });
      if (info) { info.innerHTML = punktInfo(el.dataset.dim, el.dataset.id); info.classList.add('c-gewaehlt'); }
    }
  });

  /* Neue Einträge in Klarheit über das Feld unter der Liste */
  document.addEventListener('submit', function (ev) {
    var f = ev.target, liste = f.dataset && f.dataset.cForm; if (!liste) return;
    ev.preventDefault();
    var feld = f.querySelector('input'), t = feld.value.trim(); if (!t) return;
    var k = Z().klarheit;
    if (liste === 'wichtig' && k.wichtig.length >= 5) {
      var h = $('#c-wichtig .c-voll'); if (h) h.textContent = T.klarheit.voll;
      H.toast(T.klarheit.voll); return;
    }
    aendern(function () { k[liste].push({ id: H.id(), text: t, seit: new Date().toISOString() }); });
    var neu = document.getElementById('c-neu-' + liste); if (neu) neu.focus();
  });
  /* Kurvenpunkte sind SVG-Gruppen: Eingabetaste und Leertaste lösen sie aus */
  document.addEventListener('keydown', function (ev) {
    var el = ev.target; if (!(el instanceof SVGElement) || el.getAttribute('role') !== 'button') return;
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });
  document.addEventListener('toggle', function (ev) { if (ev.target.classList && ev.target.classList.contains('c-archiv')) archivOffen = ev.target.open; }, true);
})();
