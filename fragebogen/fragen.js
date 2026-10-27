/* Alle Fragen des Klärungs-Fragebogens. Quelle: BRIEFING-FRAGEBOGEN.md, Fassung 2.

   So ändert man etwas:
   - Fragetext: Feld "frage". Ein Satz Kontext: Feld "kontext" (darf fehlen).
   - Antworten: Liste "optionen", je Eintrag eine "id" (kurz, ohne Leerzeichen) und ein "text".
   - "typ" legt die Antwortart fest:
       einfach     eine Antwort
       mehrfach    mehrere Antworten, optional "max"
       gewichtung  je Option eine von fünf Stufen (0, 25, 50, 75, 100 %)
       rangfolge   die wichtigsten "max" Optionen in Reihenfolge antippen
       freitext    freie Eingabe, "zeilen" = Anzahl der Eingabefelder
       stil        Stilgalerie (Mockups aus mockups/mockups.js)
   - "kurz" ist die Kurzform einer Antwort für die gekürzte Mail-Fassung (fehlt sie, wird "text" genommen).
   - "ergaenzung: true" blendet ein optionales Freitextfeld „Ergänzung" ein.
   - "pflicht: true" verlangt eine Antwort (nur F1.1).
   - "sichtbar" ist eine Funktion, die anhand der bisherigen Antworten entscheidet,
     ob die Frage gezeigt wird. Fehlt sie, ist die Frage immer sichtbar. */
