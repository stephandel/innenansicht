/* Klärungs-Fragebogen: Ablauf, Speicherung, Zusammenfassung.
   Inhalte kommen aus config.js (Texte), fragen.js (Fragen) und mockups/mockups.js (Stilgalerie). */
(function () {
  'use strict';
  var C = window.CONFIG, UI = C.ui, F = window.FRAGEBOGEN, M = window.MOCKUPS;
  var KEY = C.speicherSchluessel;

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (s, o) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); };
  var IC = {
    zurueck: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    auf: '<svg class="ic klein" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    zu: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    haken: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
    lupe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menue: '<svg class="ic klein" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    teilen: '<svg class="ic klein" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8"/></svg>',
    plus: '<svg class="ic klein" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>'
  };

  /* Wo läuft die Seite? Steuert, ob der Home-Bildschirm-Hinweis oder der Safari-Hinweis erscheint. */
  var UA = navigator.userAgent || '';
  var istIOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var istSafari = /Safari\//.test(UA) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(UA);
  var istInstalliert = navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var KEY_INSTALL_WEG = (C.speicherSchluessel || 'fragebogen') + '-install-weg';
  function installHinweisWeg() { try { return localStorage.getItem(KEY_INSTALL_WEG) === '1'; } catch (e) { return false; } }

  /* ---------- Zustand und Speicherung ---------- */
  /* erreicht = Kennung der am weitesten erreichten Frage (keine Listenposition, die sich bei Verzweigungen verschiebt) */
  function leer() { return { version: C.version, antworten: {}, position: 0, erreicht: null, fertig: false, begonnen: null }; }
  function laden() {
    try {
      var roh = localStorage.getItem(KEY);
      if (roh) { var z = JSON.parse(roh); if (z && z.antworten) return Object.assign(leer(), z); }
    } catch (e) { /* kein Speicher verfügbar: dann ohne Zwischenstand */ }
    return leer();
  }
  var Z = laden();
  var ansicht = 'start';
  if (typeof Z.erreicht === 'number') { var alt = sichtbar(); Z.erreicht = alt[Math.min(Z.erreicht, alt.length - 1)].id; } /* alter Speicherstand mit Position */
  function speichern() { try { localStorage.setItem(KEY, JSON.stringify(Z)); } catch (e) { /* ignorieren */ } }
  function hatFortschritt() { return Z.fertig || Z.position > 0 || Object.keys(Z.antworten).length > 0; }

  /* ---------- Fragen und Antworten ---------- */
  function sichtbar() { return F.fragen.filter(function (f) { return !f.sichtbar || f.sichtbar(Z.antworten); }); }
  function teilVon(nr) { return F.teile.filter(function (t) { return t.nr === nr; })[0]; }
  /* Position der erreichten Frage in der aktuell sichtbaren Liste; ist sie gerade ausgeblendet, zählt die letzte davor */
  function erreichtIndex() {
    if (!Z.erreicht) return -1;
    var ordnung = F.fragen.map(function (f) { return f.id; }), e = ordnung.indexOf(Z.erreicht), idx = -1;
    sichtbar().forEach(function (f, i) { if (ordnung.indexOf(f.id) <= e) idx = i; });
    return idx;
  }
  function optionen(f) {
    if (f.typ === 'stil') return M.stile.map(function (s) { return { id: s.id, text: s.name }; });
    return f.optionen || [];
  }
  function optionText(f, id) {
    var o = optionen(f).filter(function (x) { return x.id === id; })[0];
    return o ? o.text : id;
  }
  function antwort(f) { return Z.antworten[f.id] || {}; }
  function setze(f, patch) {
    var a = Z.antworten[f.id] || {};
    Object.keys(patch).forEach(function (k) { a[k] = patch[k]; });
    delete a.uebersprungen;
    Z.antworten[f.id] = a;
    speichern();
  }
  function hatAuswahl(f, a) {
    switch (f.typ) {
      case 'einfach': case 'stil': return !!a.wahl;
      case 'mehrfach': return !!(a.wahl && a.wahl.length);
      case 'rangfolge': return !!(a.rang && a.rang.length);
      case 'gewichtung': return !!(a.werte && Object.keys(a.werte).length);
      case 'freitext': return !!(a.zeilen && a.zeilen.some(function (z) { return z && z.trim(); }));
    }
    return false;
  }
  function istLeer(f, a) { return !hatAuswahl(f, a) && !(a.text && a.text.trim()); }
  function vollstaendig(f, a) {
    if (f.typ === 'gewichtung') return optionen(f).every(function (o) { return a.werte && a.werte[o.id] != null; });
    return hatAuswahl(f, a);
  }
  function beantwortet(f) { var a = antwort(f); return !a.uebersprungen && !istLeer(f, a); }

  /* ---------- Darstellung ---------- */
  var kopf = $('#kopf'), inhalt = $('#inhalt'), fuss = $('#fuss');
  document.title = C.titel;

  function render() {
    if (ansicht === 'start') renderStart();
    else if (ansicht === 'frage') renderFrage();
    else renderEnde();
  }
  function absatz(text) {
    if (/^\s*\[/.test(text)) return '<span class="platzhalter">' + esc(UI.platzhalterLabel) + '</span><p class="platzhalter-text">' + esc(text) + '</p>';
    return '<p>' + esc(text) + '</p>';
  }
  function fussZeigen(html) {
    if (html) { fuss.innerHTML = html; fuss.hidden = false; document.body.setAttribute('data-fuss', ''); }
    else { fuss.innerHTML = ''; fuss.hidden = true; document.body.removeAttribute('data-fuss'); }
  }
  function fokusTitel() {
    window.scrollTo(0, 0);
    var h = $('[data-fokus]', inhalt);
    if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
  }

  /* Hinweis je nach Umgebung: installiert → nichts; Safari auf iOS → Weg zum Home-Bildschirm; anderer iOS-Browser → Safari empfehlen */
  function umgebungsHinweis() {
    if (!istIOS || istInstalliert) return '';
    if (!istSafari) return '<p class="hinweis-box" style="margin-top:12px">' + esc(C.safariHinweis) + '</p>';
    if (installHinweisWeg()) return '';
    var H = C.installHinweis, icons = [IC.menue, IC.teilen, IC.plus];
    return '<div class="install-hinweis" style="margin-top:12px"><p class="t-subhead">' + esc(H.titel) + '</p>' +
      '<ol class="install-schritte">' + H.schritte.map(function (s, i) { return '<li>' + icons[i] + '<span>' + esc(s) + '</span></li>'; }).join('') + '</ol>' +
      '<p class="hinweis">' + esc(H.text) + '</p>' +
      '<button class="button leise klein" data-aktion="install-weg">' + esc(H.weg) + '</button></div>';
  }

  /* Startbildschirm */
  function renderStart() {
    var liste = sichtbar(), n = liste.length;
    kopf.innerHTML = '';
    var html = '<section class="abschnitt"><h1 class="t-large-title" data-fokus>' + esc(C.titel) + '</h1>' +
      '<p class="t-footnote" style="margin-top:4px">' + esc(UI.untertitelStart) + '</p></section>' +
      '<section class="abschnitt"><div class="kachel">' + C.begruessung.map(absatz).join('') + '</div></section>' +
      '<section class="abschnitt"><div class="kachel"><p class="hinweis">' + esc(fmt(UI.fragenHinweis, { n: n, dauer: C.dauer })) + '</p>' +
      umgebungsHinweis() + '</div></section>';

    if (hatFortschritt()) {
      var x = Math.min(Z.position + 1, n);
      html += '<section class="abschnitt"><div class="kachel"><p class="t-subhead">' +
        esc(Z.fertig ? UI.fertigGespeichert : fmt(UI.zwischenstand, { x: x, n: n })) + '</p>' +
        '<div class="reihe stapel">' +
        (Z.fertig
          ? '<button class="button breit" data-aktion="ende">' + esc(UI.zusammenfassungAnsehen) + '</button>'
          : '<button class="button breit" data-aktion="weitermachen">' + esc(fmt(UI.weitermachen, { x: x })) + '</button>') +
        '<button class="button leise breit" data-aktion="neu">' + esc(UI.neuStarten) + '</button></div></div></section>';
    } else {
      html += '<section class="abschnitt"><button class="button breit" data-aktion="los">' + esc(UI.losGehts) + '</button></section>';
    }
    html += '<p class="t-footnote" style="text-align:center;margin-top:24px">' + esc(fmt(UI.versionLabel, { v: C.version })) + '</p>';
    inhalt.innerHTML = html;
    fussZeigen('');
    fokusTitel();
  }

  /* Ein Bildschirm pro Frage */
  function renderFrage() {
    var liste = sichtbar(), n = liste.length;
    if (Z.position >= n) { ansicht = 'ende'; Z.fertig = true; speichern(); return renderEnde(); }
    var f = liste[Z.position], a = antwort(f), teil = teilVon(f.teil), x = Z.position + 1;

    kopf.innerHTML =
      '<button class="icon-knopf" data-aktion="zurueck" aria-label="' + esc(UI.zurueck) + '">' + IC.zurueck + '</button>' +
      '<button class="fortschritt-knopf" data-aktion="uebersicht" aria-haspopup="dialog" aria-label="' + esc(fmt(UI.fortschritt, { x: x, n: n })) + ', ' + esc(fmt(UI.teilLabel, { t: teil.nr })) + ' ' + esc(teil.titel) + '. ' + esc(UI.uebersicht) + '">' +
        '<span class="teil-label"><span>' + esc(fmt(UI.teilLabel, { t: teil.nr })) + ' · ' + esc(teil.titel) + '</span>' + IC.auf + '</span>' +
        '<span class="t-subhead zahlen">' + esc(fmt(UI.fortschritt, { x: x, n: n })) + '</span></button>' +
      '<span class="platz"></span>' +
      '<div class="balken-fortschritt" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + x + '" aria-label="' + esc(fmt(UI.fortschritt, { x: x, n: n })) + '"><span style="width:' + Math.round(x / n * 100) + '%"></span></div>';

    var html = '<div class="frage-kopf">' +
      '<h2 id="frage-titel" data-fokus>' + esc(f.frage) + '</h2>' +
      (f.kontext ? '<p class="kontext">' + esc(f.kontext) + '</p>' : '') +
      (f.pflicht ? '<p class="pflicht">' + esc(UI.pflicht) + '</p>' : '') +
      '</div><div id="widget">' + widget(f, a) + '</div>';

    if (f.ergaenzung) {
      var label = f.ergaenzungLabel || UI.ergaenzung, ph = f.ergaenzungPlatzhalter || UI.ergaenzungPlatzhalter;
      html += '<div class="ergaenzung"><label class="feld-label" for="ergaenzung">' + esc(label) + '</label>' +
        '<textarea id="ergaenzung" data-feld="text" rows="2" placeholder="' + esc(ph) + '">' + esc(a.text || '') + '</textarea></div>';
    }
    inhalt.innerHTML = html;

    var letzte = Z.position === n - 1;
    fussZeigen(
      (f.pflicht ? '' : '<button class="button leise" data-aktion="ueberspringen">' + esc(UI.ueberspringen) + '</button>') +
      '<button class="button" data-aktion="weiter"' + (f.pflicht && !vollstaendig(f, a) ? ' aria-disabled="true"' : '') + '>' + esc(letzte ? UI.abschliessen : UI.weiter) + '</button>'
    );
    fokusTitel();
  }

  function widget(f, a) {
    var opts = optionen(f);
    switch (f.typ) {
      case 'einfach':
        return '<div class="optionen" role="radiogroup" aria-labelledby="frage-titel">' + opts.map(function (o) {
          return '<button class="option" role="radio" aria-checked="' + (a.wahl === o.id) + '" data-aktion="einfach" data-id="' + esc(o.id) + '">' +
            '<span class="marke">' + (a.wahl === o.id ? IC.haken : '') + '</span><span class="text">' + esc(o.text) + (o.hinweis ? '<small>' + esc(o.hinweis) + '</small>' : '') + '</span></button>';
        }).join('') + '</div>';

      case 'mehrfach':
        var wahl = a.wahl || [], voll = f.max && wahl.length >= f.max;
        return '<p class="hinweis" style="margin-bottom:12px">' + esc(f.max ? fmt(UI.mehrfachMax, { max: f.max }) : UI.mehrfachHinweis) + '</p>' +
          '<div class="optionen" role="group" aria-labelledby="frage-titel">' + opts.map(function (o) {
            var an = wahl.indexOf(o.id) >= 0;
            return '<button class="option" role="checkbox" aria-checked="' + an + '"' + (voll && !an ? ' aria-disabled="true"' : '') + ' data-aktion="mehrfach" data-id="' + esc(o.id) + '">' +
              '<span class="marke">' + (an ? IC.haken : '') + '</span><span class="text">' + esc(o.text) + '</span></button>';
          }).join('') + '</div>';

      case 'rangfolge':
        var rang = a.rang || [];
        return '<p class="hinweis" style="margin-bottom:12px">' + esc(fmt(UI.rangfolgeHinweis, { max: f.max })) + '</p>' +
          '<div class="optionen" role="group" aria-labelledby="frage-titel">' + opts.map(function (o) {
            var pos = rang.indexOf(o.id), an = pos >= 0, voll = rang.length >= f.max;
            return '<button class="option" aria-pressed="' + an + '"' + (voll && !an ? ' aria-disabled="true"' : '') + ' data-aktion="rang" data-id="' + esc(o.id) + '" aria-label="' + esc(o.text) + (an ? ', Rang ' + (pos + 1) : '') + '">' +
              '<span class="marke zahlen">' + (an ? pos + 1 : '') + '</span><span class="text">' + esc(o.text) + '</span></button>';
          }).join('') + '</div>';

      case 'gewichtung':
        var werte = a.werte || {};
        return '<p class="hinweis" style="margin-bottom:12px">' + esc(UI.gewichtungHinweis) + '</p><div class="gewichtung">' + opts.map(function (o) {
          var w = werte[o.id];
          return '<div class="zeile"><div class="zeile-kopf"><span class="kennung">' + esc(o.id) + '</span><span class="text" id="gw-' + esc(o.id) + '">' + esc(o.text) + '</span></div>' +
            '<div class="segment" role="radiogroup" aria-labelledby="gw-' + esc(o.id) + '">' + f.stufen.map(function (s) {
              return '<button role="radio" aria-checked="' + (w === s) + '" data-aktion="gewicht" data-id="' + esc(o.id) + '" data-wert="' + s + '" aria-label="' + s + ' Prozent">' + s + '</button>';
            }).join('') + '</div></div>';
        }).join('') + '</div>';

      case 'freitext':
        var zeilen = a.zeilen || [];
        var felder = [];
        for (var i = 0; i < (f.zeilen || 1); i++) {
          var ph = (f.platzhalter && f.platzhalter[i]) || '';
          felder.push('<div><label class="vh" for="zeile-' + i + '">' + esc(ph || (i + 1)) + '</label>' +
            '<input type="text" id="zeile-' + i + '" data-feld="zeile" data-index="' + i + '" placeholder="' + esc(ph) + '" value="' + esc(zeilen[i] || '') + '" autocomplete="off"></div>');
        }
        return '<div class="felder">' + felder.join('') + '</div>';

      case 'stil':
        return '<p class="hinweis" style="margin-bottom:12px">' + esc(UI.stilGalerieTitel) + '</p><div class="stil-liste" role="radiogroup" aria-labelledby="frage-titel">' + M.stile.map(function (s) {
          var an = a.wahl === s.id;
          return '<div class="stil-karte"' + (an ? ' data-gewaehlt' : '') + '>' +
            '<button class="stil-mini" data-aktion="vorschau" data-id="' + esc(s.id) + '" aria-label="' + esc(UI.stilVorschau) + ': ' + esc(s.name) + '"><span class="stil-bild">' + M.render(s.id, 'start') + '</span><span class="lupe">' + IC.lupe + esc(UI.stilVorschau) + '</span></button>' +
            '<div class="stil-text"><h3>' + esc(s.name) + '</h3><p>' + esc(s.charakter) + '</p><p>' + esc(s.schrift) + '</p><p>' + esc(s.anmutung) + '</p>' +
            '<button class="stil-wahl" role="radio" aria-checked="' + an + '" data-aktion="einfach" data-id="' + esc(s.id) + '"><span class="marke">' + (an ? IC.haken : '') + '</span>' + esc(an ? UI.stilGewaehlt : UI.stilWaehlen) + '</button></div></div>';
        }).join('') + '</div><p class="t-footnote stil-schrift-hinweis">' + esc(UI.stilHinweisSchrift) + '</p>';
    }
    return '';
  }

  /* Widget neu zeichnen, Fokus auf dem zuletzt bedienten Element halten */
  function widgetNeu(f) {
    var aktiv = document.activeElement, key = aktiv && aktiv.dataset ? (aktiv.dataset.aktion + '|' + aktiv.dataset.id + '|' + (aktiv.dataset.wert || '')) : null;
    $('#widget').innerHTML = widget(f, antwort(f));
    if (key) {
      var ziel = $$('#widget [data-aktion]').filter(function (b) { return (b.dataset.aktion + '|' + b.dataset.id + '|' + (b.dataset.wert || '')) === key; })[0];
      if (ziel) ziel.focus({ preventScroll: true });
    }
    var w = $('[data-aktion="weiter"]', fuss);
    if (w && f.pflicht) { if (vollstaendig(f, antwort(f))) w.removeAttribute('aria-disabled'); else w.setAttribute('aria-disabled', 'true'); }
  }

  /* ---------- Übersicht der Teile ---------- */
  function uebersichtOeffnen() {
    var liste = sichtbar(), dlg = $('#dlg-uebersicht');
    var aktuell = liste[Z.position];
    dlg.innerHTML = '<div class="dialog-inhalt"><div class="dialog-kopf"><h2>' + esc(UI.uebersicht) + '</h2>' +
      '<button class="icon-knopf" data-aktion="dialog-zu" aria-label="' + esc(UI.schliessen) + '">' + IC.zu + '</button></div>' +
      '<p class="t-footnote" style="margin-bottom:12px">' + esc(UI.uebersichtHinweis) + '</p><div class="teil-liste">' +
      F.teile.map(function (t) {
        var fragen = liste.filter(function (f) { return f.teil === t.nr; });
        var erste = liste.indexOf(fragen[0]);
        var frei = erste >= 0 && erste <= erreichtIndex();
        var b = fragen.filter(beantwortet).length;
        return '<button data-aktion="springen" data-index="' + erste + '"' + (frei ? '' : ' aria-disabled="true"') + (aktuell && aktuell.teil === t.nr ? ' aria-current="true"' : '') + '>' +
          '<span class="nr">' + t.nr + '</span><span class="text">' + esc(t.titel) + '<small>' + esc(fmt(UI.teilStatus, { beantwortet: b, n: fragen.length })) + '</small></span></button>';
      }).join('') + '</div></div>';
    dlg.showModal();
  }

  /* ---------- Vollbild-Vorschau der Stile ---------- */
  var vorschau = { stil: null, art: 'start' };
  function vorschauOeffnen(id) {
    vorschau.stil = id; vorschau.art = 'start';
    vorschauZeichnen();
    $('#dlg-vorschau').showModal();
    skalieren();
  }
  function vorschauZeichnen() {
    var s = M.stile.filter(function (x) { return x.id === vorschau.stil; })[0];
    var f = sichtbar()[Z.position], an = f && antwort(f).wahl === s.id;
    $('#dlg-vorschau').innerHTML = '<div class="vorschau"><div class="dialog-kopf"><h2>' + esc(s.name) + '</h2>' +
      '<button class="icon-knopf" data-aktion="dialog-zu" aria-label="' + esc(UI.schliessen) + '">' + IC.zu + '</button></div>' +
      '<div class="segment tabs" role="tablist">' +
        '<button role="tab" aria-selected="' + (vorschau.art === 'start') + '" data-aktion="vorschau-art" data-art="start">' + esc(UI.stilStart) + '</button>' +
        '<button role="tab" aria-selected="' + (vorschau.art === 'sitzung') + '" data-aktion="vorschau-art" data-art="sitzung">' + esc(UI.stilSitzung) + '</button></div>' +
      '<div class="buehne" id="buehne"><div class="phone-skal" id="phone-skal">' + M.render(s.id, vorschau.art) + '</div></div>' +
      '<p class="t-footnote">' + esc(UI.stilBeispiel) + '</p>' +
      '<div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(UI.schliessen) + '</button>' +
      '<button class="button" data-aktion="stil-waehlen" data-id="' + esc(s.id) + '">' + esc(an ? UI.stilGewaehlt : UI.stilWaehlen) + '</button></div></div>';
  }
  function skalieren() {
    var b = $('#buehne'), sk = $('#phone-skal'); if (!b || !sk) return;
    var faktor = Math.min((b.clientWidth - 24) / 408, (b.clientHeight - 24) / 798, 1); /* 390 + Rand, 780 + Rand */
    if (faktor <= 0) return;
    sk.style.width = Math.round(390 * faktor) + 'px'; sk.style.height = Math.round(780 * faktor) + 'px';
    var ph = $('.phone', sk); ph.style.transform = 'scale(' + faktor + ')';
  }
  window.addEventListener('resize', function () { if ($('#dlg-vorschau').open) skalieren(); });

  /* ---------- Abschluss und Zusammenfassung ---------- */
  function datum() { return new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }

  function antwortZeilen(f, a, mitFreitext) {
    /* liefert { auswahl: [Zeilen], frei: [Zeilen] } als Klartext */
    var r = { auswahl: [], frei: [] };
    if (a.uebersprungen || istLeer(f, a)) { r.auswahl.push(UI.uebersprungen); return r; }
    switch (f.typ) {
      case 'einfach': case 'stil': if (a.wahl) r.auswahl.push(optionText(f, a.wahl)); break;
      case 'mehrfach': (a.wahl || []).forEach(function (id) { r.auswahl.push(optionText(f, id)); }); break;
      case 'rangfolge': (a.rang || []).forEach(function (id, i) { r.auswahl.push((i + 1) + '. ' + optionText(f, id)); }); break;
      case 'gewichtung': optionen(f).forEach(function (o) { var w = a.werte && a.werte[o.id]; r.auswahl.push(o.id + ' · ' + o.text + ': ' + (w == null ? '–' : w + ' %')); }); break;
      case 'freitext': if (mitFreitext) (a.zeilen || []).forEach(function (z, i) { if (z && z.trim()) r.frei.push((i + 1) + '. ' + z.trim()); }); break;
    }
    if (mitFreitext && a.text && a.text.trim()) r.frei.push((f.ergaenzungLabel || UI.ergaenzung.replace(/\s*\(.*\)\s*$/, '')) + ': ' + a.text.trim());
    return r;
  }

  function markdown() {
    var mitFreitext = true, liste = sichtbar();
    var md = '# ' + UI.markdownTitel + '\n' + fmt(UI.antwortenVom, { datum: datum() }) + ' · ' + fmt(UI.markdownFassung, { v: C.version }) + '\n';
    F.teile.forEach(function (t) {
      var fragen = liste.filter(function (f) { return f.teil === t.nr; });
      if (!fragen.length) return;
      md += '\n## Teil ' + t.nr + ' – ' + t.titel + '\n';
      fragen.forEach(function (f) {
        var z = antwortZeilen(f, antwort(f), mitFreitext);
        if (z.auswahl.length === 0 && z.frei.length > 0) z.auswahl.push('');
        if (f.typ === 'gewichtung' || f.typ === 'rangfolge' || (f.typ === 'mehrfach' && z.auswahl.length > 1)) {
          md += '- ' + f.titel + ':' + (z.auswahl[0] === UI.uebersprungen ? ' ' + UI.uebersprungen : '') + '\n';
          if (z.auswahl[0] !== UI.uebersprungen) z.auswahl.forEach(function (s) { md += '  - ' + s + '\n'; });
        } else {
          md += ('- ' + f.titel + ': ' + z.auswahl.join('; ')).replace(/\s+$/, '') + '\n';
        }
        z.frei.forEach(function (s) { md += '  > ' + s.replace(/\n+/g, ' ') + '\n'; });
      });
    });
    return md;
  }

  /* Gekürzte Fassung für mailto: nur beantwortete Fragen, Kurzformen, eine Zeile je Frage, keine Freitexte */
  function mailText() {
    var liste = sichtbar(), zeilen = [UI.markdownTitel + ', ' + fmt(UI.antwortenVom, { datum: datum() })];
    var kurz = function (f, id) { var o = optionen(f).filter(function (x) { return x.id === id; })[0]; return o ? (o.kurz || o.text) : id; };
    F.teile.forEach(function (t) {
      var fragen = liste.filter(function (f) { return f.teil === t.nr && beantwortet(f); });
      if (!fragen.length) return;
      zeilen.push(fmt(UI.mailTeil, { t: t.nr }));
      fragen.forEach(function (f) {
        var a = antwort(f), s = '';
        switch (f.typ) {
          case 'einfach': case 'stil': s = a.wahl ? kurz(f, a.wahl) : ''; break;
          case 'mehrfach': s = (a.wahl || []).map(function (id) { return kurz(f, id); }).join(', '); break;
          case 'rangfolge': s = (a.rang || []).map(function (id, i) { return (i + 1) + '. ' + kurz(f, id); }).join(', '); break;
          case 'gewichtung': s = optionen(f).map(function (o) { var w = a.werte && a.werte[o.id]; return o.id + ' ' + (w == null ? '–' : w + ' %'); }).join(', '); break;
          case 'freitext': s = UI.mailFreitext; break;
        }
        if (f.typ !== 'freitext' && a.text && a.text.trim()) s += (s ? ' ' : '') + UI.mailErgaenzung;
        zeilen.push('- ' + f.id + ': ' + s); /* Kennung statt Titel, damit die Mail-Adresse kurz bleibt */
      });
    });
    zeilen.push('', UI.mailNachsatz);
    return zeilen.join('\n');
  }

  function zusammenfassungHtml() {
    var liste = sichtbar();
    return F.teile.map(function (t) {
      var fragen = liste.filter(function (f) { return f.teil === t.nr; });
      if (!fragen.length) return '';
      return '<section class="abschnitt"><span class="t-caption">' + esc(fmt(UI.teilLabel, { t: t.nr })) + ' · ' + esc(t.titel) + '</span><div class="kachel">' + fragen.map(function (f) {
        var a = antwort(f), h = '<div class="zf-frage"><p class="zf-titel">' + esc(f.titel) + '</p>';
        if (a.uebersprungen || istLeer(f, a)) return h + '<p class="zf-leer">' + esc(UI.uebersprungen) + '</p></div>';
        if (f.typ === 'gewichtung') {
          h += '<div class="balkenliste">' + optionen(f).map(function (o) {
            var w = a.werte && a.werte[o.id];
            return '<div class="balken-zeile"><span class="bt">' + esc(o.id) + ' · ' + esc(o.text) + '</span><span class="balken-spur"><span style="width:' + (w || 0) + '%"></span></span><span class="balken-wert zahlen">' + (w == null ? '–' : w + ' %') + '</span></div>';
          }).join('') + '</div>';
        } else if (f.typ === 'rangfolge') {
          h += '<ol class="zf-antwort">' + (a.rang || []).map(function (id) { return '<li>' + esc(optionText(f, id)) + '</li>'; }).join('') + '</ol>';
        } else if (f.typ === 'mehrfach') {
          h += '<ul class="zf-antwort">' + (a.wahl || []).map(function (id) { return '<li>' + esc(optionText(f, id)) + '</li>'; }).join('') + '</ul>';
        } else if (f.typ === 'freitext') {
          h += (a.zeilen || []).map(function (z, i) { return z && z.trim() ? '<p class="zitat">' + (i + 1) + '. ' + esc(z.trim()) + '</p>' : ''; }).join('');
        } else if (a.wahl) {
          h += '<p class="zf-antwort">' + esc(optionText(f, a.wahl)) + '</p>';
        }
        if (a.text && a.text.trim()) h += '<p class="zitat"><b>' + esc(f.ergaenzungLabel || UI.ergaenzung) + '</b><br>' + esc(a.text.trim()) + '</p>';
        return h + '</div>';
      }).join('') + '</div></section>';
    }).join('');
  }

  function renderEnde() {
    kopf.innerHTML = '<button class="icon-knopf" data-aktion="zurueck" aria-label="' + esc(UI.zurueck) + '">' + IC.zurueck + '</button><span class="titel">' + esc(C.titel) + '</span><span class="platz"></span>';
    var mailto = 'mailto:' + encodeURIComponent(C.mail) + '?subject=' + encodeURIComponent(C.mailBetreff) + '&body=' + encodeURIComponent(mailText());
    inhalt.innerHTML =
      '<section class="abschnitt"><div class="kachel">' + C.schluss.map(absatz).join('') + '</div></section>' +
      '<section class="abschnitt"><h2 class="t-title2" data-fokus>' + esc(UI.zusammenfassung) + '</h2><p class="t-footnote" style="margin-top:4px">' + esc(UI.zusammenfassungHinweis) + '</p></section>' +
      zusammenfassungHtml() +
      '<section class="abschnitt"><div class="reihe stapel">' +
        (navigator.share ? '<button class="button breit" data-aktion="teilen">' + esc(UI.teilen) + '</button>' : '') +
        '<button class="button ' + (navigator.share ? 'leise ' : '') + 'breit" data-aktion="kopieren">' + esc(UI.kopieren) + '</button>' +
        '<a class="button rand breit" href="' + mailto + '" data-aktion="mail">' + esc(UI.perMail) + '</a></div>' +
        '<p class="t-footnote" style="margin-top:8px">' + esc(UI.perMailHinweis) + '</p>' +
        '<details style="margin-top:8px"><summary>' + esc(UI.textAnzeigen) + '</summary><textarea class="markdown-roh" readonly aria-label="' + esc(UI.textAnzeigen) + '">' + esc(markdown()) + '</textarea></details>' +
      '</section>' +
      '<div class="ende-fuss"><button class="button rot" data-aktion="loeschen">' + esc(UI.loeschen) + '</button>' +
      '<p class="t-footnote">' + esc(fmt(UI.versionLabel, { v: C.version })) + '</p></div>';
    fussZeigen('');
    fokusTitel();
  }

  /* ---------- Rückmeldung ---------- */
  var toastTimer;
  function toast(text) {
    var t = $('#toast'); t.textContent = text; t.setAttribute('data-offen', '');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.removeAttribute('data-offen'); }, 2200);
  }
  function kopieren() {
    var text = markdown();
    var fallback = function () {
      var ta = $('.markdown-roh');
      try { if (ta) { ta.parentElement.open = true; ta.focus(); ta.select(); if (document.execCommand('copy')) { toast(UI.kopiert); return; } } } catch (e) { /* weiter zum Hinweis */ }
      toast(UI.kopierenFehler);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast(UI.kopiert); }, fallback);
    else fallback();
  }
  function teilen() {
    navigator.share({ title: C.titel, text: markdown() }).catch(function () { /* abgebrochen: nichts tun */ });
  }

  /* ---------- Navigation ---------- */
  function gehe(pos) {
    var liste = sichtbar();
    Z.position = pos; ansicht = 'frage'; Z.fertig = false; /* wer wieder auf einer Frage steht, ist nicht mehr „fertig" */
    if (pos > erreichtIndex()) Z.erreicht = liste[pos].id;
    if (!Z.begonnen) Z.begonnen = new Date().toISOString();
    speichern(); render();
  }
  function abschliessen() {
    var liste = sichtbar();
    Z.fertig = true; Z.erreicht = liste[liste.length - 1].id; ansicht = 'ende'; speichern(); render();
  }
  function weiter() {
    var liste = sichtbar(), f = liste[Z.position], a = antwort(f);
    if (f.pflicht && !vollstaendig(f, a)) { toast(UI.pflichtFehlt); return; }
    if (istLeer(f, a)) Z.antworten[f.id] = { uebersprungen: true };
    if (Z.position + 1 >= liste.length) return abschliessen();
    gehe(Z.position + 1);
  }
  function ueberspringen() {
    var liste = sichtbar(), f = liste[Z.position];
    if (!istLeer(f, antwort(f))) return weiter(); /* vorhandene Antwort bleibt erhalten */
    Z.antworten[f.id] = { uebersprungen: true };
    if (Z.position + 1 >= liste.length) return abschliessen();
    gehe(Z.position + 1);
  }
  function zurueck() {
    if (ansicht === 'ende') { gehe(sichtbar().length - 1); return; }
    if (Z.position === 0) { ansicht = 'start'; render(); return; }
    gehe(Z.position - 1);
  }
  function neuStarten() {
    if (!confirm(UI.neuStartenFrage)) return;
    Z = leer(); speichern(); gehe(0);
  }
  function loeschen() {
    if (!confirm(UI.loeschenFrage)) return;
    try { localStorage.removeItem(KEY); } catch (e) { /* ignorieren */ }
    Z = leer(); ansicht = 'start'; render(); toast(UI.geloescht);
  }

  /* ---------- Ereignisse: eine Stelle für alle Knöpfe ---------- */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-aktion]'); if (!b) return;
    if (b.getAttribute('aria-disabled') === 'true') { ev.preventDefault(); if (b.dataset.aktion === 'weiter') toast(UI.pflichtFehlt); return; }
    var akt = b.dataset.aktion, f = ansicht === 'frage' ? sichtbar()[Z.position] : null, a = f ? antwort(f) : null;
    switch (akt) {
      case 'los': gehe(0); break;
      case 'weitermachen': gehe(Math.min(Z.position, sichtbar().length - 1)); break;
      case 'ende': ansicht = 'ende'; render(); break;
      case 'neu': neuStarten(); break;
      case 'install-weg': try { localStorage.setItem(KEY_INSTALL_WEG, '1'); } catch (e) { /* ignorieren */ } render(); break;
      case 'zurueck': zurueck(); break;
      case 'weiter': weiter(); break;
      case 'ueberspringen': ueberspringen(); break;
      case 'uebersicht': uebersichtOeffnen(); break;
      case 'springen': $('#dlg-uebersicht').close(); gehe(+b.dataset.index); break;
      case 'dialog-zu': b.closest('dialog').close(); break;

      case 'einfach': setze(f, { wahl: b.dataset.id }); widgetNeu(f); break;
      case 'mehrfach': {
        var wahl = (a.wahl || []).slice(), id = b.dataset.id, i = wahl.indexOf(id);
        var opt = optionen(f).filter(function (o) { return o.id === id; })[0];
        if (i >= 0) wahl.splice(i, 1);
        else {
          if (opt && opt.exklusiv) wahl = [];
          else wahl = wahl.filter(function (w) { var o = optionen(f).filter(function (x) { return x.id === w; })[0]; return !(o && o.exklusiv); });
          if (f.max && wahl.length >= f.max) { toast(fmt(UI.mehrfachMax, { max: f.max })); break; }
          wahl.push(id);
        }
        setze(f, { wahl: wahl }); widgetNeu(f); break;
      }
      case 'rang': {
        var rang = (a.rang || []).slice(), r = rang.indexOf(b.dataset.id);
        if (r >= 0) rang.splice(r, 1); else if (rang.length < f.max) rang.push(b.dataset.id); else break;
        setze(f, { rang: rang }); widgetNeu(f); break;
      }
      case 'gewicht': {
        var werte = Object.assign({}, a.werte || {}); werte[b.dataset.id] = +b.dataset.wert;
        setze(f, { werte: werte }); widgetNeu(f); break;
      }
      case 'vorschau': vorschauOeffnen(b.dataset.id); break;
      case 'vorschau-art': vorschau.art = b.dataset.art; vorschauZeichnen(); skalieren(); $('[data-aktion="vorschau-art"][aria-selected="true"]', $('#dlg-vorschau')).focus(); break;
      case 'stil-waehlen': setze(f, { wahl: b.dataset.id }); $('#dlg-vorschau').close(); widgetNeu(f); break;

      case 'teilen': teilen(); break;
      case 'kopieren': kopieren(); break;
      case 'loeschen': loeschen(); break;
    }
  });

  /* Freitexte: bei jeder Eingabe speichern */
  document.addEventListener('input', function (ev) {
    var el = ev.target; if (!el.dataset || !el.dataset.feld || ansicht !== 'frage') return;
    var f = sichtbar()[Z.position], a = antwort(f);
    if (el.dataset.feld === 'text') setze(f, { text: el.value });
    else if (el.dataset.feld === 'zeile') { var z = (a.zeilen || []).slice(); z[+el.dataset.index] = el.value; setze(f, { zeilen: z }); }
  });

  /* Dialog: Klick auf den Hintergrund schließt */
  $$('dialog').forEach(function (d) {
    d.addEventListener('click', function (ev) { if (ev.target === d) d.close(); });
  });

  render();
})();
