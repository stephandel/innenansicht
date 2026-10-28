/* Innenansicht: Laden, Speichern, Sicherung, Einlesen, Strukturprüfung.
   Ein Schlüssel im localStorage, Datenmodell nach KONZEPT.md Abschnitt 6. */
window.SPEICHER = (function () {
  'use strict';
  var SCHLUESSEL = 'innenansicht-v1';
  var VERSION = 1;

  function jetzt() { return new Date().toISOString(); }

  /* Kurze Zufallskette als Kennung für Einträge */
  function id() {
    var z = '', a = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 8; i++) z += a[Math.floor(Math.random() * a.length)];
    return z;
  }

  /* Startzustand: noch keine Sitzung, Erststart nicht gesehen */
  function leer() {
    var t = jetzt();
    return {
      version: VERSION,
      erstellt: t, geaendert: t,
      einstieg: { gesehen: false },
      einstellungen: { name: '', stil: 'klar', profil: 'navy', profilDunkel: 'navy', grund: 'stil', grundDunkel: 'stil', erscheinung: 'auto' },
      sicherung: { zuletzt: null },
      klarheit: { wichtig: [], nichtJetzt: [], liga: null },
      anteile: [], personen: [], ressourcen: [], muster: [],
      sitzungen: [],
      entwurf: null
    };
  }

  /* Strukturprüfung: Fehlertext oder null. Prüft nur, was die App zum Laufen braucht. */
  function pruefen(o) {
    var istObj = function (x) { return x && typeof x === 'object' && !Array.isArray(x); };
    if (!istObj(o)) return 'Kein gültiger Datensatz.';
    if (o.version !== VERSION) return 'Unbekannte Fassung der Daten (' + o.version + ').';
    if (!istObj(o.einstieg) || !istObj(o.sicherung)) return 'Abschnitte „einstieg“ oder „sicherung“ fehlen.';
    if (!istObj(o.einstellungen)) return 'Abschnitt „einstellungen“ fehlt.';
    if (!istObj(o.klarheit) || !Array.isArray(o.klarheit.wichtig) || !Array.isArray(o.klarheit.nichtJetzt)) return 'Abschnitt „klarheit“ ist unvollständig.';
    var listen = ['anteile', 'personen', 'ressourcen', 'muster', 'sitzungen'];
    for (var i = 0; i < listen.length; i++) if (!Array.isArray(o[listen[i]])) return 'Liste „' + listen[i] + '“ fehlt.';
    if (o.entwurf != null && !istObj(o.entwurf)) return 'Abschnitt „entwurf“ ist ungültig.';
    for (var j = 0; j < o.sitzungen.length; j++) if (!istObj(o.sitzungen[j]) || !o.sitzungen[j].id) return 'Sitzung ' + (j + 1) + ' ist ungültig.';
    return null;
  }

  /* Lesen: { zustand } bei gültigem Stand, { zustand: null } ohne Stand, { fehler, roh } bei ungültigem Stand */
  function laden() {
    var roh = null;
    try { roh = localStorage.getItem(SCHLUESSEL); } catch (e) { return { zustand: null, fehler: null, roh: null }; }
    if (!roh) return { zustand: null, fehler: null, roh: null };
    var o;
    try { o = JSON.parse(roh); } catch (e) { return { zustand: null, fehler: 'Die gespeicherten Daten lassen sich nicht lesen.', roh: roh }; }
    var f = pruefen(o);
    if (f) return { zustand: null, fehler: f, roh: roh };
    return { zustand: ergaenzen(o), fehler: null, roh: roh };
  }

  /* Fehlende Felder aus dem Startzustand nachtragen (Einstellungen auch in der Tiefe) */
  function ergaenzen(o) {
    var z = Object.assign(leer(), o);
    z.einstellungen = Object.assign(leer().einstellungen, o.einstellungen || {});
    // Stände vor dem 28.10.2026 kennen nur eine Farbe: sie gilt dann für hell und dunkel
    if (o.einstellungen && o.einstellungen.profil && !o.einstellungen.profilDunkel) z.einstellungen.profilDunkel = o.einstellungen.profil;
    return z;
  }

  function speichern(zustand) {
    zustand.geaendert = jetzt();
    try { localStorage.setItem(SCHLUESSEL, JSON.stringify(zustand)); return true; } catch (e) { return false; }
  }

  /* Sicherungsdatei: derselbe Inhalt mit Zeitstempel des Exports */
  function exportText(zustand) {
    var t = jetzt(); // die Datei selbst gilt als Sicherung, auch nach dem Einlesen auf einem anderen Gerät
    return JSON.stringify(Object.assign({}, zustand, { sicherung: Object.assign({}, zustand.sicherung, { zuletzt: t }), exportiert: t }), null, 2);
  }

  /* Einlesen: { zustand, exportiert } oder { fehler }. Der Zeitstempel des Exports gehört nicht in den Zustand, nur in die Vorschau. */
  function importieren(text) {
    var o;
    try { o = JSON.parse(text); } catch (e) { return { fehler: 'Die Datei enthält kein lesbares JSON.' }; }
    var f = pruefen(o);
    if (f) return { fehler: f };
    var z = ergaenzen(o);
    delete z.exportiert;
    return { zustand: z, exportiert: o.exportiert || null };
  }

  function alleLoeschen() {
    try { localStorage.removeItem(SCHLUESSEL); } catch (e) { /* ignorieren */ }
  }

  return { SCHLUESSEL: SCHLUESSEL, VERSION: VERSION, id: id, leer: leer, pruefen: pruefen, laden: laden, speichern: speichern, exportText: exportText, importieren: importieren, alleLoeschen: alleLoeschen };
})();
