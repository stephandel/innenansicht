/* Innenansicht: Zustand, Navigation, Erststart, Start, Einstellungen.
   Texte aus inhalte.js, Speicherung über speicher.js. Teil B (sitzung.js) und Teil C (bereiche.js) hängen sich an window.INNENANSICHT. */
(function () {
  'use strict';
  var I = window.INHALTE, UI = I.ui, E = I.einstellungen, S = window.SPEICHER;

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (s, o) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); };
  var IC = {
    /* App-Symbol als Logo in der Kopfleiste: zwei Ringe, Farben folgen dem Profil */
    logo: '<span class="logo" aria-hidden="true"><svg viewBox="0 0 46 28"><circle cx="14" cy="14" r="11.5" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="32" cy="14" r="11.5" fill="none" stroke="currentColor" stroke-width="2.6" opacity=".65"/></svg></span>',
    zahnrad: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    zu: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    menue: '<svg class="ic klein" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    teilen: '<svg class="ic klein" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8"/></svg>',
    plus: '<svg class="ic klein" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>',
    start: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/></svg>',
    klarheit: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>',
    team: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M17.5 13.5a6.5 6.5 0 0 1 4 6.5"/></svg>',
    verlauf: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 15 4-5 4 3 5-7"/></svg>'
  };

  /* Wo läuft die Seite? Steuert den Hinweis zum Home-Bildschirm und den Weg der Sicherungsdatei (Teilen-Menü auf iOS). */
  var UA = navigator.userAgent || '';
  var istIOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var istSafari = /Safari\//.test(UA) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(UA);
  var istInstalliert = navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var KEY_INSTALL_WEG = S.SCHLUESSEL + '-install-weg';
  function installHinweisWeg() { try { return localStorage.getItem(KEY_INSTALL_WEG) === '1'; } catch (e) { return false; } }

  /* ---------- Zustand ---------- */
  var geladen = S.laden();
  var Z = geladen.zustand || S.leer();
  var ladeFehler = geladen.fehler ? geladen : null;
  var ansicht = ladeFehler ? 'fehler' : (Z.einstieg.gesehen ? 'tab' : 'erststart'); /* fehler | erststart | tab | einstellungen | sitzung */
  var tab = 'start', erststartSchritt = 0, zurueckZu = null, importVorschau = null;
  function speichern() { if (!S.speichern(Z)) toast(I.fehler.speichern); }
  /* Schreibt ein anderer Tab, den Stand von dort übernehmen statt ihn später mit dem eigenen zu überschreiben */
  window.addEventListener('storage', function (ev) {
    if (ev.key !== S.SCHLUESSEL || ladeFehler) return;
    var g = S.laden(); if (g.zustand) { Z = g.zustand; render(); }
  });

  var kopf = $('#kopf'), inhalt = $('#inhalt'), tabs = $('#tabs'), krisenzeile = $('#krisenzeile'), unten = $('#unten'), dlg = $('#dlg');

  /* ---------- Datum ---------- */
  function heute() { return new Date(); }
  function datumLang(d) { return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
  function datumKurz(d) { return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  function wochentag(d) { return d.toLocaleDateString('de-DE', { weekday: 'long' }); }
  function tagAnfang(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function tageSeit(iso) { var d = new Date(iso); if (isNaN(d)) return null; return Math.round((tagAnfang(heute()) - tagAnfang(d)) / 86400000); } /* round wegen Zeitumstellung */
  /* Kalenderwoche Montag bis Sonntag in Ortszeit */
  function wochenStart(d) { var x = tagAnfang(d); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; }
  function inDieserWoche(iso) {
    var d = new Date(iso); if (isNaN(d)) return false;
    var von = wochenStart(heute()), bis = new Date(von); bis.setDate(bis.getDate() + 7);
    return d >= von && d < bis;
  }
  function letzteSitzung() { return Z.sitzungen.length ? Z.sitzungen[Z.sitzungen.length - 1] : null; }
  function sicherungFaellig() {
    var zu = Z.sicherung && Z.sicherung.zuletzt;
    if (!zu) return Z.sitzungen.length >= 4;
    return tageSeit(zu) >= 30;
  }
  function sicherungWann() {
    var zu = Z.sicherung && Z.sicherung.zuletzt; if (!zu) return E.nochNie;
    var n = tageSeit(zu); if (n === 0) return E.heute; if (n === 1) return E.gestern;
    return fmt(E.vorTagen, { n: n });
  }
  function begruessung() {
    var h = heute().getHours(), B = I.begruessung;
    var g = h < 11 ? B.morgen : h < 18 ? B.tag : B.abend;
    var name = (Z.einstellungen.name || '').trim();
    return name ? g + ', ' + name : g;
  }

  /* ---------- Darstellung: Stil, Farbprofil und Erscheinung ---------- */
  function stilGueltig(id) { return I.stile.some(function (s) { return s.id === id; }); }
  function profilGueltig(id) { return I.profile.some(function (p) { return p.id === id; }); }
  function grundGueltig(id, dunkel) { return I.gruende[dunkel ? 'dunkel' : 'hell'].some(function (g) { return g.id === id; }); }
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  // Wirksame Fassung: fest gewählt oder, bei „Automatisch“, nach dem Gerät
  function istDunkel() { var e = Z.einstellungen.erscheinung; return e === 'dunkel' || (e !== 'hell' && !!(mq && mq.matches)); }
  function darstellungAnwenden() {
    var root = document.documentElement, e = Z.einstellungen, dunkel = istDunkel();
    var profil = dunkel ? e.profilDunkel : e.profil, grund = dunkel ? e.grundDunkel : e.grund;
    root.dataset.stil = stilGueltig(e.stil) ? e.stil : 'klar';
    root.dataset.profil = profilGueltig(profil) ? profil : 'navy';
    root.dataset.erscheinung = e.erscheinung || 'auto';
    if (grundGueltig(grund, dunkel) && grund !== 'stil') root.dataset.grund = grund; else delete root.dataset.grund;
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--primaer').trim() || '#1F3A5F');
  }
  if (mq) (mq.addEventListener ? mq.addEventListener('change', darstellungAnwenden) : mq.addListener(darstellungAnwenden));

  /* ---------- Darstellung: Gerüst ---------- */
  function fokusTitel() {
    window.scrollTo(0, 0);
    var h = $('[data-fokus]', document);
    if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
  }
  function untenMessen() { document.documentElement.style.setProperty('--unten-hoehe', unten.offsetHeight + 'px'); }
  window.addEventListener('resize', untenMessen);

  function render() {
    darstellungAnwenden();
    document.body.setAttribute('data-ansicht', ansicht);
    tabs.hidden = ansicht !== 'tab';
    if (ansicht === 'fehler') renderFehler();
    else if (ansicht === 'erststart') renderErststart();
    else if (ansicht === 'einstellungen') renderEinstellungen();
    else if (ansicht === 'sitzung' && A.sitzung) A.sitzung.render(kopf, inhalt);
    else { ansicht = 'tab'; tabs.hidden = false; renderTab(); }
    renderTabs(); renderKrise(); untenMessen(); fokusTitel();
  }
  function renderTabs() {
    tabs.innerHTML = I.tabs.map(function (t) {
      return '<button role="tab" id="tab-' + esc(t.id) + '" aria-selected="' + (ansicht === 'tab' && tab === t.id) + '" aria-controls="inhalt" data-aktion="tab" data-tab="' + esc(t.id) + '">' + (IC[t.id] || '') + '<span>' + esc(t.text) + '</span></button>';
    }).join('');
  }
  function renderKrise() {
    krisenzeile.innerHTML = esc(I.krise.zeile).replace(esc(I.krise.telefon), '<b>' + esc(I.krise.telefon) + '</b>');
    krisenzeile.setAttribute('aria-label', I.krise.zeile + '. ' + UI.krisenzeileLabel);
  }
  function absaetze(liste, klasse) { return liste.map(function (t) { return '<p' + (klasse ? ' class="' + klasse + '"' : '') + '>' + esc(t) + '</p>'; }).join(''); }
  function kriseHtml(mitTitel) {
    var K = I.krise;
    return '<div class="krise-block"' + (mitTitel ? ' id="krisenhinweis"' : '') + '>' + (mitTitel ? '<h3 class="t-title3" style="margin-bottom:8px">' + esc(K.titel) + '</h3>' : '') +
      K.absaetze.map(function (t) { return '<p>' + esc(t).replace(esc(K.telefon), '<a href="' + esc(K.telefonLink) + '"><b>' + esc(K.telefon) + '</b></a>') + '</p>'; }).join('') + '</div>';
  }

  /* Hinweis je nach Umgebung: installiert → nichts; Safari auf iOS → Weg zum Home-Bildschirm; anderer iOS-Browser → Safari empfehlen */
  function umgebungsHinweis() {
    if (!istIOS || istInstalliert) return '';
    if (!istSafari) return '<p class="hinweis-box" style="margin-top:12px">' + esc(I.safariHinweis) + '</p>';
    if (installHinweisWeg()) return '';
    var H = I.install, icons = [IC.menue, IC.teilen, IC.plus];
    return '<div class="install-hinweis"><p class="t-sub">' + esc(H.titel) + '</p>' +
      '<ol class="install-schritte">' + H.schritte.map(function (s, i) { return '<li>' + icons[i] + '<span>' + esc(s) + '</span></li>'; }).join('') + '</ol>' +
      '<p class="t-hinweis">' + esc(H.text) + '</p>' +
      '<button class="button" data-aktion="install-weg">' + esc(H.weg) + '</button></div>';
  }

  /* ---------- Erststart: drei Hinweisbildschirme und die Anrede ---------- */
  function renderErststart() {
    var n = I.erststart.length + 1, x = erststartSchritt + 1, letzter = erststartSchritt >= I.erststart.length;
    kopf.innerHTML = '<span class="platz"></span><span class="titel t-caption">' + esc(fmt(I.erststartSchritt, { x: x, n: n })) + '</span><span class="platz"></span>';
    var html;
    if (!letzter) {
      var b = I.erststart[erststartSchritt];
      html = '<section class="karte">' + (erststartSchritt === 0
        ? '<h1 class="t-large-title" data-fokus>' + esc(b.titel) + '</h1><p class="untertitel">' + esc(b.untertitel) + '</p>'
        : '<h1 class="t-titel" data-fokus style="margin-bottom:12px">' + esc(b.titel) + '</h1>') +
        absaetze(b.absaetze) + (b.krise ? kriseHtml(false) : '') +
        '<div class="reihe"><button class="button breit" data-aktion="erststart-weiter">' + esc(I.erststartWeiter) + '</button></div></section>';
    } else {
      var N = I.erststartName;
      html = '<section class="karte"><h1 class="t-titel" data-fokus style="margin-bottom:12px">' + esc(N.titel) + '</h1><p class="t-sub">' + esc(N.text) + '</p>' +
        '<div class="feld" style="margin-top:16px"><label class="vh" for="name">' + esc(N.label) + '</label><input type="text" id="name" data-feld="name" placeholder="' + esc(N.platzhalter) + '" value="' + esc(Z.einstellungen.name || '') + '" autocomplete="given-name" autocapitalize="words" enterkeyhint="done"></div>' +
        '<p class="t-hinweis" style="margin-top:8px">' + esc(N.hinweis) + '</p>' +
        '<div class="reihe"><button class="button breit" data-aktion="erststart-los">' + esc(I.erststartLos) + '</button></div></section>';
    }
    inhalt.innerHTML = '<div class="erststart">' + html + '</div>';
  }

  /* ---------- Start ---------- */
  function karte(titel, innen, id) { return '<section class="karte"' + (id ? ' id="' + id + '"' : '') + '><h2 class="karte-titel">' + esc(titel) + '</h2>' + innen + '</section>'; }
  function renderStart() {
    var T = I.start, d = heute();
    kopf.innerHTML = '<div class="kopf-gross mit-logo"><h1 class="t-large-title" data-fokus>' + IC.logo + '<span>' + esc(I.titel) + '</span></h1><p class="t-sub">' + esc(datumLang(d)) + '</p></div>' +
      '<button class="icon-knopf" data-aktion="einstellungen" aria-label="' + esc(UI.einstellungen) + '">' + IC.zahnrad + '</button>';
    var html = '<p class="begruessung t-titel">' + esc(begruessung()) + '</p>';
    var letzte = letzteSitzung();

    if (!letzte && !Z.entwurf) {
      html += '<section class="karte"><h2 class="t-titel">' + esc(T.einstiegTitel) + '</h2>' + absaetze(T.einstieg) +
        '<div class="reihe"><button class="button breit" data-aktion="sitzung-start">' + esc(T.ersteSitzung) + '</button></div></section>' + umgebungsHinweis();
      inhalt.innerHTML = html; return;
    }

    /* Karte „Diese Woche“: Entwurf, erledigt in dieser Kalenderwoche oder offen */
    var woche;
    if (Z.entwurf) {
      woche = '<p class="t-titel">' + esc(T.entwurf) + '</p><div class="reihe"><button class="button breit" data-aktion="sitzung-start">' + esc(fmt(T.weitermachen, { n: Z.entwurf.schritt || 1 })) + '</button></div>';
    } else if (letzte && inDieserWoche(letzte.beendet)) {
      woche = '<p class="t-titel">' + esc(fmt(T.erledigt, { tag: wochentag(new Date(letzte.beendet)) })) + '</p><p class="t-sub">' + esc(T.erledigtHinweis) + '</p>' +
        '<div class="reihe"><button class="button leise breit" data-aktion="zusammenfassung" data-id="' + esc(letzte.id) + '">' + esc(T.zusammenfassung) + '</button></div>';
    } else {
      woche = '<p class="t-titel">' + esc(T.offen) + '</p><p class="t-sub">' + esc(T.offenHinweis) + '</p>' +
        '<div class="reihe"><button class="button breit" data-aktion="sitzung-start">' + esc(T.beginnen) + '</button></div>';
    }
    html += karte(T.dieseWoche, woche, 'karte-woche');

    if (letzte && letzte.vorhaben && String(letzte.vorhaben).trim()) {
      html += karte(T.deinSchritt, '<p>' + esc(letzte.vorhaben) + '</p><p class="t-hinweis">' + esc(T.deinSchrittHinweis) + '</p>', 'karte-schritt');
    }
    if (Z.klarheit.wichtig.length) {
      html += karte(T.wichtigJetzt, '<ul class="liste">' + Z.klarheit.wichtig.map(function (w) {
        return '<li class="liste-zeile"><span class="punkt" aria-hidden="true"></span><span class="text">' + esc(w.text) + '</span></li>';
      }).join('') + '</ul>', 'karte-wichtig');
    }
    if (sicherungFaellig()) {
      var zu = Z.sicherung.zuletzt;
      html += karte(T.sicherung, '<p class="t-sub">' + esc(zu ? fmt(T.sicherungAlt, { n: tageSeit(zu) }) : T.sicherungNie) + '</p>' +
        '<div class="reihe"><button class="button leise breit" data-aktion="sichern">' + esc(T.sichernKnopf) + '</button></div>', 'karte-sicherung');
    }
    inhalt.innerHTML = html;
  }

  /* Reiter Klarheit, Inneres Team, Verlauf: Teil C liefert die Funktion, sonst Platzhalter */
  function renderTab() {
    if (tab === 'start') return renderStart();
    var t = I.tabs.filter(function (x) { return x.id === tab; })[0];
    kopf.innerHTML = '<div class="kopf-gross"><h1 class="t-large-title" data-fokus>' + esc(t ? t.text : tab) + '</h1></div>';
    inhalt.innerHTML = '';
    var fn = A.bereiche[tab];
    if (typeof fn === 'function') fn(inhalt);
    else inhalt.innerHTML = '<section class="karte"><p class="t-sub">' + esc(I.platzhalter.bereich) + '</p></section>';
  }

  /* ---------- Einstellungen ---------- */
  function renderEinstellungen() {
    var e = Z.einstellungen;
    kopf.innerHTML = '<span class="platz"></span><h1 class="titel" data-fokus>' + esc(E.titel) + '</h1><button class="text-knopf" data-aktion="fertig">' + esc(E.fertig) + '</button>';
    var html = '';

    html += '<section class="abschnitt"><span class="t-caption">' + esc(E.anrede) + '</span><div class="karte">' +
      '<label class="vh" for="anrede">' + esc(E.anrede) + '</label><input type="text" id="anrede" data-feld="name" placeholder="' + esc(E.anredePlatzhalter) + '" value="' + esc(e.name || '') + '" autocomplete="given-name" autocapitalize="words">' +
      '<p class="t-hinweis" style="margin-top:8px">' + esc(E.anredeText) + '</p></div></section>';

    var stilId = stilGueltig(e.stil) ? e.stil : 'klar';
    var stilInfo = I.stile.filter(function (s) { return s.id === stilId; })[0];
    html += '<section class="abschnitt"><span class="t-caption">' + esc(E.darstellung) + '</span><div class="karte">' +
      '<p class="feld-label" id="lbl-stil">' + esc(E.stil) + '</p><div class="wahl-gruppe" role="radiogroup" aria-labelledby="lbl-stil">' + I.stile.map(function (s) {
        return '<button class="wahl" role="radio" aria-checked="' + (stilId === s.id) + '" data-aktion="stil" data-id="' + esc(s.id) + '">' + esc(s.text) + '</button>';
      }).join('') + '</div>' +
      '<p class="t-hinweis" id="stil-hinweis" style="margin-top:8px">' + esc(stilInfo.hinweis) + '</p>' +
      '<p class="feld-label" id="lbl-erscheinung" style="margin-top:16px">' + esc(E.erscheinung) + '</p><div class="segment" role="radiogroup" aria-labelledby="lbl-erscheinung">' + E.erscheinungen.map(function (o) {
        return '<button role="radio" aria-checked="' + (e.erscheinung === o.id) + '" data-aktion="erscheinung" data-id="' + esc(o.id) + '">' + esc(o.text) + '</button>';
      }).join('') + '</div>' +
      '<p class="t-hinweis" style="margin-top:8px">' + esc(E.erscheinungHinweis) + '</p>' +
      farbwahlHtml(false) + farbwahlHtml(true) + '</div></section>';

    html += '<section class="abschnitt"><span class="t-caption">' + esc(E.sicherung) + '</span><div class="karte"><p class="t-sub">' + esc(E.sicherungText) + '</p>' +
      '<p class="t-hinweis" id="letzte-sicherung">' + esc(fmt(E.letzteSicherung, { wann: sicherungWann() })) + '</p>' +
      '<div class="reihe stapel"><button class="button breit" data-aktion="sichern">' + esc(E.sichern) + '</button>' +
      '<button class="button leise breit" data-aktion="einlesen">' + esc(E.einlesen) + '</button></div></div></section>';

    html += '<section class="abschnitt"><div class="karte"><button class="button rot breit" data-aktion="loeschen-1">' + esc(E.loeschen) + '</button></div></section>';

    html += '<section class="abschnitt"><span class="t-caption">' + esc(E.hinweise) + '</span>' +
      '<div class="karte"><h2 class="t-title3" style="margin-bottom:8px">' + esc(E.wasTitel) + '</h2>' + absaetze(E.was) + '</div>' +
      '<div class="karte">' + kriseHtml(true).replace('class="krise-block"', 'class="krise-block" style="margin-top:0"') + '</div>' +
      '<div class="karte"><h2 class="t-title3" style="margin-bottom:8px">' + esc(E.datenTitel) + '</h2><p>' + esc(fmt(E.daten, { wann: sicherungWann() })) + '</p>' +
      '<p class="t-hinweis">' + esc(fmt(E.datenUmfang, { sitzungen: Z.sitzungen.length, anteile: Z.anteile.length })) + '</p>' + umgebungsHinweis() + '</div></section>';

    html += '<p class="t-hinweis ende-fuss">' + esc(I.fassung) + '</p>';
    inhalt.innerHTML = html;
  }
  /* Farbe und Hintergrund je Fassung (hell oder dunkel): zwei Reihen aus Tippflächen mit Farbpunkt */
  function farbwahlHtml(dunkel) {
    var E = I.einstellungen, e = Z.einstellungen, k = dunkel ? 'dunkel' : 'hell';
    var profil = dunkel ? e.profilDunkel : e.profil, grund = dunkel ? e.grundDunkel : e.grund;
    var aProfil = dunkel ? 'profil-dunkel' : 'profil', aGrund = dunkel ? 'grund-dunkel' : 'grund';
    return '<h3 class="t-title3" id="lbl-' + k + '" style="margin-top:20px">' + esc(dunkel ? E.dunkelTitel : E.hellTitel) + '</h3>' +
      '<p class="feld-label" id="lbl-profil-' + k + '" style="margin-top:8px">' + esc(E.farbprofil) + '</p><div class="wahl-gruppe" role="radiogroup" aria-labelledby="lbl-' + k + ' lbl-profil-' + k + '">' + I.profile.map(function (p) {
        return '<button class="wahl" role="radio" aria-checked="' + (profil === p.id) + '" data-aktion="' + aProfil + '" data-id="' + esc(p.id) + '"><span class="farbpunkt' + (dunkel ? ' dunkel' : '') + '" data-profil="' + esc(p.id) + '" aria-hidden="true"></span>' + esc(p.text) + '</button>';
      }).join('') + '</div>' +
      '<p class="feld-label" id="lbl-grund-' + k + '" style="margin-top:12px">' + esc(E.hintergrund) + '</p><div class="wahl-gruppe" role="radiogroup" aria-labelledby="lbl-' + k + ' lbl-grund-' + k + '">' + I.gruende[k].map(function (g) {
        return '<button class="wahl" role="radio" aria-checked="' + (grund === g.id) + '" data-aktion="' + aGrund + '" data-id="' + esc(g.id) + '"><span class="farbpunkt' + (dunkel ? ' dunkel' : '') + '" data-grund="' + esc(g.id) + '" aria-hidden="true"></span>' + esc(g.text) + '</button>';
      }).join('') + '</div>';
  }
  /* Auswahl in der Darstellung: neu zeichnen, aber Scrollstelle und Fokus auf dem gedrückten Knopf behalten (render() springt sonst zum Titel) */
  function darstellungWaehlen(el, aendern) {
    var y = window.scrollY, sel = '[data-aktion="' + el.dataset.aktion + '"][data-id="' + el.dataset.id + '"]';
    aendern(); speichern(); render();
    window.scrollTo(0, y);
    var neu = $(sel); if (neu) { try { neu.focus({ preventScroll: true }); } catch (e) { neu.focus(); } }
  }
  function einstellungenOeffnen(anker) {
    if (ansicht !== 'einstellungen') zurueckZu = { ansicht: ansicht, tab: tab };
    ansicht = 'einstellungen'; render();
    if (anker) { var el = $('#' + anker); if (el) { el.scrollIntoView({ block: 'start' }); el.setAttribute('tabindex', '-1'); try { el.focus({ preventScroll: true }); } catch (e) { /* ignorieren */ } } }
  }
  function einstellungenZu() {
    var z = zurueckZu || { ansicht: 'tab', tab: 'start' }; zurueckZu = null;
    ansicht = z.ansicht; tab = z.tab; render();
  }

  /* ---------- Ungültiger Speicherstand ---------- */
  function renderFehler() {
    var F = I.fehler;
    kopf.innerHTML = '<div class="kopf-gross mit-logo"><h1 class="t-large-title" data-fokus>' + IC.logo + '<span>' + esc(I.titel) + '</span></h1></div>';
    inhalt.innerHTML = '<section class="karte"><h2 class="t-titel">' + esc(F.titel) + '</h2><p>' + esc(F.text) + '</p><p class="t-hinweis">' + esc(ladeFehler.fehler) + '</p>' +
      '<div class="reihe stapel"><button class="button breit" data-aktion="roh-sichern">' + esc(F.sichern) + '</button>' +
      '<button class="button leise breit" data-aktion="neu-beginnen">' + esc(F.neu) + '</button></div></section>';
  }

  /* ---------- Sicherung ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateiname() { var d = heute(); return 'innenansicht-sicherung-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.json'; }
  /* Auf iOS über das Teilen-Menü (Dateien, Mail …), sonst als Download */
  function dateiAbgeben(text, name, danach) {
    if (istIOS && navigator.canShare && navigator.share && typeof File === 'function') {
      try {
        var f = new File([text], name, { type: 'application/json' });
        if (navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: name }).then(danach, function () { /* abgebrochen */ }); return; }
      } catch (e) { /* weiter zum Download */ }
    }
    try {
      var url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      danach();
    } catch (e) { toast(E.sichernFehler); }
  }
  function sichern() {
    dateiAbgeben(S.exportText(Z), dateiname(), function () {
      Z.sicherung.zuletzt = new Date().toISOString(); speichern(); toast(E.gesichert); render();
    });
  }
  function importDatei(datei) {
    if (!datei) return;
    var lesen = function (text) {
      var r = S.importieren(text);
      if (r.fehler) { dialog('<h2>' + esc(E.importTitel) + '</h2><p>' + esc(E.importFehler) + '</p><p class="t-hinweis">' + esc(r.fehler) + '</p><div class="reihe"><button class="button" data-aktion="dialog-zu">' + esc(UI.schliessen) + '</button></div>'); return; }
      importVorschau = r.zustand;
      var stand = r.exportiert || r.zustand.geaendert, d = stand ? new Date(stand) : null;
      dialog('<h2>' + esc(E.importTitel) + '</h2><p>' + esc(fmt(E.importVorschau, { sitzungen: r.zustand.sitzungen.length, anteile: r.zustand.anteile.length, datum: d && !isNaN(d) ? datumKurz(d) : '–' })) + '</p>' +
        '<p class="t-sub">' + esc(E.importWarnung) + '</p><div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(E.abbrechen) + '</button><button class="button" data-aktion="import-ersetzen">' + esc(E.importErsetzen) + '</button></div>');
    };
    if (datei.text) datei.text().then(lesen, function () { toast(E.importFehler); });
    else { var fr = new FileReader(); fr.onload = function () { lesen(fr.result); }; fr.onerror = function () { toast(E.importFehler); }; fr.readAsText(datei); }
  }

  /* ---------- Dialog und Toast ---------- */
  function dialog(html) { dlg.innerHTML = '<div class="dialog-inhalt">' + html + '</div>'; if (!dlg.open) dlg.showModal(); }
  function dialogZu() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
  var toastTimer;
  function toast(text) {
    var t = $('#toast'); t.textContent = text; t.setAttribute('data-offen', '');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.removeAttribute('data-offen'); }, 2200);
  }

  /* ---------- Vertrag für Teil B und C ---------- */
  var A = window.INNENANSICHT = {
    zustand: function () { return Z; },
    speichern: speichern,
    render: render,
    /* navigiere('start'|'klarheit'|'team'|'verlauf') wechselt den Reiter, 'sitzung' zeigt den Vollbild-Ablauf, 'einstellungen' die Einstellungen */
    navigiere: function (ziel) {
      if (ziel === 'sitzung') { ansicht = 'sitzung'; }
      else if (ziel === 'einstellungen') { einstellungenOeffnen(); return; }
      else { ansicht = 'tab'; tab = I.tabs.some(function (t) { return t.id === ziel; }) ? ziel : 'start'; }
      render();
    },
    aktionen: {},
    sitzung: null,
    bereiche: {},
    hilfe: { esc: esc, fmt: fmt, toast: toast, dialog: dialog, dialogZu: dialogZu, datumKurz: datumKurz, datumLang: datumLang, wochentag: wochentag, tageSeit: tageSeit, id: S.id, icons: IC, umgebungsHinweis: umgebungsHinweis, kriseHtml: kriseHtml }
  };

  Object.assign(A.aktionen, {
    'erststart-weiter': function () { erststartSchritt++; render(); },
    'erststart-los': function () {
      var f = $('#name'); if (f) Z.einstellungen.name = f.value.trim();
      Z.einstieg.gesehen = true; speichern(); ansicht = 'tab'; tab = 'start'; render();
    },
    'tab': function (el) { ansicht = 'tab'; tab = el.dataset.tab; render(); },
    'einstellungen': function () { einstellungenOeffnen(); },
    'fertig': function () { einstellungenZu(); },
    'krise': function () { einstellungenOeffnen('krisenhinweis'); },
    'sitzung-start': function () { if (A.sitzung && A.sitzung.start) A.sitzung.start(); else toast(I.platzhalter.sitzung); },
    'zusammenfassung': function () { toast(I.platzhalter.zusammenfassung); }, /* Teil C ersetzt diese Aktion */
    'stil': function (el) {
      var s = I.stile.filter(function (x) { return x.id === el.dataset.id; })[0]; if (!s) return;
      darstellungWaehlen(el, function () { var e = Z.einstellungen; e.stil = s.id; e.profil = s.profil; e.profilDunkel = s.profil; e.grund = 'stil'; e.grundDunkel = 'stil'; e.erscheinung = s.erscheinung; });
    },
    'profil': function (el) { darstellungWaehlen(el, function () { Z.einstellungen.profil = el.dataset.id; }); },
    'profil-dunkel': function (el) { darstellungWaehlen(el, function () { Z.einstellungen.profilDunkel = el.dataset.id; }); },
    'grund': function (el) { darstellungWaehlen(el, function () { Z.einstellungen.grund = el.dataset.id; }); },
    'grund-dunkel': function (el) { darstellungWaehlen(el, function () { Z.einstellungen.grundDunkel = el.dataset.id; }); },
    'erscheinung': function (el) { darstellungWaehlen(el, function () { Z.einstellungen.erscheinung = el.dataset.id; }); },
    'sichern': function () { sichern(); },
    'roh-sichern': function () { dateiAbgeben(ladeFehler.roh, dateiname(), function () { toast(E.gesichert); }); },
    'neu-beginnen': function () {
      var F = I.fehler;
      dialog('<h2>' + esc(F.neuTitel) + '</h2><p>' + esc(F.neuText) + '</p><div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(E.abbrechen) + '</button><button class="button rot" data-aktion="neu-beginnen-ja">' + esc(F.neuJa) + '</button></div>');
    },
    'neu-beginnen-ja': function () { S.alleLoeschen(); Z = S.leer(); ladeFehler = null; dialogZu(); ansicht = 'erststart'; erststartSchritt = 0; render(); },
    'einlesen': function () { var f = $('#import-datei'); f.value = ''; f.click(); },
    'import-ersetzen': function () {
      if (!importVorschau) return;
      Z = importVorschau; importVorschau = null; Z.einstieg.gesehen = true; speichern(); dialogZu(); toast(E.importiert); render();
    },
    'loeschen-1': function () {
      dialog('<h2>' + esc(E.loeschenTitel1) + '</h2><p>' + esc(E.loeschenText1) + '</p><div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(E.abbrechen) + '</button><button class="button" data-aktion="loeschen-2">' + esc(E.loeschenWeiter) + '</button></div>');
    },
    'loeschen-2': function () {
      dialog('<h2>' + esc(E.loeschenTitel2) + '</h2><p>' + esc(E.loeschenText2) + '</p><div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(E.abbrechen) + '</button><button class="button rot" data-aktion="loeschen-3">' + esc(E.loeschenEndgueltig) + '</button></div>');
    },
    'loeschen-3': function () {
      S.alleLoeschen(); Z = S.leer(); zurueckZu = null; dialogZu();
      ansicht = 'erststart'; erststartSchritt = 0; render(); toast(E.geloescht);
    },
    'dialog-zu': function (el) { var d = el.closest('dialog'); if (d) d.close(); },
    'install-weg': function () { try { localStorage.setItem(KEY_INSTALL_WEG, '1'); } catch (e) { /* ignorieren */ } render(); }
  });

  /* ---------- Ereignisse: eine Stelle für alle Knöpfe ---------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-aktion]'); if (!el) return;
    if (el.getAttribute('aria-disabled') === 'true') { ev.preventDefault(); return; }
    var fn = A.aktionen[el.dataset.aktion];
    if (typeof fn === 'function') fn(el, ev);
  });
  /* Anrede: bei jeder Eingabe speichern (Erststart übernimmt sie beim Knopf) */
  document.addEventListener('input', function (ev) {
    var el = ev.target; if (!el.dataset || el.dataset.feld !== 'name' || ansicht !== 'einstellungen') return;
    Z.einstellungen.name = el.value.trim(); speichern();
  });
  $('#import-datei').addEventListener('change', function (ev) { importDatei(ev.target.files && ev.target.files[0]); });

  render();
})();
