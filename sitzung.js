/* Teil B: der Sechs-Schritte-Ablauf der Wochensitzung.
   Setzt INNENANSICHT.sitzung = { start(), weiter(), render(kopf, inhalt), zusammenfassungHtml(sitzung) } und registriert eigene Aktionen.
   Texte aus INHALTE.sitzung, .dimensionen und .pfade. Position im Entwurf: schritt (1–6) und teilschritt (Bildschirm im Schritt). */
(function () {
  'use strict';
  var A = window.INNENANSICHT, I = window.INHALTE, T = I.sitzung, P = I.pfade, D = I.dimensionen, H = A.hilfe;
  var esc = H.esc, fmt = H.fmt;
  var SCHRITTE = T.schritte.length;
  var KOPF = null, INHALT = null, speicherTimer = null;

  /* Zustand immer frisch holen: nach dem Einlesen einer Sicherung ist es ein anderes Objekt */
  function Z() { return A.zustand(); }
  function E() { return Z().entwurf; }
  function jetzt() { return new Date().toISOString(); }
  function leer(t) { return !(t && String(t).trim()); }
  function letzte() { var s = Z().sitzungen; return s.length ? s[s.length - 1] : null; }
  function anteil(id) { return Z().anteile.filter(function (a) { return a.id === id; })[0] || null; }
  function person(id) { return Z().personen.filter(function (p) { return p.id === id; })[0] || null; }
  function dimension(id) { return D.filter(function (d) { return d.id === id; })[0] || null; }

  /* Eingaben stehen sofort im Entwurf; in den Speicher gehen sie nach kurzer Pause oder beim Weitergehen */
  function speichernBald() { clearTimeout(speicherTimer); speicherTimer = setTimeout(A.speichern, 300); }
  function sofortSpeichern() { clearTimeout(speicherTimer); A.speichern(); }
  window.addEventListener('pagehide', function () { if (speicherTimer) sofortSpeichern(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && speicherTimer) sofortSpeichern(); });

  function tagesAbstand(von, bis) {
    var a = new Date(von), b = new Date(bis); if (isNaN(a) || isNaN(b)) return null;
    a.setHours(0, 0, 0, 0); b.setHours(0, 0, 0, 0);
    return Math.round((b - a) / 86400000);
  }
  function pauseTage(e) { var l = letzte(); return l && l.beendet ? tagesAbstand(l.beendet, e.begonnen) : null; }
  function istZahl(v) { return typeof v === 'number' && !isNaN(v); }
  function wert(e, id) { var w = e.werte && e.werte[id]; return w && istZahl(w.wert) ? w.wert : null; }
  function zuletzt(id) { var l = letzte(); return l ? wert(l, id) : null; }
  /* Gleiche Regel wie in app.js */
  function sicherungFaellig() {
    var z = Z(), zu = z.sicherung && z.sicherung.zuletzt;
    if (!zu) return z.sitzungen.length >= 4;
    return H.tageSeit(zu) >= 30;
  }

  /* ---------- Nachfrage-Pfad: Veränderung hat Vorrang vor dem Wert ---------- */
  function pfadFuer(e, id) {
    var w = wert(e, id), z = zuletzt(id), namen = Object.keys(P);
    if (w == null) return null;
    if (z != null) {
      var diff = w - z;
      for (var i = 0; i < namen.length; i++) {
        var b = P[namen[i]].bedingung || {};
        if (b.veraenderungAb != null && diff >= b.veraenderungAb) return namen[i];
        if (b.veraenderungBis != null && diff <= b.veraenderungBis) return namen[i];
      }
    }
    for (var j = 0; j < namen.length; j++) {
      var c = P[namen[j]].bedingung || {};
      if (c.wertVon != null && w >= c.wertVon && w <= c.wertBis) return namen[j];
    }
    return null;
  }
  /* Vorauswahl: größte Veränderung zur letzten Sitzung, sonst niedrigster Wert */
  function vorauswahl(e) {
    var mit = D.filter(function (d) { return wert(e, d.id) != null; });
    if (!mit.length) return null;
    var best = null, bestDiff = 0;
    mit.forEach(function (d) {
      var z = zuletzt(d.id); if (z == null) return;
      var diff = Math.abs(wert(e, d.id) - z);
      if (diff > bestDiff) { best = d; bestDiff = diff; }
    });
    if (best) return best.id;
    return mit.reduce(function (m, d) { return wert(e, d.id) < wert(e, m.id) ? d : m; }).id;
  }
  function vertiefen(e, id) {
    e.vertieft = id ? { dimension: id, pfad: pfadFuer(e, id), antworten: ['', ''] } : null;
  }

  /* ---------- Bildschirme je Schritt (hängen vom Entwurf ab) ---------- */
  function ligaFrage(e) { var l = Z().klarheit.liga; return !l || leer(l.text) || (l.geaendert && l.geaendert >= e.begonnen); }
  function bildschirme(e, s) {
    var b = [], l = letzte();
    if (s === 1) {
      var p = pauseTage(e);
      if (p != null && p > T.rueckkehrAb) b.push({ typ: 'rueckkehr', tage: p });
      if (l && !leer(l.vorhaben)) b.push({ typ: 'vorhabenRueckblick', text: String(l.vorhaben).trim() });
      if (e.nummer % T.rueckblickAlle === 0) b.push({ typ: 'rueckblick' });
      b.push({ typ: 'thema' });
    } else if (s === 2) {
      D.forEach(function (d) { b.push({ typ: 'dimension', dim: d }); });
      if (D.some(function (d) { return wert(e, d.id) != null; })) {
        b.push({ typ: 'auswahl' });
        if (e.vertieft && e.vertieft.dimension && e.vertieft.pfad) { b.push({ typ: 'pfad', nr: 0 }); b.push({ typ: 'pfad', nr: 1 }); }
      }
    } else if (s === 3) {
      b.push({ typ: 'teamwahl' });
      (e.team || []).forEach(function (t, i) { b.push({ typ: 'anteil', i: i }); });
      b.push({ typ: 'leitung' });
    } else if (s === 4) {
      b.push({ typ: 'aussensicht' });
    } else if (s === 5) {
      b.push({ typ: 'wichtig' });
      if (ligaFrage(e)) b.push({ typ: 'liga' });
      b.push({ typ: 'vorhaben' });
    } else {
      b.push({ typ: 'ressource' }); b.push({ typ: 'abschlusssatz' }); b.push({ typ: 'zusammenfassung' });
    }
    return b;
  }
  function aktuell(e) {
    var liste = bildschirme(e, e.schritt);
    if (!(e.teilschritt >= 0)) e.teilschritt = 0;
    if (e.teilschritt > liste.length - 1) e.teilschritt = liste.length - 1;
    return { liste: liste, b: liste[e.teilschritt] };
  }
  /* Vor dem Zeichnen: Vorauswahl setzen und den Pfad an geänderte Werte anpassen */
  function vorbereiten(e) {
    var b = aktuell(e).b;
    if (b.typ === 'auswahl' && e.vertieft === undefined) { vertiefen(e, vorauswahl(e)); speichernBald(); }
    if ((b.typ === 'auswahl' || b.typ === 'pfad') && e.vertieft && e.vertieft.dimension) {
      var p = pfadFuer(e, e.vertieft.dimension);
      if (p !== e.vertieft.pfad) {
        // Neuer Pfad, neue Fragen: alte Antworten und den Anteil aus dem Abfall-Pfad nicht mitnehmen
        if (e.vertieft.anteilId) abfallAnteil(e, e.vertieft.anteilId);
        e.vertieft.pfad = p; e.vertieft.antworten = ['', '']; speichernBald();
      }
    }
  }

  /* ---------- Bausteine ---------- */
  function feld(name, wert, label, platzhalter, sichtbar) {
    var fid = 'f-' + name.replace(/[^a-z0-9]/gi, '-');
    return '<div class="feld"><label class="' + (sichtbar ? 'feld-label' : 'vh') + '" for="' + fid + '">' + esc(label) + '</label>' +
      '<textarea id="' + fid + '" rows="1" data-sfeld="' + esc(name) + '" placeholder="' + esc(platzhalter || T.platzhalter) + '">' + esc(wert || '') + '</textarea></div>';
  }
  function frage(text, kontext) {
    return (kontext ? '<p class="t-caption sitzung-kontext">' + esc(kontext) + '</p>' : '') + '<h2 class="frage" data-fokus>' + esc(text) + '</h2>';
  }
  function wahlKnopf(aktion, id, gewaehlt, text, neben, rolle, gesperrt, extra) {
    return '<button class="wahl' + (neben != null ? ' zeile' : '') + '" role="' + (rolle || 'radio') + '" aria-checked="' + !!gewaehlt + '"' + (gesperrt ? ' aria-disabled="true"' : '') +
      ' data-aktion="' + aktion + '" data-id="' + esc(id) + '"' + (extra || '') + '><span>' + esc(text) + '</span>' + (neben ? '<span class="nebentext">' + esc(neben) + '</span>' : '') + '</button>';
  }
  function anteileAuswahl() { return Z().anteile.filter(function (a) { return !a.archiviert; }); }

  /* ---------- Die einzelnen Bildschirme ---------- */
  var BILD = {
    rueckkehr: function (e, b) { return frage(fmt(T.rueckkehr, { n: b.tage })) + feld('rueckkehr', e.rueckkehr, T.rueckkehr, null); },

    vorhabenRueckblick: function (e, b) {
      var V = T.vorhaben, r = e.vorhabenRueckblick || {};
      return frage(fmt(V.frage, { text: b.text })) +
        '<div class="wahl-gruppe" role="radiogroup" aria-label="' + esc(fmt(V.frage, { text: b.text })) + '">' +
        V.antworten.map(function (a) { return wahlKnopf('sitzung-status', a.id, r.status === a.id, a.text); }).join('') + '</div>' +
        feld('vorhabenNotiz', r.notiz, V.notiz, V.notiz, true);
    },

    rueckblick: function (e) {
      var R = T.rueckblick, alt = Z().sitzungen.slice(-4), kurve = A.bereiche && A.bereiche.kurve, html;
      if (!alt.length) html = '<p class="t-sub">' + esc(R.leer) + '</p>';
      else if (typeof kurve === 'function') {
        html = D.map(function (d) { return '<figure class="rueckblick-kurve"><figcaption class="t-sub">' + esc(d.name) + '</figcaption>' + kurve(d.id, alt) + '</figure>'; }).join('');
      } else {
        html = '<table class="rueckblick-tabelle"><thead><tr><th scope="col"><span class="vh">' + esc(R.titel) + '</span></th>' +
          alt.map(function (s) { return '<th scope="col">' + esc(fmt(R.spalte, { n: s.nummer })) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          D.map(function (d) {
            return '<tr><th scope="row">' + esc(d.name) + '</th>' + alt.map(function (s) { var w = wert(s, d.id); return '<td>' + (w == null ? '–' : w) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table>';
      }
      return '<p class="t-caption sitzung-kontext">' + esc(R.titel) + '</p><p class="t-sub">' + esc(R.text) + '</p>' +
        '<div class="karte rueckblick">' + html + '</div>' +
        '<h2 class="frage abstand" data-fokus>' + esc(R.frage) + '</h2>' + feld('muster', e.muster, R.frage, null);
    },

    thema: function (e) {
      var w = Z().klarheit.wichtig;
      return frage(T.thema.frage) + feld('thema', e.thema, T.thema.frage, null) +
        (w.length ? '<p class="t-hinweis vorschlaege-titel">' + esc(T.thema.vorschlaege) + '</p><div class="vorschlaege">' +
          w.map(function (x, i) { return '<button class="vorschlag" data-aktion="sitzung-thema-vorschlag" data-i="' + i + '">' + esc(x.text) + '</button>'; }).join('') + '</div>' : '');
    },

    dimension: function (e, b) {
      var d = b.dim, w = wert(e, d.id), z = zuletzt(d.id), liga = Z().klarheit.liga, satz = (e.werte[d.id] || {}).satz, knoepfe = '';
      for (var n = 0; n <= 10; n++) knoepfe += '<button role="radio" aria-checked="' + (w === n) + '" data-aktion="sitzung-wert" data-dim="' + esc(d.id) + '" data-wert="' + n + '">' + n + '</button>';
      return '<p class="t-caption sitzung-kontext">' + esc(d.name) + '</p>' + frage(d.frage) +
        (d.zeigtLiga && liga && !leer(liga.text) ? '<p class="zitat">' + esc(fmt(T.standort.liga, { text: liga.text })) + '</p>' : '') +
        '<div class="skala" role="radiogroup" aria-label="' + esc(d.frage + ' ' + T.standort.skalaLabel) + '">' + knoepfe + '</div>' +
        '<div class="skala-pole" aria-hidden="true"><span>0 ' + esc(d.pole[0]) + '</span><span>10 ' + esc(d.pole[1]) + '</span></div>' +
        (z != null ? '<p class="t-hinweis zuletzt zahlen">' + esc(fmt(T.standort.zuletzt, { n: z })) + '</p>' : '') +
        (d.satzFrage ? feld('satz:' + d.id, satz, d.satzFrage, d.satzFrage, true) : '');
    },

    auswahl: function (e) {
      var U = T.auswahl, gew = e.vertieft && e.vertieft.dimension;
      return frage(U.frage) + '<p class="t-sub">' + esc(U.text) + '</p><div class="wahl-liste" role="radiogroup" aria-label="' + esc(U.frage) + '">' +
        D.filter(function (d) { return wert(e, d.id) != null; }).map(function (d) {
          var z = zuletzt(d.id), neben = fmt(U.wert, { wert: wert(e, d.id) }) + (z != null ? ' · ' + fmt(U.zuletzt, { n: z }) : '');
          return wahlKnopf('sitzung-vertiefen', d.id, gew === d.id, d.name, neben);
        }).join('') + wahlKnopf('sitzung-vertiefen', '', !gew, U.keine, '') + '</div>';
    },

    pfad: function (e, b) {
      var v = e.vertieft, p = P[v.pfad], d = dimension(v.dimension), w = wert(e, v.dimension), z = zuletzt(v.dimension);
      var kontext = fmt(T.nachfrage, { werkzeug: p.werkzeug }) + ' · ' + fmt(z != null ? T.nachfrageKontextZuletzt : T.nachfrageKontext, { dimension: d ? d.name : v.dimension, wert: w, zuletzt: z });
      var html = frage(p.fragen[b.nr], kontext);
      if (b.nr === 1 && p.anteilWaehlen) {
        html += '<div class="wahl-liste" role="radiogroup" aria-label="' + esc(p.fragen[1]) + '">' +
          anteileAuswahl().map(function (a) { return wahlKnopf('sitzung-abfall-anteil', a.id, v.anteilId === a.id, a.name, a.satz || ''); }).join('') + '</div>' +
          '<div class="reihe"><button class="button rand breit" data-aktion="sitzung-anteil-neu" data-zweck="abfall">' + esc(T.team.neu) + '</button></div>';
        return html;
      }
      html += feld('vertieft:' + b.nr, v.antworten[b.nr], p.fragen[b.nr], null);
      if (b.nr === 1 && p.uebernehmen) {
        var drin = uebernommen(e);
        html += '<div class="reihe"><button class="button leise breit" data-aktion="sitzung-ressource-uebernehmen"' + (drin ? ' aria-disabled="true"' : '') + '>' + esc(drin ? T.uebernommen : T.uebernehmen) + '</button></div>';
      }
      return html;
    },

    teamwahl: function (e) {
      var M = T.team, liste = anteileAuswahl(), gewaehlt = (e.team || []).map(function (t) { return t.anteilId; }), voll = gewaehlt.length >= 3;
      var erstesMal = Z().anteile.every(function (a) { return a.erstellt && a.erstellt >= e.begonnen; });
      return frage(M.frage) + (erstesMal ? '<p class="zitat">' + esc(M.erklaerung) + '</p>' : '') +
        (liste.length ? '<p class="t-hinweis">' + esc(M.hinweis) + '</p><div class="wahl-liste" role="group" aria-label="' + esc(M.frage) + '">' +
          liste.map(function (a) { var drin = gewaehlt.indexOf(a.id) >= 0; return wahlKnopf('sitzung-team', a.id, drin, a.name, a.satz || '', 'checkbox', voll && !drin); }).join('') + '</div>'
          : '<p class="t-sub">' + esc(M.keine) + '</p>') +
        '<div class="reihe"><button class="button rand breit" data-aktion="sitzung-anteil-neu" data-zweck="team"' + (voll ? ' aria-disabled="true"' : '') + '>' + esc(M.neu) + '</button></div>';
    },

    anteil: function (e, b) {
      var t = e.team[b.i], a = anteil(t.anteilId), name = a ? a.name : '';
      return '<p class="t-caption sitzung-kontext">' + esc(fmt(T.team.anteilVon, { x: b.i + 1, n: e.team.length })) + '</p>' +
        '<h2 class="frage" data-fokus>' + esc(name) + '</h2>' + (a && !leer(a.satz) ? '<p class="zitat">' + esc(a.satz) + '</p>' : '') +
        feld('sagt:' + b.i, t.sagt, fmt(T.team.sagt, { name: name }), null, true) +
        feld('will:' + b.i, t.will, fmt(T.team.will, { name: name }), null, true);
    },

    leitung: function (e) { return frage(T.team.leitung) + feld('leitung', e.leitung, T.team.leitung, null); },

    aussensicht: function (e) {
      var S = T.aussensicht, as = e.aussensicht || {}, p = as.personId ? person(as.personId) : null;
      var text = p ? fmt(S.frage, { person: p.name }) : S.frageOhne;
      return frage(text) +
        '<p class="feld-label">' + esc(S.person) + '</p><div class="wahl-gruppe" role="radiogroup" aria-label="' + esc(S.person) + '">' +
        Z().personen.map(function (x) { return wahlKnopf('sitzung-person', x.id, as.personId === x.id, x.name); }).join('') +
        '<button class="wahl" data-aktion="sitzung-person-neu">' + esc(S.neu) + '</button></div>' +
        feld('aussensicht', as.text, text, null) +
        '<div class="reihe"><button class="button rand breit" data-aktion="sitzung-aussensicht-ueberspringen">' + esc(S.ueberspringen) + '</button></div>';
    },

    wichtig: function (e) {
      var K = T.klarheit, k = Z().klarheit, voll = k.wichtig.length >= K.maxEintraege;
      var html = frage(K.frage) + (k.wichtig.length ? '' : '<p class="t-sub">' + esc(K.ersteMal) + '</p>');
      if (k.wichtig.length) {
        html += '<ul class="liste karte wichtig-liste">' + k.wichtig.map(function (w) {
          return '<li class="liste-zeile"><span class="text">' + esc(w.text) + '</span>' +
            '<button class="text-knopf klein" data-aktion="sitzung-wichtig-nichtjetzt" data-id="' + esc(w.id) + '" aria-label="' + esc(K.nichtJetzt + ': ' + w.text) + '">' + esc(K.nichtJetzt) + '</button>' +
            '<button class="text-knopf klein leise-rot" data-aktion="sitzung-wichtig-streichen" data-id="' + esc(w.id) + '" aria-label="' + esc(K.streichen + ': ' + w.text) + '">' + esc(K.streichen) + '</button></li>';
        }).join('') + '</ul>';
      }
      html += voll ? '<p class="t-hinweis abstand-oben">' + esc(fmt(K.voll, { n: K.maxEintraege })) + '</p>'
        : '<div class="feld neu-zeile"><label class="vh" for="wichtig-neu">' + esc(K.neuLabel) + '</label><input type="text" id="wichtig-neu" placeholder="' + esc(K.neuPlatzhalter) + '" enterkeyhint="done" autocomplete="off">' +
          '<button class="button" data-aktion="sitzung-wichtig-dazu">' + esc(K.dazu) + '</button></div>';
      if (k.nichtJetzt.length) html += '<p class="t-hinweis abstand-oben">' + esc(fmt(K.nichtJetztAnzahl, { n: k.nichtJetzt.length })) + '</p>';
      if (!ligaFrage(e)) {
        html += '<div class="karte liga-karte"><h3 class="karte-titel">' + esc(K.ligaTitel) + '</h3><p>' + esc(k.liga.text) + '</p>' +
          '<div class="reihe"><button class="button leise" data-aktion="sitzung-liga-aendern">' + esc(K.ligaAendern) + '</button></div></div>';
      }
      return html;
    },

    liga: function () {
      var K = T.klarheit, l = Z().klarheit.liga;
      return '<p class="t-caption sitzung-kontext">' + esc(K.ligaTitel) + '</p>' + frage(K.ligaFrage) + '<p class="t-sub">' + esc(K.ligaText) + '</p>' + feld('liga', l ? l.text : '', K.ligaFrage, null);
    },

    vorhaben: function (e) { var K = T.klarheit; return frage(K.vorhaben) + '<p class="t-sub">' + esc(K.vorhabenText) + '</p>' + feld('vorhaben', e.vorhaben, K.vorhaben, null); },

    ressource: function (e) { var S = T.abschluss; return frage(S.ressource) + '<p class="t-sub">' + esc(S.ressourceText) + '</p>' + feld('ressource', e.ressource, S.ressource, null); },

    abschlusssatz: function (e) { return frage(T.abschluss.satz) + feld('abschlusssatz', e.abschlusssatz, T.abschluss.satz, null); },

    zusammenfassung: function (e) {
      // Eigene Fassung, weil nur sie den Entwurf kennt (Muster, Datum); Teil C nutzt seine im Verlauf
      return frage(T.abschluss.zusammenfassung) + '<p class="t-sub">' + esc(T.abschluss.zusammenfassungText) + '</p>' +
        '<div class="karte">' + zusammenfassungHtml(e) + '</div>';
    }
  };

  /* ---------- Zusammenfassung: schlichte Liste aller gefüllten Felder ---------- */
  function zusammenfassungHtml(s) {
    var L = T.zusammenfassung, zeilen = [];
    var zeile = function (label, html) { zeilen.push('<dt>' + esc(label) + '</dt><dd>' + html + '</dd>'); };
    var absatz = function (t) { return '<p>' + esc(String(t).trim()) + '</p>'; };
    var d = new Date(s.beendet || s.begonnen);
    if (!isNaN(d)) zeile(L.datum, absatz(H.datumLang(d)));
    if (!leer(s.rueckkehr)) zeile(L.rueckkehr, absatz(s.rueckkehr));
    var vr = s.vorhabenRueckblick;
    if (vr && (vr.status || !leer(vr.notiz))) {
      var st = T.vorhaben.antworten.filter(function (a) { return a.id === vr.status; })[0];
      zeile(L.vorhabenRueckblick, (st ? absatz(st.text) : '') + (leer(vr.notiz) ? '' : absatz(vr.notiz)));
    }
    if (!leer(s.muster)) zeile(L.muster, absatz(s.muster));
    if (!leer(s.thema)) zeile(L.thema, absatz(s.thema));
    var werte = D.filter(function (x) { return wert(s, x.id) != null || !leer((s.werte && s.werte[x.id] || {}).satz); });
    if (werte.length) {
      zeile(L.werte, '<ul class="liste">' + werte.map(function (x) {
        var w = wert(s, x.id), satz = s.werte[x.id].satz;
        return '<li class="zf-wert"><span>' + esc(x.name) + '</span> <b class="zahlen">' + (w == null ? '–' : w) + '</b>' + (leer(satz) ? '' : '<br><span class="t-sub">' + esc(satz) + '</span>') + '</li>';
      }).join('') + '</ul>');
    }
    var v = s.vertieft;
    if (v && v.dimension && v.pfad && P[v.pfad]) {
      var p = P[v.pfad], dd = dimension(v.dimension), h = '<p class="t-sub">' + esc((dd ? dd.name : v.dimension) + ' · ' + p.werkzeug) + '</p>';
      (v.antworten || []).forEach(function (a, i) { if (!leer(a)) h += '<p class="zf-frage">' + esc(p.fragen[i]) + '</p>' + absatz(a); });
      zeile(L.vertieft, h);
    }
    var team = (s.team || []).filter(function (t) { return t.anteilId; });
    if (team.length) {
      zeile(L.team, team.map(function (t) {
        var a = anteil(t.anteilId), name = a ? a.name : '';
        return '<p class="zf-frage">' + esc(name) + '</p>' + (leer(t.sagt) ? '' : absatz(t.sagt)) + (leer(t.will) ? '' : '<p class="t-sub">' + esc(fmt(T.team.will, { name: name })) + ' ' + esc(t.will.trim()) + '</p>');
      }).join(''));
    }
    if (!leer(s.leitung)) zeile(L.leitung, absatz(s.leitung));
    var as = s.aussensicht;
    if (as && (!leer(as.text) || as.personId)) { var ps = as.personId ? person(as.personId) : null; zeile(L.aussensicht, (ps ? '<p class="zf-frage">' + esc(ps.name) + '</p>' : '') + (leer(as.text) ? '' : absatz(as.text))); }
    if (!leer(s.vorhaben)) zeile(L.vorhaben, absatz(s.vorhaben));
    if (!leer(s.ressource)) zeile(L.ressource, absatz(s.ressource));
    if (!leer(s.abschlusssatz)) zeile(L.abschlusssatz, absatz(s.abschlusssatz));
    return zeilen.length ? '<dl class="zusammenfassung">' + zeilen.join('') + '</dl>' : '<p class="t-sub">' + esc(L.leer) + '</p>';
  }

  /* ---------- Darstellung ---------- */
  function autoHoehe(el) { el.style.height = 'auto'; el.style.height = (el.scrollHeight + 2) + 'px'; }
  function render(kopf, inhalt) {
    KOPF = kopf; INHALT = inhalt;
    var e = E();
    if (!e) { A.navigiere('start'); return; }
    vorbereiten(e);
    var a = aktuell(e), b = a.b, x = e.schritt, n = a.liste.length;
    var prozent = Math.round(((x - 1) + (e.teilschritt + 1) / n) / SCHRITTE * 100);
    kopf.innerHTML = '<div class="sitzung-kopf"><div class="sitzung-kopf-zeile"><span></span><span class="titel">' + esc(fmt(T.titel, { n: e.nummer })) + '</span>' +
      '<button class="text-knopf" data-aktion="sitzung-schliessen">' + esc(T.schliessen) + '</button></div>' +
      '<div class="sitzung-schritt"><span class="t-hinweis zahlen" id="schritt-label">' + esc(fmt(T.schrittVon, { x: x, n: SCHRITTE }) + ' · ' + T.schritte[x - 1]) + '</span><span class="t-hinweis">' + esc(T.dauer[x - 1] || '') + '</span></div>' +
      '<div class="fortschritt" role="progressbar" aria-valuemin="1" aria-valuemax="' + SCHRITTE + '" aria-valuenow="' + x + '" aria-labelledby="schritt-label"><span style="width:' + prozent + '%"></span></div></div>';
    var erster = x === 1 && e.teilschritt === 0, ende = b.typ === 'zusammenfassung';
    var kopfzeile = x === 1 ? '<p class="t-hinweis datum-zeile">' + esc(fmt(T.datumZeile, { datum: H.datumLang(new Date(e.begonnen)), n: e.nummer })) + '</p>' : '';
    inhalt.innerHTML = '<div class="sitzung" data-bild="' + esc(b.typ) + '">' + kopfzeile + '<section class="sitzung-bild">' + BILD[b.typ](e, b) + '</section>' +
      '<div class="reihe sitzung-nav"><button class="button leise" data-aktion="sitzung-zurueck"' + (erster ? ' aria-disabled="true"' : '') + '>' + esc(T.zurueck) + '</button>' +
      (ende ? '<button class="button" data-aktion="sitzung-abschliessen">' + esc(T.abschluss.abschliessen) + '</button>'
        : '<button class="button" data-aktion="sitzung-weiter">' + esc(T.weiter) + '</button>') + '</div></div>';
    Array.prototype.forEach.call(inhalt.querySelectorAll('textarea[data-sfeld]'), autoHoehe);
  }
  /* Nach einem Tipp im selben Bildschirm: neu zeichnen, ohne Sprung nach oben, Fokus bleibt am Knopf */
  function neuZeichnen() {
    if (!KOPF || !INHALT) return A.render();
    var y = window.scrollY, f = document.activeElement, merk = f && f.dataset ? { a: f.dataset.aktion, id: f.dataset.id } : null;
    render(KOPF, INHALT);
    window.scrollTo(0, y);
    if (merk && merk.a) {
      var sel = '[data-aktion="' + merk.a + '"]' + (merk.id != null ? '[data-id="' + merk.id.replace(/"/g, '') + '"]' : '');
      var el = INHALT.querySelector(sel); if (el) try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
    }
  }

  /* ---------- Ablauf ---------- */
  function neuerEntwurf() {
    var werte = {};
    D.forEach(function (d) { werte[d.id] = { wert: null, satz: '' }; });
    /* vertieft fehlt absichtlich bis zur Auswahl (dann Vorauswahl), danach Objekt oder null */
    return {
      id: H.id(), nummer: Z().sitzungen.length + 1, begonnen: jetzt(), beendet: null, schritt: 1, teilschritt: 0,
      rueckkehr: null, vorhabenRueckblick: null, thema: '', werte: werte, team: [], leitung: '',
      aussensicht: null, vorhaben: null, ressource: null, abschlusssatz: null
    };
  }
  function start() {
    var z = Z();
    if (!z.entwurf) { z.entwurf = neuerEntwurf(); sofortSpeichern(); }
    A.navigiere('sitzung');
  }
  function anliegenNachtragen(t) {
    var a = t && anteil(t.anteilId);
    if (a && leer(a.anliegen) && !leer(t.will)) a.anliegen = t.will.trim();
  }
  function verlassen(e, b) { if (b && b.typ === 'anteil') anliegenNachtragen(e.team[b.i]); }
  function weiter() {
    var e = E(); if (!e) return;
    verlassen(e, aktuell(e).b);
    var liste = bildschirme(e, e.schritt);
    if (e.teilschritt < liste.length - 1) e.teilschritt++;
    else if (e.schritt < SCHRITTE) { e.schritt++; e.teilschritt = 0; }
    sofortSpeichern(); A.render();
  }
  function zurueck() {
    var e = E(); if (!e) return;
    verlassen(e, aktuell(e).b);
    if (e.teilschritt > 0) e.teilschritt--;
    else if (e.schritt > 1) { e.schritt--; e.teilschritt = bildschirme(e, e.schritt).length - 1; }
    sofortSpeichern(); A.render();
  }
  function uebernommen(e) { return Z().ressourcen.some(function (r) { return r.sitzungId === e.id; }); } /* vor dem Abschluss stammt ein solcher Eintrag nur aus der Nachfrage */

  /* Textfelder: Pfad im Entwurf (bzw. Klarheit) */
  function setzeFeld(name, wertText) {
    var e = E(); if (!e) return;
    var teil = name.split(':'), k = teil[0], i = teil[1];
    if (k === 'satz') { e.werte[i] = e.werte[i] || { wert: null, satz: '' }; e.werte[i].satz = wertText; }
    else if (k === 'vertieft') { if (e.vertieft) e.vertieft.antworten[+i] = wertText; }
    else if (k === 'sagt' || k === 'will') { if (e.team[+i]) e.team[+i][k] = wertText; }
    else if (k === 'vorhabenNotiz') { e.vorhabenRueckblick = e.vorhabenRueckblick || { status: null, notiz: '' }; e.vorhabenRueckblick.notiz = wertText; }
    else if (k === 'aussensicht') { e.aussensicht = e.aussensicht || { personId: null, text: '' }; e.aussensicht.text = wertText; }
    else if (k === 'liga') { Z().klarheit.liga = leer(wertText) ? null : { text: wertText.trim(), geaendert: jetzt() }; }
    else e[k] = wertText;
  }
  document.addEventListener('input', function (ev) {
    var el = ev.target; if (!el.dataset || !el.dataset.sfeld) return;
    setzeFeld(el.dataset.sfeld, el.value);
    if (el.tagName === 'TEXTAREA') autoHoehe(el);
    speichernBald();
  });
  /* Enter in einzeiligen Feldern löst die Hauptaktion aus */
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' || ev.isComposing) return;
    var el = ev.target;
    if (el.id === 'wichtig-neu') { ev.preventDefault(); wichtigDazu(); }
    else if (el.closest && el.closest('#dlg') && el.tagName === 'INPUT') { var k = document.querySelector('#dlg [data-standard]'); if (k) { ev.preventDefault(); k.click(); } }
  });

  /* ---------- Klarheit ---------- */
  function wichtigDazu() {
    var f = document.getElementById('wichtig-neu'), k = Z().klarheit;
    if (!f || leer(f.value) || k.wichtig.length >= T.klarheit.maxEintraege) return;
    k.wichtig.push({ id: H.id(), text: f.value.trim(), seit: jetzt() });
    sofortSpeichern(); neuZeichnen();
    var neu = document.getElementById('wichtig-neu'); if (neu) neu.focus();
  }

  /* ---------- Dialoge für neue Anteile und Personen ---------- */
  function anteilDialog(zweck) {
    var N = T.anteilNeu;
    H.dialog('<h2>' + esc(N.titel) + '</h2>' +
      '<div class="feld"><label class="feld-label" for="dlg-name">' + esc(N.name) + '</label><input type="text" id="dlg-name" placeholder="' + esc(N.namePlatzhalter) + '" autocomplete="off" autocapitalize="sentences"></div>' +
      '<div class="feld"><label class="feld-label" for="dlg-satz">' + esc(N.satz) + '</label><input type="text" id="dlg-satz" placeholder="' + esc(N.satzPlatzhalter) + '" autocomplete="off"></div>' +
      '<div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(N.abbrechen) + '</button><button class="button" data-aktion="sitzung-anteil-anlegen" data-zweck="' + esc(zweck) + '" data-standard>' + esc(N.anlegen) + '</button></div>');
    var f = document.getElementById('dlg-name'); if (f) f.focus();
  }
  function abfallAnteil(e, id) {
    var v = e.vertieft; if (!v) return;
    var alt = v.anteilId;
    if (alt) e.team = e.team.filter(function (t) { return t.anteilId !== alt || !leer(t.sagt) || !leer(t.will); });
    if (alt === id) { v.anteilId = null; v.antworten[1] = ''; return; }
    var a = anteil(id);
    v.anteilId = id; v.antworten[1] = a ? a.name : '';
    if (!e.team.some(function (t) { return t.anteilId === id; }) && e.team.length < 3) e.team.push({ anteilId: id, sagt: '', will: '' });
  }

  Object.assign(A.aktionen, {
    'sitzung-weiter': function () { weiter(); },
    'sitzung-zurueck': function () { zurueck(); },
    'sitzung-schliessen': function () { var e = E(); if (e) verlassen(e, aktuell(e).b); sofortSpeichern(); A.navigiere('start'); },
    'sitzung-wert': function (el) {
      var e = E(), id = el.dataset.dim, n = +el.dataset.wert;
      e.werte[id] = e.werte[id] || { wert: null, satz: '' };
      e.werte[id].wert = e.werte[id].wert === n ? null : n;
      sofortSpeichern();
      Array.prototype.forEach.call(el.parentNode.querySelectorAll('button'), function (k) { k.setAttribute('aria-checked', String(+k.dataset.wert === e.werte[id].wert)); });
    },
    'sitzung-status': function (el) {
      var e = E(), r = e.vorhabenRueckblick || { status: null, notiz: '' };
      r.status = r.status === el.dataset.id ? null : el.dataset.id; e.vorhabenRueckblick = r;
      sofortSpeichern();
      Array.prototype.forEach.call(el.parentNode.querySelectorAll('button'), function (k) { k.setAttribute('aria-checked', String(k.dataset.id === r.status)); });
    },
    'sitzung-thema-vorschlag': function (el) {
      var w = Z().klarheit.wichtig[+el.dataset.i]; if (!w) return;
      E().thema = w.text; sofortSpeichern();
      var f = document.querySelector('[data-sfeld="thema"]'); if (f) { f.value = w.text; autoHoehe(f); }
    },
    'sitzung-vertiefen': function (el) {
      var e = E(), id = el.dataset.id || null;
      if (!(e.vertieft && e.vertieft.dimension === id && id)) vertiefen(e, id);
      sofortSpeichern(); neuZeichnen();
    },
    'sitzung-ressource-uebernehmen': function () {
      var e = E(), v = e.vertieft; if (!v || uebernommen(e)) return;
      var text = !leer(v.antworten[1]) ? v.antworten[1] : v.antworten[0];
      if (leer(text)) { H.toast(T.uebernehmenLeer); return; }
      Z().ressourcen.push({ id: H.id(), text: String(text).trim(), datum: jetzt(), sitzungId: e.id });
      sofortSpeichern(); neuZeichnen(); H.toast(T.uebernehmenToast);
    },
    'sitzung-abfall-anteil': function (el) { abfallAnteil(E(), el.dataset.id); sofortSpeichern(); neuZeichnen(); },
    'sitzung-anteil-neu': function (el) { anteilDialog(el.dataset.zweck); },
    'sitzung-anteil-anlegen': function (el) {
      var n = document.getElementById('dlg-name'), s = document.getElementById('dlg-satz');
      if (!n || leer(n.value)) { H.toast(T.anteilNeu.nameFehlt); if (n) n.focus(); return; }
      var a = { id: H.id(), name: n.value.trim(), satz: s ? s.value.trim() : '', anliegen: '', erstellt: jetzt(), archiviert: false };
      var z = Z(), e = E(); z.anteile.push(a);
      if (el.dataset.zweck === 'abfall') abfallAnteil(e, a.id);
      else if (e.team.length < 3) e.team.push({ anteilId: a.id, sagt: '', will: '' });
      sofortSpeichern(); H.dialogZu(); neuZeichnen();
    },
    'sitzung-team': function (el) {
      var e = E(), id = el.dataset.id, i = e.team.map(function (t) { return t.anteilId; }).indexOf(id);
      if (i >= 0) e.team.splice(i, 1); else if (e.team.length < 3) e.team.push({ anteilId: id, sagt: '', will: '' });
      sofortSpeichern(); neuZeichnen();
    },
    'sitzung-person': function (el) {
      var e = E(); e.aussensicht = e.aussensicht || { personId: null, text: '' };
      e.aussensicht.personId = e.aussensicht.personId === el.dataset.id ? null : el.dataset.id;
      sofortSpeichern(); neuZeichnen();
    },
    'sitzung-person-neu': function () {
      var S = T.aussensicht;
      H.dialog('<h2>' + esc(S.neuTitel) + '</h2><div class="feld"><label class="feld-label" for="dlg-person">' + esc(S.neuLabel) + '</label>' +
        '<input type="text" id="dlg-person" placeholder="' + esc(S.neuPlatzhalter) + '" autocomplete="off"></div><p class="t-hinweis" style="margin-top:8px">' + esc(S.neuHinweis) + '</p>' +
        '<div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(T.anteilNeu.abbrechen) + '</button><button class="button" data-aktion="sitzung-person-anlegen" data-standard>' + esc(S.uebernehmen) + '</button></div>');
      var f = document.getElementById('dlg-person'); if (f) f.focus();
    },
    'sitzung-person-anlegen': function () {
      var f = document.getElementById('dlg-person');
      if (!f || leer(f.value)) { H.toast(T.aussensicht.nameFehlt); if (f) f.focus(); return; }
      var p = { id: H.id(), name: f.value.trim() }, e = E();
      Z().personen.push(p);
      e.aussensicht = e.aussensicht || { personId: null, text: '' }; e.aussensicht.personId = p.id;
      sofortSpeichern(); H.dialogZu(); neuZeichnen();
    },
    'sitzung-aussensicht-ueberspringen': function () {
      var e = E(); e.aussensicht = null; e.schritt = 5; e.teilschritt = 0; sofortSpeichern(); A.render();
    },
    'sitzung-wichtig-dazu': function () { wichtigDazu(); },
    'sitzung-wichtig-nichtjetzt': function (el) {
      var k = Z().klarheit, i = k.wichtig.map(function (w) { return w.id; }).indexOf(el.dataset.id); if (i < 0) return;
      k.nichtJetzt.push(k.wichtig.splice(i, 1)[0]); sofortSpeichern(); neuZeichnen();
    },
    'sitzung-wichtig-streichen': function (el) {
      var k = Z().klarheit; k.wichtig = k.wichtig.filter(function (w) { return w.id !== el.dataset.id; }); sofortSpeichern(); neuZeichnen();
    },
    'sitzung-liga-aendern': function () {
      var K = T.klarheit, l = Z().klarheit.liga;
      H.dialog('<h2>' + esc(K.ligaTitel) + '</h2><div class="feld"><label class="feld-label" for="dlg-liga">' + esc(K.ligaFrage) + '</label>' +
        '<textarea id="dlg-liga" rows="2">' + esc(l ? l.text : '') + '</textarea></div>' +
        '<div class="reihe"><button class="button leise" data-aktion="dialog-zu">' + esc(T.anteilNeu.abbrechen) + '</button><button class="button" data-aktion="sitzung-liga-speichern">' + esc(K.ligaSpeichern) + '</button></div>');
    },
    'sitzung-liga-speichern': function () {
      var f = document.getElementById('dlg-liga'); if (!f) return;
      Z().klarheit.liga = leer(f.value) ? null : { text: f.value.trim(), geaendert: jetzt() };
      sofortSpeichern(); H.dialogZu(); neuZeichnen();
    },
    'sitzung-abschliessen': function () {
      var z = Z(), e = z.entwurf; if (!e) return;
      clearTimeout(speicherTimer);
      (e.team || []).forEach(anliegenNachtragen);
      var t = jetzt();
      if (!leer(e.ressource)) z.ressourcen.push({ id: H.id(), text: e.ressource.trim(), datum: t, sitzungId: e.id });
      if (!leer(e.muster)) z.muster.push({ id: H.id(), text: e.muster.trim(), datum: t, sitzungId: e.id });
      delete e.muster; delete e.teilschritt;
      if (e.vertieft === undefined || (e.vertieft && !e.vertieft.dimension)) e.vertieft = null;
      ['rueckkehr', 'vorhaben', 'ressource', 'abschlusssatz'].forEach(function (k) { e[k] = leer(e[k]) ? null : String(e[k]).trim(); });
      e.thema = (e.thema || '').trim(); e.leitung = (e.leitung || '').trim();
      if (e.aussensicht && !e.aussensicht.personId && leer(e.aussensicht.text)) e.aussensicht = null;
      if (e.vorhabenRueckblick && !e.vorhabenRueckblick.status && leer(e.vorhabenRueckblick.notiz)) e.vorhabenRueckblick = null;
      e.team = (e.team || []).filter(function (x) { return x.anteilId; });
      e.schritt = SCHRITTE; e.beendet = t;
      z.sitzungen.push(e); z.entwurf = null;
      A.speichern();
      var faellig = sicherungFaellig();
      KOPF = INHALT = null;
      A.navigiere('start');
      if (faellig) {
        var S = T.abschluss;
        H.dialog('<h2>' + esc(S.gespeichert) + '</h2><p>' + esc(S.sicherungText) + '</p>' +
          '<div class="reihe stapel"><button class="button breit" data-aktion="sitzung-sicherung-jetzt">' + esc(S.sicherungJetzt) + '</button>' +
          '<button class="button leise breit" data-aktion="sitzung-sicherung-spaeter">' + esc(S.spaeter) + '</button></div>');
      } else H.toast(T.abschluss.gespeichert);
    },
    'sitzung-sicherung-jetzt': function () { H.dialogZu(); A.navigiere('einstellungen'); H.toast(T.abschluss.gespeichert); },
    'sitzung-sicherung-spaeter': function () { H.dialogZu(); H.toast(T.abschluss.gespeichert); }
  });

  A.sitzung = { start: start, weiter: weiter, render: render, zusammenfassungHtml: zusammenfassungHtml };
})();