window.FRAGEBOGEN = {
  teile: [
    { nr: 1, titel: 'Szenarien und Weiche' },
    { nr: 2, titel: 'Zweck und Nutzen' },
    { nr: 3, titel: 'Methode und Inhalt' },
    { nr: 4, titel: 'Rhythmus und Daten' },
    { nr: 5, titel: 'Rahmen' },
    { nr: 6, titel: 'Stilrichtung' }
  ],

  fragen: [
    /* ---------- Teil 1: Szenarien und Weiche ---------- */
    {
      id: 'F1.1', teil: 1, typ: 'gewichtung', pflicht: true, ergaenzung: true,
      titel: 'Szenarien gewichten',
      frage: 'Wie stark spricht dich jede dieser Richtungen an?',
      kontext: 'Mehrere Richtungen können gleichzeitig stimmen. Gib an, wie stark dich jede anspricht.',
      stufen: [0, 25, 50, 75, 100],
      optionen: [
        { id: 'A', text: 'Private Begleiterin für mich selbst, gerade in Phasen mit Umbrüchen' },
        { id: 'B', text: 'Grundstein für eine eigene Coaching-Praxis oder ein eigenes Profil' },
        { id: 'C', text: 'Werkzeug, das ich in meiner heutigen Arbeit (Mandate, Teams) einsetzen könnte' },
        { id: 'D', text: 'Noch offen, ich will erst mal sehen, was entsteht' }
      ]
    },
    {
      id: 'F1.2', teil: 1, typ: 'einfach',
      titel: 'Zeitachse',
      frage: 'Wann soll die App für dich am meisten Wert haben?',
      optionen: [
        { id: 'jetzt', text: 'Jetzt, im laufenden Alltag', kurz: 'Jetzt' },
        { id: 'veraenderung', text: 'In einer Phase beruflicher Veränderung, falls sie kommt', kurz: 'In beruflicher Veränderung' },
        { id: 'danach', text: 'Danach, beim Neuaufbau', kurz: 'Danach, beim Neuaufbau' },
        { id: 'durchgehend', text: 'Durchgehend, unabhängig von Phasen', kurz: 'Durchgehend' }
      ]
    },
    {
      id: 'F1.3', teil: 1, typ: 'einfach', ergaenzung: true,
      titel: 'Eine App oder zwei?',
      frage: 'Eine App oder zwei?',
      kontext: 'Vorschlag von Stephan: zuerst eine rein private Version nur für dich, ohne jede Berührung mit dem Arbeitgeber. Daraus kann später eine Version für Coachees entstehen.',
      optionen: [
        { id: 'privat', text: 'Nur privat, nichts anderes geplant', kurz: 'Nur privat' },
        { id: 'erst-privat', text: 'Erst privat, später eine zweite App für Coachees', kurz: 'Erst privat, später Coachees', hinweis: 'Empfehlung' },
        { id: 'beides', text: 'Von Anfang an eine App für mich und für andere', kurz: 'Von Anfang an beides' },
        { id: 'coachees', text: 'Erst mal nur die Version für Coachees', kurz: 'Nur Coachees' }
      ]
    },

    /* ---------- Teil 2: Zweck und Nutzen ---------- */
    {
      id: 'F2.1', teil: 2, typ: 'rangfolge', max: 3, ergaenzung: true,
      titel: 'Was heißt „managen" für dich?',
      frage: 'Was heißt „die Beziehung zu sich selbst managen" für dich konkret?',
      kontext: 'Wähle die drei wichtigsten Bedeutungen in deiner Reihenfolge.',
      optionen: [
        { id: 'klarheit', text: 'Klarheit: wissen, was mir gerade wichtig ist und was nicht', kurz: 'Klarheit' },
        { id: 'vereinbarungen', text: 'Vereinbarungen: mit mir selbst Abmachungen treffen und einhalten', kurz: 'Vereinbarungen' },
        { id: 'inneres-team', text: 'Inneres Team: verschiedene Anteile und Rollen in mir ordnen', kurz: 'Inneres Team' },
        { id: 'selbstmitgefuehl', text: 'Selbstmitgefühl: freundlicher mit mir umgehen, wenn es hakt', kurz: 'Selbstmitgefühl' },
        { id: 'standort', text: 'Standortbestimmung: regelmäßig prüfen, wo ich stehe', kurz: 'Standortbestimmung' },
        { id: 'umsetzung', text: 'Umsetzung: ins Handeln kommen statt nur reflektieren', kurz: 'Umsetzung' }
      ]
    },
    {
      id: 'F2.2', teil: 2, typ: 'einfach', ergaenzung: true,
      titel: 'Woran merkst du, dass es wirkt?',
      frage: 'Woran merkst du nach drei Monaten, dass es wirkt?',
      optionen: [
        { id: 'entscheidungen', text: 'Ich treffe Entscheidungen schneller und bereue sie seltener', kurz: 'Schnellere Entscheidungen' },
        { id: 'freundlicher', text: 'Ich bin freundlicher mit mir, wenn etwas schiefgeht', kurz: 'Freundlicher mit mir' },
        { id: 'muster', text: 'Ich sehe Muster, die mir vorher nicht bewusst waren', kurz: 'Muster erkennen' },
        { id: 'eingehalten', text: 'Ich habe Vereinbarungen mit mir eingehalten', kurz: 'Vereinbarungen eingehalten' },
        { id: 'kein-satz', text: 'Lässt sich für mich nicht in einem Satz fassen', kurz: 'Nicht in einem Satz' }
      ]
    },
    {
      id: 'F2.3', teil: 2, typ: 'einfach',
      titel: 'Für Coachees',
      frage: 'Was wäre die Rolle der App zwischen deinen Sitzungen?',
      kontext: 'Diese Frage erscheint, weil du bei „Eine App oder zwei?" nicht „Nur privat" gewählt hast.',
      /* Verzweigung: nur zeigen, wenn F1.3 nicht „Nur privat" ist */
      sichtbar: function (antworten) {
        var a = antworten['F1.3'];
        return !(a && a.wahl === 'privat');
      },
      optionen: [
        { id: 'hausaufgaben', text: 'Hausaufgaben und Reflexion zwischen Terminen', kurz: 'Hausaufgaben und Reflexion' },
        { id: 'eigenstaendig', text: 'Eigenständiges Werkzeug, Coaching optional', kurz: 'Eigenständiges Werkzeug' },
        { id: 'vorbereitung', text: 'Vorbereitung auf die nächste Sitzung', kurz: 'Vorbereitung der Sitzung' },
        { id: 'unklar', text: 'Noch unklar', kurz: 'Noch unklar' }
      ]
    },

    /* ---------- Teil 3: Methode und Inhalt ---------- */
    {
      id: 'F3.1', teil: 3, typ: 'freitext', zeilen: 3,
      titel: 'Deine Kernfragen',
      frage: 'Welche drei Fragen stellst du in Coachings so oft, dass sie in die App gehören?',
      kontext: 'Stichworte reichen. Diese Fragen werden der Kern der App.',
      platzhalter: ['Erste Frage …', 'Zweite Frage …', 'Dritte Frage …']
    },
    {
      id: 'F3.2', teil: 3, typ: 'mehrfach', max: 5, ergaenzung: true,
      titel: 'Werkzeuge',
      frage: 'Welche systemischen Formate funktionieren deiner Erfahrung nach auch ohne Gegenüber?',
      optionen: [
        { id: 'skalierung', text: 'Skalierungsfragen (0–10 mit Verlauf)', kurz: 'Skalierungsfragen' },
        { id: 'ausnahme', text: 'Ausnahmefragen (Wann war es anders?)', kurz: 'Ausnahmefragen' },
        { id: 'zirkulaer', text: 'Zirkuläre Fragen (Wie würde X es sehen?)', kurz: 'Zirkuläre Fragen' },
        { id: 'wunder', text: 'Wunderfrage / Zielbild', kurz: 'Wunderfrage' },
        { id: 'reframing', text: 'Reframing-Impulse', kurz: 'Reframing' },
        { id: 'inneres-team', text: 'Inneres Team / Anteile-Arbeit', kurz: 'Inneres Team' },
        { id: 'auftrag', text: 'Auftragsklärung mit sich selbst', kurz: 'Auftragsklärung' },
        { id: 'ressourcen', text: 'Ressourcen-Inventur', kurz: 'Ressourcen-Inventur' }
      ]
    },
    {
      id: 'F3.3', teil: 3, typ: 'mehrfach',
      titel: 'Über das Systemische hinaus?',
      frage: 'Soll die App über das Systemische hinausgehen?',
      optionen: [
        { id: 'selbstmitgefuehl', text: 'Selbstmitgefühl (Neff, Gilbert)', kurz: 'Selbstmitgefühl' },
        { id: 'act', text: 'Werteklärung und Commitment (ACT)', kurz: 'ACT' },
        { id: 'gewohnheiten', text: 'Gewohnheits- und Umsetzungsplanung', kurz: 'Gewohnheitsplanung' },
        { id: 'nein', text: 'Nein, rein systemisch bleiben', kurz: 'Nein, rein systemisch', exklusiv: true }
      ]
    },
    {
      id: 'F3.4', teil: 3, typ: 'einfach', ergaenzung: true,
      titel: 'Rolle der KI',
      frage: 'Welche Rolle soll KI in der App haben?',
      optionen: [
        { id: 'keine', text: 'Keine KI, feste Fragenpfade reichen', kurz: 'Keine KI' },
        { id: 'zusammenfassen', text: 'KI nur zum Zusammenfassen meiner Einträge', kurz: 'KI nur zum Zusammenfassen' },
        { id: 'nachfragen', text: 'KI stellt Nachfragen wie ein Coach, mit klaren Grenzen', kurz: 'KI mit Nachfragen' },
        { id: 'offen', text: 'Offen, Stephan soll vorschlagen', kurz: 'Offen' }
      ]
    },
    {
      id: 'F3.5', teil: 3, typ: 'mehrfach', ergaenzung: true,
      titel: 'Was darf die App auf keinen Fall tun?',
      frage: 'Was darf die App auf keinen Fall tun?',
      optionen: [
        { id: 'diagnosen', text: 'Diagnosen stellen oder Aussagen machen, die einer Behandlung gleichen', kurz: 'Keine Diagnosen' },
        { id: 'push', text: 'Push-Nachrichten mit Druck', kurz: 'Kein Push mit Druck' },
        { id: 'streaks', text: 'Streaks und Spielmechaniken', kurz: 'Keine Streaks' },
        { id: 'cloud', text: 'Daten in eine Cloud schicken', kurz: 'Keine Cloud' },
        { id: 'bewerten', text: 'Mich bewerten oder vergleichen', kurz: 'Kein Bewerten' }
      ]
    },

    /* ---------- Teil 4: Rhythmus und Daten ---------- */
    {
      id: 'F4.1', teil: 4, typ: 'einfach',
      titel: 'Rhythmus',
      frage: 'Welcher Rhythmus passt zu dir?',
      optionen: [
        { id: 'woche', text: 'Eine tiefere Sitzung pro Woche (20–30 Min.), sonst nichts', kurz: 'Wöchentlich' },
        { id: 'woche-plus-tag', text: 'Wöchentliche Sitzung plus kurzer Tages-Check (1–2 Min.)', kurz: 'Wöchentlich plus Tages-Check' },
        { id: 'bedarf', text: 'Nur bei Bedarf, kein fester Takt', kurz: 'Nur bei Bedarf' },
        { id: 'taeglich', text: 'Täglich kurz, ohne Wochensitzung', kurz: 'Täglich kurz' }
      ]
    },
    {
      id: 'F4.2', teil: 4, typ: 'einfach', ergaenzung: true,
      titel: 'Datenhaltung',
      frage: 'Wo sollen deine Daten liegen?',
      kontext: 'Vorschlag: alles bleibt auf deinem Gerät, kein Konto, kein Server. Sicherung als Datei jederzeit möglich.',
      optionen: [
        { id: 'lokal', text: 'Genau so, nur lokal', kurz: 'Nur lokal' },
        { id: 'lokal-sicherung', text: 'Lokal, aber mit verschlüsselter Sicherung, die ich selbst kontrolliere', kurz: 'Lokal mit verschlüsselter Sicherung' },
        { id: 'konto', text: 'Konto und Abgleich über mehrere Geräte sind mir wichtiger als strikte Lokalität', kurz: 'Konto und Abgleich' },
        { id: 'stephan', text: 'Soll Stephan entscheiden', kurz: 'Stephan entscheidet' }
      ]
    },

    /* ---------- Teil 5: Rahmen (Kurzform) ---------- */
    {
      id: 'F5.1', teil: 5, typ: 'einfach',
      titel: 'Berührung mit dem Arbeitgeber',
      frage: 'Hat eine rein private App für dich irgendeine Schnittstelle zu deiner Arbeit?',
      optionen: [
        { id: 'nein', text: 'Nein, komplett getrennt', kurz: 'Nein' },
        { id: 'methoden', text: 'Nur insofern, als ich Methoden aus meinem Beruf nutze', kurz: 'Nur Methoden' },
        { id: 'ueberschneidung', text: 'Ja, es könnte Überschneidungen mit Mandaten oder internen Programmen geben', kurz: 'Mögliche Überschneidungen' },
        { id: 'pruefen', text: 'Weiß ich nicht, muss ich prüfen', kurz: 'Muss ich prüfen' }
      ]
    },
    {
      id: 'F5.2', teil: 5, typ: 'einfach', ergaenzung: true,
      titel: 'Eigentum',
      frage: 'Wem soll die App gehören?',
      optionen: [
        { id: 'mir', text: 'Mir allein', kurz: 'Mir allein' },
        { id: 'gemeinsam', text: 'Stephan und mir gemeinsam', kurz: 'Gemeinsam' },
        { id: 'stellt-sich-nicht', text: 'Stephan baut, ich nutze, Frage stellt sich nicht', kurz: 'Stellt sich nicht' },
        { id: 'spaeter', text: 'Später klären', kurz: 'Später klären' }
      ]
    },
    {
      id: 'F5.3', teil: 5, typ: 'einfach', ergaenzung: true,
      titel: 'Berufliche Veränderungen',
      frage: 'Wie soll die App mit möglichen beruflichen Veränderungen in den nächsten 12–24 Monaten umgehen?',
      optionen: [
        { id: 'unabhaengig', text: 'Gar nicht, sie ist unabhängig davon', kurz: 'Unabhängig' },
        { id: 'uebergang', text: 'Sie soll mich in einer Übergangsphase begleiten', kurz: 'Übergang begleiten' },
        { id: 'baustein', text: 'Sie soll ein Baustein für etwas Eigenes sein', kurz: 'Baustein für Eigenes' },
        { id: 'offen', text: 'Offen halten', kurz: 'Offen halten' }
      ]
    },

    /* ---------- Teil 6: Stilgalerie ---------- */
    {
      id: 'F6.1', teil: 6, typ: 'stil', ergaenzung: true,
      titel: 'Welche Richtung spricht dich an?',
      frage: 'Welche Richtung spricht dich an?',
      ergaenzungLabel: 'Gibt es Apps oder Seiten, deren Anmutung du magst?',
      ergaenzungPlatzhalter: 'Namen reichen …'
      /* Optionen kommen aus mockups/mockups.js (drei Stile) */
    },
    {
      id: 'F6.2', teil: 6, typ: 'mehrfach',
      titel: 'Was gefällt dir daran konkret?',
      frage: 'Was gefällt dir an der gewählten Richtung konkret?',
      optionen: [
        { id: 'farben', text: 'Farben' },
        { id: 'schrift', text: 'Schrift' },
        { id: 'ruhe', text: 'Ruhe' },
        { id: 'struktur', text: 'Struktur' },
        { id: 'waerme', text: 'Wärme' },
        { id: 'vertrautheit', text: 'Vertrautheit' }
      ]
    }
  ]
};
