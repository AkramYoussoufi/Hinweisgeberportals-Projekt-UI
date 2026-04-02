# Hinweisgeberportal — Frontend UI

The frontend interface for the **Hinweisgeberportal** — a secure, privacy-first whistleblower reporting platform. Built with **Vanilla JavaScript**, **Tailwind CSS 4**, and **Webix UI**, designed to comply with the German Whistleblower Protection Act (**HinSchG**) and **GDPR (DSGVO)**.

---

## Table of Contents

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

## Overview

This is a **Multi-Page Application (MPA)** — each page is a standalone HTML file with its own JavaScript. There is no SPA framework or client-side router. The UI communicates exclusively with the [Hinweisgeberportal Backend API](../hinweisgeberporal).

The application serves three distinct user groups, each with their own interface:

| User | Interface |
|---|---|
| **Whistleblower** (anonymous or registered) | `index.html`, `dashboard.html`, `track.html` |
| **Admin** | `admin/index.html` |
| **SuperAdmin** | `admin/index.html` (with additional tabs unlocked) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES6+) |
| Styling | Tailwind CSS 4.0 + custom CSS |
| UI Components (admin) | Webix UI (data grids, forms, layouts) |
| HTTP Client | Axios 1.11 |
| Alert Dialogs | SweetAlert2 |
| CAPTCHA | hCaptcha |
| Icons | Font Awesome 6.5 |
| Build Tool | Vite 7 |
| Dev Server | Vite dev server (HMR) |

---

## Pages & Routes

### `index.html` — Landing Page
**Access:** Public (no login required)

The main entry point for whistleblowers. Contains:
- Hero section with value proposition and two primary CTAs: **Submit a Report** and **Track a Report**
- Feature overview cards (anonymous, secure, legal compliance, communication)
- Inline **Login** and **Register** modals (no separate page)
- **Multi-step report submission wizard** with:
  - Step 1: Choose anonymous or registered
  - Step 2: Fill in report details (category, subject, description, optional: incident date, location, involved persons)
  - Step 3: hCaptcha verification (anonymous path)
  - On success: displays reference number and, for anonymous users, the one-time token + PIN
- Language switcher (German / English)

---

### `dashboard.html` — Whistleblower Dashboard
**Access:** Authenticated users (registered or anonymous with token+PIN)

Displays all reports submitted by the logged-in user:
- Two-panel layout: sidebar navigation + report list
- Each report shown as a card: reference number, category, status badge, subject, submission date
- Clicking a report navigates to `track.html?ref=HIN-YYYY-XXXX`
- Logout button in sidebar

---

### `track.html` — Report Detail & Communication
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

### `admin/index.html` — Admin Console
**Access:** Users with role `admin` or `superadmin`

A full case management interface powered by **Webix UI**:

**Sidebar Navigation**
- Dashboard (summary stats)
- Reports (all submissions)
- Admins — *superadmin only*
- Settings — *superadmin only*
- Logout

**Reports View**
- Filter bar: status dropdown, category dropdown, free-text search
- Webix data grid: reference number, subject, category, status, submission date, actions
- Inline status update: change from `received` → `reviewing` → `clarification` → `closed`
- Click a row to open full report detail: description, incident info, message thread, attachments

**Admins View** *(SuperAdmin only)*
- Table of all admin accounts with role, creation date, and status
- Actions: Deactivate, Reactivate, Change Password, Delete
- Create new admin form (email, password, role)
- Unlock whistleblower identity button on individual reports (creates audit log entry)

**Settings View** *(SuperAdmin only)*
- Editable fields: max reports per hour per IP, max file size (MB), max weekly upload quota (MB)
- Changes are persisted to the backend and take effect immediately

---

### `reset-password.html` — Password Reset
**Access:** Public

Reads `?token=...&email=...` from the URL (set by the backend in the reset email).
- New password + confirm password form
- Submits to the API; shows success confirmation on completion

---

### `verify-email.html` — Email Verification Result
**Access:** Public

Reads `?status=success|error|already` from the URL (set by the backend after processing the verification link).
- **success** — Email verified; link to login
- **error** — Invalid or expired link; link back to portal
- **already** — Email was already verified

---

## Project Structure

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

## JavaScript Architecture

### `js/config.js`
Exports a single `APP_CONFIG` object:

```js
APP_CONFIG = {
  API_BASE: "http://127.0.0.1:8000/api",   // Backend API URL
  APP_NAME: "Hinweisgeberportal"
}
```

Change `API_BASE` to point to the production server before building.

---

### `js/api.js`
The central API module. Exports all API call functions and auth utilities used by every page.

**Axios instance:**
- Base URL from `APP_CONFIG.API_BASE`
- Default headers: `Accept: application/json`, `Content-Type: application/json`
- **Request interceptor:** injects `Authorization: Bearer {token}` from localStorage; shows global loading spinner
- **Response interceptor:** hides spinner; passes errors through for page-level handling

**Auth utilities:**

| Function | Purpose |
|---|---|
| `setToken(token)` | Store token in localStorage and set Axios default header |
| `clearToken()` | Remove token from localStorage and Axios headers |
| `setUser(user)` | Store user object (`{ id, role, is_anonymous }`) in localStorage |
| `getUser()` | Retrieve user object from localStorage |
| `isLoggedIn()` | Returns `true` if a token exists in localStorage |

**All API methods** (grouped by feature):

