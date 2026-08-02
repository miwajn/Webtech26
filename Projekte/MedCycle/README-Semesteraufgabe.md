# MedCycle – Semesterprojekt Webtechnologie

**Janina Mitwalli**
**SoSe 2026**
**FIW – HTW Berlin**

## Read me

# Semesterprojekt – Webtechnologie

**MedCycle**

## 1. Was ist MedCycle? Warum?

MedCycle ist eine Webanwendung zur Verwaltung persönlicher Vorsorgetermine. Nutzer*innen tragen Vorsorgeuntersuchungen (z. B. Zahnvorsorge, Hautkrebs-Screening, Gesundheits-Check-up) ein und sehen auf einen Blick, wann die nächste Untersuchung fällig ist.

Ziel ist es, den Überblick über empfohlene Vorsorgeintervalle zu erleichtern, damit fällige Termine nicht in Vergessenheit geraten.

## 2. Installationsanleitung

### Voraussetzungen

1. **Backend:** Node.js, Express
2. **Frontend:** Angular CLI
3. **CSS-Framework:** Bootstrap
4. **Datenbank:** MongoDB
5. **Versionsverwaltung:** Git zum Klonen des Repositories

### Installation

#### 1. Repository klonen

```bash
git clone https://github.com/miwajn/Webtech26/tree/main/Projekte/MedCycle
```

#### 2. Abhängigkeiten installieren

```bash
npm install
```

#### 3. `.env`-Datei im Backend-Ordner anlegen

Die `.env`-Datei enthält die Zugangsdaten für die Datenbank:

```env
DB_CONNECTION=mongodb://127.0.0.1:27017
DATABASE=members
```

#### 4. Backend starten

```bash
cd backend
node server.js
```

#### 5. Frontend starten und Anwendung im Browser öffnen

```bash
cd MedCycle
ng serve -o
```

## 3. Anwendung

### Hauptfunktionen

* Gesundheitliche Vorsorgetermine speichern, ändern und löschen
* Userprofile anlegen und ändern
* User-Authentifizierung mittels Registrierung und Login-Funktion
* Speicherung der Userprofile und Vorsorgetermine als Einträge in MongoDB Compass
* Responsives Design mit Bootstrap
* Modal-/Dialogfelder mittels Angular Material

### Datenbankstruktur

#### Termin Interface

```typescript
_id?: string;       // MongoDB-ID
userId: string;     // Link zu User
typId: string;      // Link zu StandardVorsorgeTypen
datum: string;
notiz: string;
```

#### User Interface

```typescript
_id?: string;       // MongoDB-ID – Link zu Termin
firstname: string;
lastname: string;
email: string;      // Für Login relevant
password?: string;  // Für Login relevant
```

#### StandardvorsorgeTypen

Die `StandardvorsorgeTypen` sind nicht von Nutzer*innen änderbar. Sie werden nicht in MongoDB hinterlegt, sondern zentral im `shared`-Bereich gespeichert.

```typescript
id: string;         // Link zu Termin
name: string;
monate: number;    // Empfohlenes Intervall in Monaten
icon: string;      // Bootstrap-Icon
```

## 4. Referenzen und Nutzung von KI

