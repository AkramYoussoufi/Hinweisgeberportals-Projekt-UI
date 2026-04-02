# Hinweisgeberportal — Frontend-Oberfläche / Frontend UI

[🇩🇪 Deutsch](#-deutsch) | [🇬🇧 English](#-english)

---

## 🇩🇪 Deutsch

Die Frontend-Oberfläche für das **Hinweisgeberportal** — eine sichere, datenschutzorientierte Whistleblower-Meldeplattform. Entwickelt mit **Vanilla JavaScript** und **Tailwind CSS 4**, konzipiert zur Einhaltung des deutschen Hinweisgeberschutzgesetzes (**HinSchG**) und der **DSGVO**.

---

### Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Technologie-Stack](#technologie-stack)
- [Seiten & Routen](#seiten--routen)
- [Projektstruktur](#projektstruktur)
- [JavaScript-Architektur](#javascript-architektur)
- [API-Kommunikation](#api-kommunikation)
- [Authentifizierungsablauf](#authentifizierungsablauf)
- [Sprachunterstützung](#sprachunterstützung)
- [Gestaltung & Design](#gestaltung--design)
- [Sicherheitsmaßnahmen](#sicherheitsmaßnahmen)
- [Installation & Einrichtung](#installation--einrichtung)
- [Konfiguration](#konfiguration)
- [Produktions-Build](#produktions-build)

---

### Übersicht

Dies ist eine **Multi-Page Application (MPA)** — jede Seite ist eine eigenständige HTML-Datei mit eigenem JavaScript. Es gibt kein SPA-Framework oder clientseitigen Router. Die Oberfläche kommuniziert ausschließlich mit der [Hinweisgeberportal-Backend-API](../hinweisgeberporal).

Die Anwendung bedient drei verschiedene Nutzergruppen, jede mit eigener Oberfläche:

| Nutzer                                     | Oberfläche                                   |
| ------------------------------------------ | -------------------------------------------- |
| **Hinweisgeber** (anonym oder registriert) | `index.html`, `dashboard.html`, `track.html` |
| **Administrator**                          | `admin/index.html`                           |
| **SuperAdministrator**                     | `admin/index.html` (mit zusätzlichen Tabs)   |

---

### Technologie-Stack

| Schicht                | Technologie                                                   |
| ---------------------- | ------------------------------------------------------------- |
| Sprache                | Vanilla JavaScript (ES6+)                                     |
| Gestaltung             | Tailwind CSS 4.0 + benutzerdefiniertes CSS                    |
| UI-Komponenten (Admin) | Eigene Tailwind-CSS-Komponenten (Tabellen, Modals, Formulare) |
| HTTP-Client            | Axios 1.11                                                    |
| Hinweisdialoge         | SweetAlert2                                                   |
| CAPTCHA                | hCaptcha                                                      |
| Icons                  | Font Awesome 6.5                                              |

---

### Seiten & Routen

#### `index.html` — Startseite

**Zugang:** Öffentlich (kein Login erforderlich)

Der Haupteinstiegspunkt für Hinweisgeber. Enthält:

- Hero-Bereich mit zwei primären Aktionen: **Meldung einreichen** und **Meldung verfolgen**
- Übersichtskarten (anonym, sicher, gesetzeskonform, Kommunikation)
- Eingebettete **Login**- und **Registrierungs**-Modals (keine separaten Seiten)
- **Mehrstufiger Meldeassistent:**
  - Schritt 1: Anonym oder registriert wählen
  - Schritt 2: Meldungsdetails ausfüllen (Kategorie, Betreff, Beschreibung, optional: Datum, Ort, beteiligte Personen)
  - Schritt 3: hCaptcha-Verifizierung (anonymer Pfad)
  - Bei Erfolg: Anzeige der Referenznummer und, für anonyme Nutzer, des einmaligen Tokens + der PIN
- Sprachumschalter (Deutsch / Englisch)

---

#### `dashboard.html` — Hinweisgeber-Dashboard

**Zugang:** Authentifizierte Nutzer (registriert oder anonym mit Token+PIN)

Zeigt alle Meldungen des eingeloggten Nutzers:

- Zwei-Spalten-Layout: Seitenleiste + Meldungsliste
- Jede Meldung als Karte: Referenznummer, Kategorie, Status-Badge, Betreff, Einreichungsdatum
- Klick auf eine Meldung navigiert zu `track.html?ref=HIN-YYYY-XXXX`
- Abmelde-Schaltfläche in der Seitenleiste

---

#### `track.html` — Meldungsdetail & Kommunikation

**Zugang:** Authentifizierter Meldungsinhaber

Wird mit `?ref=HIN-YYYY-XXXX` als Abfrageparameter geladen. Zeigt alles zu einer einzelnen Meldung, in **drei Tabs**:

**Tab Details**

- Referenznummer, Status, Kategorie
- Betreff, vollständige Beschreibung
- Vorfallsdatum, -ort, beteiligte Personen (falls angegeben)

**Tab Nachrichten**

- Thread-Konversation zwischen Hinweisgeber und Administrator
- Nachrichteneingabe am unteren Rand
- Scrollt automatisch zur letzten Nachricht
- Zeigt Gelesen/Ungelesen-Zeitstempel
- Eingabe deaktiviert und ausgeblendet bei geschlossener Meldung

**Tab Anhänge**

- Liste aller hochgeladenen Dateien mit Name, Größe und Download-Schaltfläche
- Datei-Upload-Formular mit clientseitiger Validierung (MIME-Typ + Dateigröße)
- Upload deaktiviert bei geschlossener Meldung

---

#### `admin/index.html` — Administrationskonsole

**Zugang:** Nutzer mit Rolle `admin` oder `superadmin`

Eine vollständige Fallverwaltungsoberfläche mit eigenen Tailwind-CSS-Komponenten:

**Seitenleisten-Navigation**

- Dashboard (Zusammenfassung)
- Meldungen (alle Einreichungen)
- Administratoren — _nur SuperAdmin_
- Einstellungen — _nur SuperAdmin_
- Abmelden

**Meldungsansicht**

- Filterleiste: Status-Dropdown, Kategorie-Dropdown, Freitextsuche
- Meldungstabelle: Referenznummer, Betreff, Kategorie, Status, Einreichungsdatum, Aktionen
- Statusaktualisierung: von `eingegangen` → `in Bearbeitung` → `Klärungsbedarf` → `abgeschlossen`
- Klick auf eine Zeile öffnet vollständiges Meldungsdetail: Beschreibung, Vorfallsinfo, Nachrichtenthread, Anhänge

**Administratorenansicht** _(nur SuperAdmin)_

- Tabelle aller Admin-Konten mit Rolle, Erstellungsdatum und Status
- Aktionen: Deaktivieren, Reaktivieren, Passwort ändern, Löschen
- Formular zum Anlegen neuer Administratoren
- Identitätsentschlüsselungs-Schaltfläche für einzelne Meldungen (erstellt Audit-Log-Eintrag)

**Einstellungsansicht** _(nur SuperAdmin)_

- Bearbeitbare Felder: max. Meldungen pro Stunde pro IP, max. Dateigröße (MB), max. wöchentliches Upload-Kontingent (MB)
- Änderungen werden im Backend gespeichert und gelten sofort

---

#### `reset-password.html` — Passwort zurücksetzen

**Zugang:** Öffentlich

Liest `?token=...&email=...` aus der URL (vom Backend in der Reset-E-Mail gesetzt).

- Formular für neues Passwort + Bestätigung
- Sendet an die API; zeigt Erfolgsbestätigung nach Abschluss

---

#### `verify-email.html` — E-Mail-Verifizierungsergebnis

**Zugang:** Öffentlich

Liest `?status=success|error|already` aus der URL.

- **success** — E-Mail verifiziert; Link zum Login
- **error** — Ungültiger oder abgelaufener Link; Link zurück zum Portal
- **already** — E-Mail war bereits verifiziert

---

### Projektstruktur

```
hinweisgeberporal-ui/
├── index.html                   # Startseite + Meldeassistent
├── dashboard.html               # Hinweisgeber-Meldungsliste
├── track.html                   # Meldungsdetail, Nachrichten, Anhänge
├── reset-password.html          # Passwort-Reset-Formular
├── verify-email.html            # E-Mail-Verifizierungsergebnis
├── admin/
│   └── index.html               # Administrator- und SuperAdmin-Konsole
├── js/
│   ├── config.js                # API-Basis-URL und App-Konstanten
│   ├── api.js                   # Axios-Instanz, Interceptoren, alle API-Methoden
│   └── lang/
│       ├── de.js                # Deutsche UI-Zeichenketten (Standard)
│       └── en.js                # Englische UI-Zeichenketten
├── css/
│   └── custom.css               # Globale Komponentenstile
├── package.json
└── vite.config.js
```

---

### JavaScript-Architektur

#### `js/config.js`

Exportiert ein einzelnes `APP_CONFIG`-Objekt:

```js
APP_CONFIG = {
  API_BASE: "http://127.0.0.1:8000/api",
  APP_NAME: "Hinweisgeberportal",
};
```

`API_BASE` vor dem Produktions-Build auf den Produktionsserver ändern.

---

#### `js/api.js`

Das zentrale API-Modul. Exportiert alle API-Aufruf-Funktionen und Auth-Hilfsprogramme.

**Axios-Instanz:**

- Basis-URL aus `APP_CONFIG.API_BASE`
- Standard-Header: `Accept: application/json`, `Content-Type: application/json`
- **Anfrage-Interceptor:** fügt `Authorization: Bearer {token}` aus localStorage ein; zeigt globalen Lade-Spinner
- **Antwort-Interceptor:** blendet Spinner aus; leitet Fehler für seitenspezifische Behandlung weiter

**Auth-Hilfsprogramme:**

| Funktion          | Zweck                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| `setToken(token)` | Token in localStorage speichern und als Axios-Standard-Header setzen  |
| `clearToken()`    | Token aus localStorage und Axios-Headern entfernen                    |
| `setUser(user)`   | Nutzerobjekt (`{ id, role, is_anonymous }`) in localStorage speichern |
| `getUser()`       | Nutzerobjekt aus localStorage abrufen                                 |
| `isLoggedIn()`    | Gibt `true` zurück, wenn ein Token in localStorage vorhanden ist      |

**Alle API-Methoden** (nach Funktion gruppiert):

| Gruppe      | Funktionen                                                                                                                                                                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth        | `register`, `login`, `anonymousLogin`, `logout`, `forgotPassword`, `resetPassword`, `me`                                                                                                                                                             |
| Meldungen   | `submitReport`, `getReports`, `getReport`                                                                                                                                                                                                            |
| Nachrichten | `getMessages`, `sendMessage`                                                                                                                                                                                                                         |
| Anhänge     | `getAttachments`, `uploadAttachment`, `downloadAttachment`                                                                                                                                                                                           |
| Admin       | `adminGetReports`, `adminGetReport`, `adminUpdateStatus`, `adminGetMessages`, `adminSendMessage`, `adminGetAttachments`                                                                                                                              |
| SuperAdmin  | `superadminListAdmins`, `superadminCreateAdmin`, `superadminDeactivateAdmin`, `superadminReactivateAdmin`, `superadminDeleteAdmin`, `superadminChangeAdminPassword`, `superadminUnlockIdentity`, `superadminGetSettings`, `superadminUpdateSettings` |

---

#### Zustandsverwaltung

Es gibt keine globale Zustandsbibliothek. Der Zustand wird mit zwei Mechanismen verwaltet:

1. **`localStorage`** — seitenübergreifend persistent:
   - `token` — Sanctum Bearer-Token
   - `user` — JSON-Objekt `{ id, role, is_anonymous }`
   - `lang` — aktuelle Sprachauswahl (`de` oder `en`)

2. **In-Memory-Variablen** — lokal für jede Seite:
   - Aktuelle Meldungsdaten
   - Nachrichtenliste
   - Anhangsliste
   - Aktive Filterauswahl

Das DOM wird direkt aktualisiert — kein virtuelles DOM, keine Reaktivitätsschicht.

---

### API-Kommunikation

Alle Anfragen laufen über die Axios-Instanz in `api.js`.

#### Datei-Upload

```js
// FormData wird für multipart/form-data verwendet
uploadAttachment(referenceNumber, file);
// Content-Type: multipart/form-data (automatisch von Axios gesetzt)
```

#### Datei-Download

```js
// responseType: 'blob' für Binärdaten
downloadAttachment(attachmentId);
// Frontend erstellt Blob-URL → löst <a>-Klick aus → Download startet
```

#### Fehlerbehandlung

Seitenspezifischer Code fängt Axios-Fehler ab und zeigt Rückmeldungen über **SweetAlert2**. Behandelte HTTP-Status-Codes:

| Status | Bedeutung             | UI-Reaktion                     |
| ------ | --------------------- | ------------------------------- |
| `401`  | Nicht authentifiziert | Weiterleitung zum Login         |
| `403`  | Zugriff verweigert    | Zugriff-verweigert-Meldung      |
| `422`  | Validierungsfehler    | Feldspezifische Fehlermeldungen |
| `429`  | Rate-Limit erreicht   | Meldung "Zu viele Anfragen"     |

---

### Authentifizierungsablauf

#### Registrierter Nutzer

1. Registrierungsmodal auf `index.html` öffnen → `POST /auth/register`
2. E-Mail auf Verifizierungslink prüfen → klicken zum Verifizieren
3. Login-Modal öffnen → `POST /auth/login` → Token in localStorage gespeichert
4. Alle Seiten prüfen `isLoggedIn()` beim Laden; Weiterleitung zu `index.html` bei negativem Ergebnis

#### Anonymer Nutzer

1. Meldeassistenten ohne Einloggen starten
2. Formular + hCaptcha ausfüllen → `POST /reports`
3. **Einmalige Anzeige:** Token (UUID) und PIN (6 Stellen) in einem Modal — Nutzer muss diese speichern
4. Später: `index.html` → „Meldung verfolgen" → Token + PIN eingeben → `POST /auth/anonymous-login` → Token in localStorage

---

### Sprachunterstützung

Die Oberfläche enthält vollständige **Deutsch- (Standard)** und **Englisch-**Übersetzungen.

**Dateien:**

- `js/lang/de.js` — exportiert `LANG`-Objekt mit allen deutschen Zeichenketten (Standard)
- `js/lang/en.js` — exportiert `LANG`-Objekt mit allen englischen Zeichenketten

**Zeichenketten umfassen:** App-Name, Navigationsbezeichnungen, Hero-Text, Formular-Labels, Schaltflächenbezeichnungen, Kategorienamen, Statusbezeichnungen, Fehlermeldungen, Validierungsmeldungen.

**Sprachewechsel:**

1. Nutzer klickt auf den Sprachumschalter in der Kopfzeile
2. Auswahl wird als `lang` in `localStorage` gespeichert
3. `LANG`-Objekt wird ausgetauscht; der gesamte Seitentext wird aktualisiert

---

### Gestaltung & Design

#### Ansatz

- **Tailwind CSS 4** für Utility-Klassen überall
- **`css/custom.css`** für benannte Komponentenstile (Karten, Schaltflächen, Seitenleiste, Formulare, Modals, Admin-Tabellen)

#### Farbpalette

| Rolle           | Wert                       |
| --------------- | -------------------------- |
| Primär          | `#1a237e` (dunkles Indigo) |
| Primär hell     | `#e8eaf6` (helles Indigo)  |
| Fließtext       | `#333333`                  |
| Gedämpfter Text | `#555555`, `#999999`       |
| Rahmenlinien    | `#dddddd`, `#e0e0e0`       |
| Hintergrund     | `#f8f9fa`                  |

#### Responsive Breakpoints

| Breakpoint | Breite         |
| ---------- | -------------- |
| Mobil      | < 600px        |
| Tablet     | 600px – 1024px |
| Desktop    | > 1024px       |

---

### Sicherheitsmaßnahmen

| Bereich              | Umsetzung                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------ | --- | ------------------------------------------------------ |
| XSS-Prävention       | Text wird über `.textContent` / `.innerText` gesetzt, niemals `.innerHTML` mit Nutzerdaten |
| Token-Speicherung    | Bearer-Token in localStorage; nur über `Authorization`-Header übertragen                   |
| Anonyme Zugangsdaten | Token + PIN einmalig in einem Modal angezeigt; Nutzer ist für die Sicherung verantwortlich |
| Eingabevalidierung   | E-Mail-Format, Passwortbestätigung, MIME-Typ und Dateigröße werden clientseitig geprüft    |
| CAPTCHA              | hCaptcha-Widget bei anonymer Meldungseinreichung; Token serverseitig verifiziert           |
| URL-Parameter        | Abfrageparameter vor Verwendung in API-Aufrufen oder DOM-Updates bereinigt                 |
| Rollendurchsetzung   | Admin-Seiten prüfen `user.role === 'admin'                                                 |     | 'superadmin'` beim Laden und leiten andernfalls weiter |

---

### Installation & Einrichtung

#### Voraussetzungen

- Node.js 18+
- npm 9+
- Die [Backend-API](../hinweisgeberporal) läuft unter `http://127.0.0.1:8000`

#### Schritte

```bash
# 1. Repository klonen
git clone <repo-url>
cd hinweisgeberporal-ui

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten
npm run dev
```

Die App ist unter `http://localhost:5173` verfügbar. Sicherstellen, dass `FRONTEND_URL` in der Backend-`.env` mit dieser Adresse übereinstimmt, damit E-Mail-Links korrekt funktionieren.

---

### Konfiguration

`js/config.js` bearbeiten, um auf das richtige Backend zu zeigen:

```js
// Entwicklung
const APP_CONFIG = {
  API_BASE: "http://127.0.0.1:8000/api",
  APP_NAME: "Hinweisgeberportal",
};

// Produktion — durch tatsächliche Server-URL ersetzen
const APP_CONFIG = {
  API_BASE: "https://api.ihredomain.de/api",
  APP_NAME: "Hinweisgeberportal",
};
```

---

### Produktions-Build

```bash
npm run build
```

Vite gibt optimierte, minimierte Assets in das `dist/`-Verzeichnis aus. Den Inhalt von `dist/` auf einem beliebigen statischen Webhost bereitstellen oder aus dem `public/`-Verzeichnis des Backends ausliefern.

Die `FRONTEND_URL`-Umgebungsvariable des Backends auf die Produktionsdomain aktualisieren, damit E-Mail-Verifizierungs- und Passwort-Reset-Links korrekt aufgelöst werden.

---

### Verwandtes

- [Backend-API-Repository](../hinweisgeberporal) — Laravel 12 REST API
- API-Basis-URL konfiguriert in `js/config.js`

---

### Lizenz

Dieses Projekt ist proprietär. Alle Rechte vorbehalten.

---

## 🇬🇧 English

The frontend interface for the **Hinweisgeberportal** — a secure, privacy-first whistleblower reporting platform. Built with **Vanilla JavaScript** and **Tailwind CSS 4**, designed to comply with the German Whistleblower Protection Act (**HinSchG**) and **GDPR (DSGVO)**.

---

### Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Pages & Routes](#pages--routes)
- [Project Structure](#project-structure)
- [JavaScript Architecture](#javascript-architecture)
- [API Communication](#api-communication)
- [Authentication Flow](#authentication-flow)
- [Language Support](#language-support)
- [Styling & Design](#styling--design)
- [Security Practices](#security-practices)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Building for Production](#building-for-production)

---

### Overview

This is a **Multi-Page Application (MPA)** — each page is a standalone HTML file with its own JavaScript. There is no SPA framework or client-side router. The UI communicates exclusively with the [Hinweisgeberportal Backend API](../hinweisgeberporal).

The application serves three distinct user groups, each with their own interface:

| User                                        | Interface                                          |
| ------------------------------------------- | -------------------------------------------------- |
| **Whistleblower** (anonymous or registered) | `index.html`, `dashboard.html`, `track.html`       |
| **Admin**                                   | `admin/index.html`                                 |
| **SuperAdmin**                              | `admin/index.html` (with additional tabs unlocked) |

---

### Tech Stack

| Layer                 | Technology                                             |
| --------------------- | ------------------------------------------------------ |
| Language              | Vanilla JavaScript (ES6+)                              |
| Styling               | Tailwind CSS 4.0 + custom CSS                          |
| UI Components (admin) | Custom Tailwind CSS components (tables, modals, forms) |
| HTTP Client           | Axios 1.11                                             |
| Alert Dialogs         | SweetAlert2                                            |
| CAPTCHA               | hCaptcha                                               |
| Icons                 | Font Awesome 6.5                                       |
| Build Tool            | Vite 7                                                 |
| Dev Server            | Vite dev server (HMR)                                  |

---

### Pages & Routes

#### `index.html` — Landing Page

**Access:** Public (no login required)

The main entry point for whistleblowers. Contains:

- Hero section with two primary CTAs: **Submit a Report** and **Track a Report**
- Feature overview cards (anonymous, secure, legal compliance, communication)
- Inline **Login** and **Register** modals (no separate page)
- **Multi-step report submission wizard** with:
  - Step 1: Choose anonymous or registered
  - Step 2: Fill in report details (category, subject, description, optional: incident date, location, involved persons)
  - Step 3: hCaptcha verification (anonymous path)
  - On success: displays reference number and, for anonymous users, the one-time token + PIN
- Language switcher (German / English)

---

#### `dashboard.html` — Whistleblower Dashboard

**Access:** Authenticated users (registered or anonymous with token+PIN)

Displays all reports submitted by the logged-in user:

- Two-panel layout: sidebar navigation + report list
- Each report shown as a card: reference number, category, status badge, subject, submission date
- Clicking a report navigates to `track.html?ref=HIN-YYYY-XXXX`
- Logout button in sidebar

---

#### `track.html` — Report Detail & Communication

**Access:** Authenticated report owner

Loaded with `?ref=HIN-YYYY-XXXX` as a query parameter. Shows everything about a single report, organized into **three tabs**:

**Details tab**

- Reference number, status, category
- Subject, full description
- Incident date, location, involved persons (if provided)

**Messages tab**

- Thread-style conversation between whistleblower and admin
- Message input field at the bottom
- Auto-scrolls to the latest message
- Shows read/unread timestamps
- Message input is disabled and hidden when the report is closed

**Attachments tab**

- List of all uploaded files with name, size, and download button
- File upload form with client-side validation (MIME type + file size)
- Upload disabled when report is closed

---

#### `admin/index.html` — Admin Console

**Access:** Users with role `admin` or `superadmin`

A full case management interface built with custom Tailwind CSS components:

**Sidebar Navigation**

- Dashboard (summary stats)
- Reports (all submissions)
- Admins — _superadmin only_
- Settings — _superadmin only_
- Logout

**Reports View**

- Filter bar: status dropdown, category dropdown, free-text search
- Reports table: reference number, subject, category, status, submission date, actions
- Inline status update: change from `received` → `reviewing` → `clarification` → `closed`
- Click a row to open full report detail: description, incident info, message thread, attachments

**Admins View** _(SuperAdmin only)_

- Table of all admin accounts with role, creation date, and status
- Actions: Deactivate, Reactivate, Change Password, Delete
- Create new admin form (email, password, role)
- Unlock whistleblower identity button on individual reports (creates audit log entry)

**Settings View** _(SuperAdmin only)_

- Editable fields: max reports per hour per IP, max file size (MB), max weekly upload quota (MB)
- Changes are persisted to the backend and take effect immediately

---

#### `reset-password.html` — Password Reset

**Access:** Public

Reads `?token=...&email=...` from the URL (set by the backend in the reset email).

- New password + confirm password form
- Submits to the API; shows success confirmation on completion

---

#### `verify-email.html` — Email Verification Result

**Access:** Public

Reads `?status=success|error|already` from the URL.

- **success** — Email verified; link to login
- **error** — Invalid or expired link; link back to portal
- **already** — Email was already verified

---

### Project Structure

```
hinweisgeberporal-ui/
├── index.html                   # Landing page + report submission wizard
├── dashboard.html               # Whistleblower report list
├── track.html                   # Report detail, messaging, attachments
├── reset-password.html          # Password reset form
├── verify-email.html            # Email verification result
├── admin/
│   └── index.html               # Admin and SuperAdmin console
├── js/
│   ├── config.js                # API base URL and app constants
│   ├── api.js                   # Axios instance, interceptors, all API methods
│   └── lang/
│       ├── de.js                # German UI strings (default)
│       └── en.js                # English UI strings
├── css/
│   └── custom.css               # Global component styles
├── package.json
└── vite.config.js
```

---

### JavaScript Architecture

#### `js/config.js`

Exports a single `APP_CONFIG` object:

```js
APP_CONFIG = {
  API_BASE: "http://127.0.0.1:8000/api",
  APP_NAME: "Hinweisgeberportal",
};
```

Change `API_BASE` to point to the production server before building.

---

#### `js/api.js`

The central API module. Exports all API call functions and auth utilities used by every page.

**Axios instance:**

- Base URL from `APP_CONFIG.API_BASE`
- Default headers: `Accept: application/json`, `Content-Type: application/json`
- **Request interceptor:** injects `Authorization: Bearer {token}` from localStorage; shows global loading spinner
- **Response interceptor:** hides spinner; passes errors through for page-level handling

**Auth utilities:**

| Function          | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `setToken(token)` | Store token in localStorage and set Axios default header         |
| `clearToken()`    | Remove token from localStorage and Axios headers                 |
| `setUser(user)`   | Store user object (`{ id, role, is_anonymous }`) in localStorage |
| `getUser()`       | Retrieve user object from localStorage                           |
| `isLoggedIn()`    | Returns `true` if a token exists in localStorage                 |

**All API methods** (grouped by feature):

| Group       | Functions                                                                                                                                                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth        | `register`, `login`, `anonymousLogin`, `logout`, `forgotPassword`, `resetPassword`, `me`                                                                                                                                                             |
| Reports     | `submitReport`, `getReports`, `getReport`                                                                                                                                                                                                            |
| Messages    | `getMessages`, `sendMessage`                                                                                                                                                                                                                         |
| Attachments | `getAttachments`, `uploadAttachment`, `downloadAttachment`                                                                                                                                                                                           |
| Admin       | `adminGetReports`, `adminGetReport`, `adminUpdateStatus`, `adminGetMessages`, `adminSendMessage`, `adminGetAttachments`                                                                                                                              |
| SuperAdmin  | `superadminListAdmins`, `superadminCreateAdmin`, `superadminDeactivateAdmin`, `superadminReactivateAdmin`, `superadminDeleteAdmin`, `superadminChangeAdminPassword`, `superadminUnlockIdentity`, `superadminGetSettings`, `superadminUpdateSettings` |

---

#### State Management

There is no global state library. State is managed with two mechanisms:

1. **`localStorage`** — persisted across pages:
   - `token` — Sanctum Bearer token
   - `user` — JSON object `{ id, role, is_anonymous }`
   - `lang` — current language selection (`de` or `en`)

2. **In-memory variables** — local to each page:
   - Current report data
   - Message list
   - Attachment list
   - Active filter selections

The DOM is updated directly — no virtual DOM, no reactivity layer.

---

### API Communication

All requests go through the Axios instance in `api.js`.

#### File Upload

```js
// FormData is used for multipart/form-data
uploadAttachment(referenceNumber, file);
// Content-Type: multipart/form-data (set automatically by Axios)
```

#### File Download

```js
// responseType: 'blob' for binary data
downloadAttachment(attachmentId);
// Frontend creates a Blob URL → triggers <a> click → download starts
```

#### Error Handling

Page-level code catches Axios rejections and displays feedback via **SweetAlert2**. Common HTTP status codes handled:

| Status | Meaning          | UI Response                 |
| ------ | ---------------- | --------------------------- |
| `401`  | Unauthenticated  | Redirect to login           |
| `403`  | Forbidden        | Access denied alert         |
| `422`  | Validation error | Show field-level errors     |
| `429`  | Rate limited     | "Too many requests" message |

---

### Authentication Flow

#### Registered User

1. Open registration modal on `index.html` → `POST /auth/register`
2. Check email for verification link → click to verify
3. Open login modal → `POST /auth/login` → token stored in localStorage
4. All pages check `isLoggedIn()` on load; redirect to `index.html` if false

#### Anonymous User

1. Start report submission wizard without logging in
2. Complete form + hCaptcha → `POST /reports`
3. **One-time display:** token (UUID) and PIN (6 digits) shown in a modal — user must save these
4. Later: return to `index.html` → "Track Report" → enter token + PIN → `POST /auth/anonymous-login` → token stored in localStorage

---

### Language Support

The UI ships with full **German (default)** and **English** translations.

**Files:**

- `js/lang/de.js` — exports `LANG` object with all German strings (default)
- `js/lang/en.js` — exports `LANG` object with all English strings

**Strings include:** app name, nav labels, hero text, form labels, button labels, category names, status names, error messages, validation messages.

**Switching language:**

1. User clicks the language toggle in the header
2. Selection saved to `localStorage` as `lang`
3. `LANG` object swapped; all page text updated

---

### Styling & Design

#### Approach

- **Tailwind CSS 4** for utility classes throughout
- **`css/custom.css`** for named component styles (cards, buttons, sidebar, forms, modals, admin tables)

#### Color Palette

| Role          | Value                    |
| ------------- | ------------------------ |
| Primary       | `#1a237e` (dark indigo)  |
| Primary light | `#e8eaf6` (light indigo) |
| Body text     | `#333333`                |
| Muted text    | `#555555`, `#999999`     |
| Borders       | `#dddddd`, `#e0e0e0`     |
| Background    | `#f8f9fa`                |

#### Responsive Breakpoints

| Breakpoint | Width          |
| ---------- | -------------- |
| Mobile     | < 600px        |
| Tablet     | 600px – 1024px |
| Desktop    | > 1024px       |

---

### Security Practices

| Concern               | Implementation                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------- | --- | -------------------------------------------- |
| XSS prevention        | Text set via `.textContent` / `.innerText`, never `.innerHTML` with user data                       |
| Token storage         | Bearer token in localStorage; sent via `Authorization` header only                                  |
| Anonymous credentials | Token + PIN displayed once in a modal; user is responsible for saving them                          |
| Input validation      | Email format, password confirmation, MIME type, and file size checked client-side before submission |
| CAPTCHA               | hCaptcha widget on anonymous report submission; token verified server-side                          |
| URL parameters        | Query params sanitized before use in API calls or DOM updates                                       |
| Role enforcement      | Admin pages check `user.role === 'admin'                                                            |     | 'superadmin'` on load and redirect otherwise |

---

### Installation & Setup

#### Prerequisites

- Node.js 18+
- npm 9+
- The [backend API](../hinweisgeberporal) running at `http://127.0.0.1:8000`

#### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd hinweisgeberporal-ui

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`. Make sure `FRONTEND_URL` in the backend `.env` matches this address for email links to work correctly.

---

### Configuration

Edit `js/config.js` to point to the correct backend:

```js
// Development
const APP_CONFIG = {
  API_BASE: "http://127.0.0.1:8000/api",
  APP_NAME: "Hinweisgeberportal",
};

// Production — replace with actual server URL
const APP_CONFIG = {
  API_BASE: "https://api.yourdomain.de/api",
  APP_NAME: "Hinweisgeberportal",
};
```

---

### Building for Production

```bash
npm run build
```

Vite outputs optimized, minified assets into the `dist/` directory. Deploy the contents of `dist/` to any static web host or serve it from the backend's `public/` directory.

Ensure the backend's `FRONTEND_URL` environment variable is updated to the production domain so that email verification and password reset links resolve correctly.

---

### Related

- [Backend API Repository](../hinweisgeberporal) — Laravel 12 REST API
- API Base URL configured in `js/config.js`

---

### License

This project is proprietary. All rights reserved.