| Group | Functions |
|---|---|
| Auth | `register`, `login`, `anonymousLogin`, `logout`, `forgotPassword`, `resetPassword`, `me` |
| Reports | `submitReport`, `getReports`, `getReport` |
| Messages | `getMessages`, `sendMessage` |
| Attachments | `getAttachments`, `uploadAttachment`, `downloadAttachment` |
| Admin | `adminGetReports`, `adminGetReport`, `adminUpdateStatus`, `adminGetMessages`, `adminSendMessage`, `adminGetAttachments` |
| SuperAdmin | `superadminListAdmins`, `superadminCreateAdmin`, `superadminDeactivateAdmin`, `superadminReactivateAdmin`, `superadminDeleteAdmin`, `superadminChangeAdminPassword`, `superadminUnlockIdentity`, `superadminGetSettings`, `superadminUpdateSettings` |

---

### State Management

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

## API Communication

All requests go through the Axios instance in `api.js`.

### File Upload
```js
// FormData is used for multipart/form-data
uploadAttachment(referenceNumber, file)
// Content-Type: multipart/form-data (set automatically by Axios)
```

### File Download
```js
// responseType: 'blob' for binary data
downloadAttachment(attachmentId)
// Frontend creates a Blob URL → triggers <a> click → download starts
```

### Error Handling
Page-level code catches Axios rejections and displays feedback via **SweetAlert2**. Common HTTP status codes handled:

| Status | Meaning | UI Response |
|---|---|---|
| `401` | Unauthenticated | Redirect to login |
| `403` | Forbidden | Access denied alert |
| `422` | Validation error | Show field-level errors |
| `429` | Rate limited | "Too many requests" message |

---

## Authentication Flow

### Registered User
1. Open registration modal on `index.html` → `POST /auth/register`
2. Check email for verification link → click to verify
3. Open login modal → `POST /auth/login` → token stored in localStorage
4. All pages check `isLoggedIn()` on load; redirect to `index.html` if false

### Anonymous User
1. Start report submission wizard without logging in
2. Complete form + hCaptcha → `POST /reports`
3. **One-time display:** token (UUID) and PIN (6 digits) shown in a modal — user must save these
4. Later: return to `index.html` → "Track Report" → enter token + PIN → `POST /auth/anonymous-login` → token stored in localStorage

---

## Language Support

The UI ships with full **German (default)** and **English** translations.

**Files:**
- `js/lang/de.js` — exports `LANG` object with all German strings
- `js/lang/en.js` — exports `LANG` object with all English strings

**Strings include:** app name, nav labels, hero text, form labels, button labels, category names, status names, error messages, validation messages.

**Switching language:**
1. User clicks the language toggle in the header
2. Selection saved to `localStorage` as `lang`
3. `LANG` object swapped; all page text updated

---

## Styling & Design

### Approach
- **Tailwind CSS 4** for utility classes throughout
- **`css/custom.css`** for named component styles (cards, buttons, sidebar, forms, modals)
- **Webix UI** handles the admin panel layout and complex components (data grids, dialogs)

### Color Palette

| Role | Value |
|---|---|
| Primary | `#1a237e` (dark indigo) |
| Primary light | `#e8eaf6` (light indigo) |
| Body text | `#333333` |
| Muted text | `#555555`, `#999999` |
| Borders | `#dddddd`, `#e0e0e0` |
| Background | `#f8f9fa` |

### Responsive Breakpoints

| Breakpoint | Width |
|---|---|
| Mobile | < 600px |
| Tablet | 600px – 1024px |
| Desktop | > 1024px |

---

## Security Practices

| Concern | Implementation |
|---|---|
| XSS prevention | Text set via `.textContent` / `.innerText`, never `.innerHTML` with user data |
| Token storage | Bearer token in localStorage; sent via `Authorization` header only |
| Anonymous credentials | Token + PIN displayed once in a modal; user is responsible for saving them |
| Input validation | Email format, password confirmation, MIME type, and file size checked client-side before submission |
| CAPTCHA | hCaptcha widget on anonymous report submission; token verified server-side |
| URL parameters | Query params sanitized before use in API calls or DOM updates |
| Role enforcement | Admin pages check `user.role === 'admin' || 'superadmin'` on load and redirect otherwise |

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm 9+
- The [backend API](../hinweisgeberporal) running at `http://127.0.0.1:8000`

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd hinweisgeberporal-ui

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns). Make sure `FRONTEND_URL` in the backend `.env` matches this address for email links to work correctly.

---

## Configuration

Edit `js/config.js` to point to the correct backend:

```js
// Development
const APP_CONFIG = {
  API_BASE: "http://127.0.0.1:8000/api",
  APP_NAME: "Hinweisgeberportal"
};

// Production — replace with actual server URL
const APP_CONFIG = {
  API_BASE: "https://api.yourdomain.de/api",
  APP_NAME: "Hinweisgeberportal"
};
```

---

## Building for Production

```bash
npm run build
```

Vite outputs optimized, minified assets into the `dist/` directory. Deploy the contents of `dist/` to any static web host or serve it from the backend's `public/` directory.

Ensure the backend's `FRONTEND_URL` environment variable is updated to the production domain so that email verification and password reset links resolve correctly.

---

## Related

- [Backend API Repository](../hinweisgeberporal) — Laravel 12 REST API
- API Base URL configured in `js/config.js`

---

## License

This project is proprietary. All rights reserved.