Die Texte auf der Homepage zu den gesundheitlichen Vorsorgetypen basieren auf den Informationen, die auf der Website [www.krankenkassen.de](https://www.krankenkassen.de/) zu finden sind.

Während der Entwicklung wurde **Claude (Sonnet 5 niedrig)** begleitend als Unterstützung eingesetzt, unter anderem für:

* Fehlersuche bei Problemen, die während der Entwicklung aufgetreten sind – etwa wenn die Anwendung nicht wie erwartet reagiert hat oder Fehlermeldungen beim Programmieren erschienen sind
* Überarbeitung einzelner Programmteile, damit sie zuverlässiger funktionieren und übersichtlicher aufgebaut sind, z. B. bei der Gestaltung der Dialogfenster
* Unterstützung bei Entscheidungen zum Aufbau der Anwendung, etwa wie die verschiedenen Programmteile sinnvoll voneinander getrennt und welche Daten wo gespeichert werden sollten
* Die User-Komponente wurde zunächst von der KI entwickelt und anschließend eigenständig angepasst und weiterentwickelt.
* Anlegen von Einträgen für die Datenbank
* Entwicklung des Logos und Hintergrunddesigns

Alle Vorschläge wurden geprüft, an die eigene Anwendung angepasst und erst danach übernommen.

## 5. Optimierungsbedarf

1. **Geschlecht und Alter bei der Registrierung abfragen**

   Mittels Kontrollstruktur könnte dann entsprechend gefiltert werden, welche Vorsorgeuntersuchungen überhaupt angezeigt werden. Derzeit sind alle Vorsorgeuntersuchungen sichtbar.

2. **Logout für User hinzufügen**

   Derzeit ist keine Logout-Funktion vorhanden.

3. **Guards einrichten**

   Es sollten Guards eingerichtet werden, damit z. B. `/table` nicht direkt aufgerufen und dadurch Daten verändert werden können. Eine sichere und korrekte Authentifizierung sowie die Prüfung der jeweiligen Nutzer*innen sollten sichergestellt werden.

4. **Verschlüsselung von Passwörtern einrichten**

   Passwörter liegen derzeit unverschlüsselt im Backend und könnten abgegriffen werden.

5. **Generell hohen Sicherheitsstandard sicherstellen**

   Dies ist insbesondere relevant, da die Anwendung mit Gesundheitsdaten arbeitet.

6. **Aktualisierung der Ansichten verbessern**

   Einige Änderungen werden derzeit erst sichtbar, wenn die jeweilige Ansicht aktualisiert wird. Dies betrifft beispielsweise den Vorsorgepass (User-Komponente) oder die Terminhistorie (Table-Komponente) nach dem Löschen eines Termineintrags.

   Die Verwendung von Signals sollte überprüft und ggf. eine Umstellung auf Zoneless Change Detection in Betracht gezogen werden.

7. **Individuelle Intervalle für bestimmte Vorsorgeuntersuchungen**

   Die Intervalle für Schutzimpfungen, Schwangerschafts-Vorsorgeuntersuchungen sowie U- und J-Untersuchungen müssten individuell einstellbar sein.

   Aktuell werden für diese Untersuchungen 12 Monate als Platzhalter verwendet. Dies ist fachlich nicht korrekt und nicht nutzer*innenfreundlich.

## 6. Learnings

### 6.1 Wahl der Bezeichnungen

Von Beginn an sollten gezielt Dateinamen mit Ergänzungen wie `Komponente`, `Interface`, `Backendservice` etc. verwendet werden.

Außerdem sollte ein einheitliches Vorgehen bei der Bezeichnung von Methoden eingehalten werden. Aktuell werden sowohl englische als auch deutsche Namen verwendet.

### 6.2 Aufbau der Anwendung

Eine gezieltere Planung der Komponenten wäre sinnvoll gewesen. Das aktuelle Projekt ist nach und nach gewachsen und dadurch teilweise nicht so effizient aufgebaut, wie es möglich gewesen wäre.

Auch die Datenbankstruktur sollte im Vorfeld besser geplant werden:

* Welche Daten sollen gespeichert werden?
* Welche Daten sind tatsächlich notwendig?
* Was sollte in der Datenbank abgelegt werden?
* Was kann als Standardtyp außerhalb der Datenbank gespeichert werden?

Zuvor wurde beispielsweise ein eigenes Interface und Model für `VorsorgeTypen` angelegt. Dieses wurde später in einen Standardtyp umgewandelt. Die dazugehörigen Bestandteile wie Backendservice, Interface, Model und Routes konnten dadurch wieder gelöscht werden.

### 6.3 Nutzung von Signals

Signals sollten frühzeitig und konsequent bei Werten eingesetzt werden, die sich asynchron ändern, z. B. nach `await`-Aufrufen. Dadurch kann sichergestellt werden, dass Änderungen zuverlässig in der Ansicht ankommen.

Dadurch konnte ein besseres Verständnis dafür entwickelt werden, wann Angular automatisch neu rendert und wann dies nicht der Fall ist.
