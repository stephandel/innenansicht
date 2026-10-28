/* Feedback-Bogen: eine Seite, Antworten im localStorage, Versand als Text per Mail oder Kopieren. Keine Übertragung im Hintergrund. */
(function () {
  'use strict';
  var F = window.FEEDBACK, UI = F.ui;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (t, w) { return t.replace(/\{(\w+)\}/g, function (_, k) { return w[k] != null ? w[k] : ''; }); };
  var ZAHL = ['Null', 'Eine', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn', 'Elf', 'Zwölf'];
  var zahlwort = function (n) { return ZAHL[n] || String(n); };
  var frage = function (id) { return F.fragen.filter(function (x) { return x.id === id; })[0]; };

  /* ---------- Speicher ---------- */
  var A = {};
  try { A = JSON.parse(localStorage.getItem(F.speicherSchluessel) || '{}') || {}; } catch (e) { A = {}; }
  function speichern() { try { localStorage.setItem(F.speicherSchluessel, JSON.stringify(A)); } catch (e) { /* privater Modus: Antworten bleiben nur in der Sitzung */ } }
  function beantwortet() { return F.fragen.filter(function (f) { var a = A[f.id]; return a != null && String(a).trim() !== ''; }).length; }

  /* ---------- Text für Mail und Kopieren ---------- */
  var MAIL_MAX = 300; // Freitext je Frage im Mail-Link, damit die Adresse kurz bleibt; der Kopiertext ist vollständig
  function text(kurz) {
    var z = [F.mailBetreff + ' (Fassung ' + F.version + ', ' + new Date().toLocaleDateString('de-DE') + ')', ''], gekuerzt = false;
    F.fragen.forEach(function (f, i) {
      var a = A[f.id], w;
      if (a == null || String(a).trim() === '') w = UI.uebersprungen;
      else if (f.typ === 'sterne') w = a + '/5';
      else { w = String(a).trim().replace(/\s+/g, ' '); if (kurz && w.length > MAIL_MAX) { w = w.slice(0, MAIL_MAX) + '…'; gekuerzt = true; } }
      z.push((i + 1) + '. ' + (f.kurz || f.text) + ': ' + w);
    });
    if (gekuerzt) z.push('', fmt(UI.mailGekuerzt, { max: MAIL_MAX }));
    return z.join('\n');
  }
  function mailto() { return 'mailto:' + encodeURIComponent(F.mail) + '?subject=' + encodeURIComponent(F.mailBetreff) + '&body=' + encodeURIComponent(text(true)); }

  /* ---------- Zeichnen ---------- */
  var toastTimer;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('an'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('an'); }, 1800); }

  /* Radiogruppen: nur ein Tab-Stopp je Gruppe (gewählter Knopf, sonst der erste), Pfeiltasten wandern */
  function frageHtml(f, i) {
    var h = '<section class="frage" id="f-' + esc(f.id) + '"><div class="nr">' + (i + 1) + ' von ' + F.fragen.length + '</div>';
    if (f.bild) h += '<figure class="bild"><img src="' + esc(f.bild) + '" alt="" width="390" loading="lazy"><figcaption>' + esc(f.bildText || '') + '</figcaption></figure>';
    if (f.typ === 'sterne') {
      var w = A[f.id] || 0, s = '';
      for (var n = 1; n <= 5; n++) s += '<button type="button" role="radio" tabindex="' + ((w ? w === n : n === 1) ? 0 : -1) + '" aria-checked="' + (w === n) + '" class="' + (n <= w ? 'voll' : '') + '" data-frage="' + esc(f.id) + '" data-wert="' + n + '" aria-label="' + esc(fmt(UI.sternLabel, { n: n })) + '">' + (n <= w ? '★' : '☆') + '</button>';
      h += '<p class="text" id="l-' + esc(f.id) + '">' + esc(f.text) + '</p><div class="sterne" role="radiogroup" aria-labelledby="l-' + esc(f.id) + '">' + s + '</div>' +
        '<div class="sterne-stand" aria-live="polite">' + (w ? esc(fmt(UI.sternLabel, { n: w })) : '') + '</div>';
    } else if (f.typ === 'wahl') {
      h += '<p class="text" id="l-' + esc(f.id) + '">' + esc(f.text) + '</p><div class="wahl" role="radiogroup" aria-labelledby="l-' + esc(f.id) + '">' + f.optionen.map(function (o, k) {
        return '<button type="button" role="radio" tabindex="' + ((A[f.id] ? A[f.id] === o : k === 0) ? 0 : -1) + '" aria-checked="' + (A[f.id] === o) + '" data-frage="' + esc(f.id) + '" data-wert="' + esc(o) + '">' + esc(o) + '</button>';
      }).join('') + '</div>';
    } else {
      h += '<label class="text" for="t-' + esc(f.id) + '">' + esc(f.text) + '</label><textarea id="t-' + esc(f.id) + '" data-frage="' + esc(f.id) + '" placeholder="' + esc(f.platzhalter || '') + '" rows="3">' + esc(A[f.id] || '') + '</textarea>';
    }
    return h + '</section>';
  }

  function render() {
    $('#kopf').innerHTML = '<h1>' + esc(F.titel) + '</h1><p class="sub">' + esc(F.untertitel) + '</p><p class="einleitung">' + esc(fmt(F.begruessung, { n: zahlwort(F.fragen.length) })) + '</p><p class="hinweis">' + esc(F.sterneHinweis) + '</p>';
    $('#inhalt').innerHTML = F.fragen.map(frageHtml).join('') +
      '<div class="schluss"><p class="stand" id="stand"></p>' +
      '<a class="button" id="mail" href="#" data-aktion="mail">' + esc(UI.senden) + '</a><p class="hinweis">' + esc(UI.sendenHinweis) + '</p>' +
      '<button type="button" class="button leise" data-aktion="kopieren">' + esc(UI.kopieren) + '</button>' +
      '<details><summary>' + esc(UI.textAnzeigen) + '</summary><pre id="text"></pre></details>' +
      '<button type="button" class="button leise rot" data-aktion="loeschen">' + esc(UI.loeschen) + '</button>' +
      '<p class="hinweis">' + esc(UI.danke) + '</p></div>' +
      '<p class="fuss">' + esc(fmt(UI.fuss, { v: F.version })) + '</p>';
    stand();
  }
  function stand() {
    $('#stand').textContent = fmt(UI.stand, { beantwortet: beantwortet(), n: F.fragen.length });
    $('#mail').setAttribute('href', mailto());
    $('#text').textContent = text(false);
  }
  /* Nur die Knöpfe der einen Frage anpassen, kein Neuzeichnen: Scrollstelle, Fokus und die Live-Ansage bleiben erhalten */
  function frageNeu(id, fokusWert) {
    var f = frage(id), w = A[f.id];
    var knoepfe = Array.prototype.slice.call(document.querySelectorAll('#f-' + id + ' button[data-wert]')), gewaehlt = false;
    knoepfe.forEach(function (b) {
      var eigen = f.typ === 'sterne' ? Number(b.dataset.wert) : b.dataset.wert, an = w != null && eigen === w;
      b.setAttribute('aria-checked', String(an)); if (an) gewaehlt = true;
      if (f.typ === 'sterne') { var voll = w != null && eigen <= w; b.classList.toggle('voll', voll); b.textContent = voll ? '★' : '☆'; }
    });
    knoepfe.forEach(function (b, k) { b.setAttribute('tabindex', (gewaehlt ? b.getAttribute('aria-checked') === 'true' : k === 0) ? '0' : '-1'); });
    var st = $('#f-' + id + ' .sterne-stand'); if (st) st.textContent = w ? fmt(UI.sternLabel, { n: w }) : '';
    var neu = knoepfe.filter(function (b) { return b.dataset.wert === String(fokusWert); })[0]; if (neu) { try { neu.focus({ preventScroll: true }); } catch (e) { neu.focus(); } }
    stand();
  }
  function waehlen(f, b) {
    var wert = f.typ === 'sterne' ? Number(b.dataset.wert) : b.dataset.wert;
    A[f.id] = (A[f.id] === wert) ? null : wert; // nochmaliges Antippen hebt die Wahl auf
    speichern(); frageNeu(f.id, b.dataset.wert);
  }

  /* ---------- Ereignisse ---------- */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-frage], [data-aktion]'); if (!b) return;
    if (b.dataset.frage) { waehlen(frage(b.dataset.frage), b); return; }
    if (b.dataset.aktion === 'mail') { ev.preventDefault(); window.location.href = mailto(); return; }
    if (b.dataset.aktion === 'kopieren') {
      var t = text(false);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast(UI.kopiert); }, function () { toast(UI.kopierenFehler); $('details').open = true; });
      else { toast(UI.kopierenFehler); $('details').open = true; }
      return;
    }
    if (b.dataset.aktion === 'loeschen') {
      if (!window.confirm(UI.loeschenFrage)) return;
      A = {}; try { localStorage.removeItem(F.speicherSchluessel); } catch (e) { /* ignorieren */ }
      render(); toast(UI.geloescht); window.scrollTo(0, 0);
    }
  });
  /* Pfeiltasten innerhalb einer Gruppe: Fokus bewegen und wählen, wie bei echten Radioknöpfen */
  document.addEventListener('keydown', function (ev) {
    var b = ev.target; if (!(b instanceof HTMLElement) || !b.dataset.frage || b.tagName !== 'BUTTON' || !/^Arrow(Left|Right|Up|Down)$/.test(ev.key)) return;
    var alle = Array.prototype.slice.call(b.parentElement.querySelectorAll('button[data-wert]')), i = alle.indexOf(b); if (i < 0) return;
    ev.preventDefault();
    var ziel = alle[(i + (/Right|Down/.test(ev.key) ? 1 : alle.length - 1)) % alle.length], f = frage(ziel.dataset.frage);
    A[f.id] = f.typ === 'sterne' ? Number(ziel.dataset.wert) : ziel.dataset.wert;
    speichern(); frageNeu(f.id, ziel.dataset.wert);
  });
  document.addEventListener('input', function (ev) {
    var t = ev.target; if (!t.matches('textarea[data-frage]')) return;
    A[t.dataset.frage] = t.value; speichern(); stand();
  });

  render();
})();
