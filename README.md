# Admetrics

Mobile app for clinics on the Admetrics platform: register a clinic, sign
its MOU, connect TV displays, follow revenue and payouts, and contact
support. Built with React Native for **Android** and **iOS**.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Running the app](#running-the-app)
- [Release builds](#release-builds)
- [Checks and tests](#checks-and-tests)
- [Project structure](#project-structure)
- [API layer](#api-layer)
- [Authentication flow](#authentication-flow)
- [Conventions](#conventions)
- [Troubleshooting](#troubleshooting)
- [Backend status](#backend-status)

---

## Features

| Area | What it does |
|---|---|
| **Account** | Sign up with email code, password, login, authenticator (TOTP) two-step verification, forgot / change password, Face ID / fingerprint app lock |
| **Clinics** | Four-step registration (clinic info with pincode lookup and map pin, working hours, contact, photos, MOU signature), preview, edit, list |
| **MOU** | Read the MOU PDF from the backend, sign with a finger-drawn signature, the backend adds it to the PDF, view the signed copy |
| **Devices** | Add a TV by QR code or pairing code, name it and assign it to a clinic |
| **Revenue** | Earnings summary, chart, TV displays, monthly payout statements |
| **Support** | Raise a complaint, schedule an installation, recent requests |
| **Settings** | Light / dark / system appearance, privacy & security, bank account |

---

## Tech stack

| | |
|---|---|
| Framework | React Native **0.88** (New Architecture), React **19**, TypeScript |
| Native modules | Expo modules (SDK 58) |
| Navigation | React Navigation 7 (native stack + bottom tabs) |
| State | Redux Toolkit + redux-persist (AsyncStorage) |
| Secure storage | react-native-keychain (session tokens) |
| Bottom sheets | @swmansion/react-native-bottom-sheet |
| Maps | MapLibre + OpenFreeMap tiles (free, no key), expo-location |
| Camera / QR | react-native-camera-kit, react-native-qrcode-svg |
| Config | react-native-dotenv (`.env`) |
| Tests | Jest |

Minimum OS: **Android 7.0 (API 24)**, **iOS 16.4**.

---

## Requirements

- **Node** 22.11 or newer, **Yarn** 1.x
- **iOS:** macOS, Xcode, CocoaPods (`gem install cocoapods` or Bundler)
- **Android:** Android Studio, JDK 17, an emulator or a device with USB /
  wireless debugging
- The Admetrics backend reachable from your machine and device (same
  network)

Follow the official
[React Native environment setup](https://reactnative.dev/docs/set-up-your-environment)
first if this machine has never built a React Native app.

---

## Getting started

```sh
git clone <repository-url> Admetrics
cd Admetrics

yarn install                  # installs packages and applies patches/
cp .env.example .env          # then edit .env (see below)

cd ios && pod install && cd ..
```

`yarn install` runs `patch-package`, which applies the fixes in `patches/`
(currently `react-native-camera-kit`). Don't skip it.

---

## Environment variables

All settings that change between machines or environments live in `.env`
in the project root. It is **git-ignored**; `.env.example` is the template.

| Key | Example | Meaning |
|---|---|---|
| `APP_ENV` | `development` | `development`, `staging` or `production` |
| `API_BASE_URL` | `http://192.168.0.165:3000/api` | Backend REST API, no trailing slash. **Must be `https://` when `APP_ENV=production`** (the app refuses to start otherwise) |
| `API_TIMEOUT_MS` | `15000` | Request timeout in ms |
| `MAP_STYLE_URL` | `https://tiles.openfreemap.org/styles/liberty` | Map tiles style |

Values are read once in `src/config/env.ts` and **built into the bundle**.
After editing `.env`:

```sh
yarn start --reset-cache      # restart Metro with a clean cache
```

and rebuild any release app.

**Changing the backend IP:** update `API_BASE_URL` in `.env` **and** the host
in `android/app/src/main/res/xml/network_security_config.xml` (Android
release builds only allow plain HTTP to the hosts listed there).

---

## Running the app

```sh
yarn start --reset-cache      # Metro bundler (keep running)

yarn ios                      # iOS simulator
yarn ios --simulator "iPhone 16 Pro"

yarn android                  # Android emulator / USB device
```

Wireless Android device:

```sh
adb connect <device-ip>:5555
yarn android --device <device-ip>:5555
```

In Metro press **r** to reload, **j** to open React Native DevTools (the
Console shows `[api]` request logs in development).

---

## Release builds

### Android (APK on a device)

```sh
yarn android --mode release --device <device-id>
```

The APK is written to `android/app/build/outputs/apk/release/`. The project
currently signs release builds with the debug key; set up a release
keystore (kept **out of git**) before publishing to the Play Store.

### iOS

Open `ios/Admetrics.xcworkspace` in Xcode, choose a device or *Any iOS
Device*, set your signing team, then **Product → Archive**.

### Before a production release

- `APP_ENV=production` and an `https://` `API_BASE_URL`
- Remove the development host from `network_security_config.xml`
- Bump `versionName` / `versionCode` (Android) and version / build (iOS)

---

## Checks and tests

```sh
yarn lint          # ESLint
npx tsc --noEmit   # TypeScript
yarn test          # Jest
```

Tests live in `__tests__/`; native modules are mocked in `__mocks__/` and
mapped in `jest.config.js`.

---

## Project structure

```
.
├── App.tsx                 root: store, safe area, bottom sheets, alerts
├── .env.example            environment template
├── android/  ios/          native projects
├── patches/                patch-package fixes for dependencies
├── assets/                 fonts, images, icons
├── __tests__/  __mocks__/  Jest tests and native-module mocks
└── src/
    ├── api/                HTTP client, endpoints, errors, auth API
    ├── config/             env.ts (reads .env), maps
    ├── constants/          strings (all UI text), field limits, mock data
    ├── components/         UI building blocks
    │   ├── shared/         buttons, inputs, sheets, pickers, alerts …
    │   ├── auth/ clinic/ home/ revenue/ settings/ support/
    ├── screens/            auth, clinic, home, revenue, settings, account
    ├── navigation/         root / auth / app stacks, tabs, route types
    ├── hooks/              useAuth, useBiometry, useClinicRegistration …
    ├── services/           session (Keychain), biometrics, location
    ├── store/              Redux store and slices
    ├── theme/              colours (light/dark), typography, themed styles
    ├── types/              shared types and env declarations
    ├── utils/              validation, input masks, pincode lookup, helpers
    └── data/               bundled India Post pincode directory
```

---

## API layer

Every backend call goes through `src/api`; screens never call `fetch`.

| File | Purpose |
|---|---|
| `endpoints.ts` | All backend paths (`ENDPOINTS.auth.login` …) |
| `client.ts` | `http.get / post / put / patch / delete / upload` |
| `errors.ts` | `ApiError` with `status`, `code`, `fields`, `requestId` |
| `constants.ts` | HTTP methods, status codes, headers, error codes |
| `logger.ts` | Development request log with secrets hidden |
| `auth.ts` | Signup, login, MFA, refresh, logout, password |
| `mou.ts` | MOU PDF, signature upload, signed PDF link |

```ts
import { http, ENDPOINTS } from '../api';

// Public call
await http.post(ENDPOINTS.auth.login, { body: { email, password } });

// Signed-in call: token added automatically, refreshed once on 401
await http.get(path, { auth: true, query: { take: 20, skip: 0 } });

// Multipart upload
await http.upload(path, formData, { auth: true });
```

Failures are `ApiError`. Show `apiErrorMessage(error, step)`
(`src/utils/apiErrorMessage.ts`) to the user and `error.fields[name]` under
form fields.

**Adding an API:** add the path to `endpoints.ts`, add a module next to
`auth.ts` that calls `http.*`, export it from `src/api/index.ts`, and add a
test with a mocked `fetch`.

---

## Authentication flow

```
Sign up   email → emailed code → create password (12–64 chars)
Log in    email + password
          ├─ first login:  scan QR / enter key in an authenticator app → code
          └─ later logins: current authenticator code
Session   access + refresh tokens in the Keychain only;
          expired access token is refreshed automatically;
          refresh failure → back to Log In
Log out   ends the session on the server, then clears the device
```

---

## Conventions

- **No hard-coded values:** text in `src/constants/strings.ts`, colours in
  `src/theme/colors.ts`, font weights in `src/theme/typography.ts`, field
  lengths in `src/constants/fieldLimits.ts`, URLs in `.env`.
- **Theming:** create styles with `themedStyles(() => StyleSheet.create(…))`
  so they follow light / dark mode.
- **Sizes:** use `scale`, `verticalScale`, `normalizeFont`
  (`src/utils/responsive.ts`).
- **Sheets and dialogs:** `BottomSheet` / `StatusSheet` and `appAlert()`
  instead of `Alert.alert`.
- **Secrets:** never commit `.env`, keystores or tokens; never log tokens.
- Run lint, type-check and tests before pushing.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Can't reach the Admetrics server" | Check `API_BASE_URL`; the backend must listen on `0.0.0.0` (not only `localhost`) and allow port 3000 through its firewall; restart Metro after changing `.env` |
| `.env` change has no effect | `yarn start --reset-cache`; rebuild release apps |
| Android release: network error, debug works | Add the backend host to `network_security_config.xml` and rebuild |
| Metro: "Unable to resolve module …" | `yarn install`, then `yarn start --reset-cache` |
| iOS build fails after pulling | `cd ios && pod install`; clean build folder in Xcode |
| Port 8081 in use | `lsof -ti:8081 \| xargs kill` |
| Simulator shows no keyboard | Simulator → I/O → Keyboard → Toggle Software Keyboard |
| Camera error on QR scan | `yarn install` (re-applies `patches/`), reset Metro cache |

Full clean: `yarn clean:all` (removes `node_modules`, Pods, lockfile and
reinstalls).

---

## Backend status

| Area | Status |
|---|---|
| Auth: signup, login, MFA, refresh, logout, forgot / change password | Connected to the backend |
| Clinics, photos, MOU signing, devices, bank account, support, revenue | Screens ready; using local / mock data until the APIs are available |

When a new API is delivered, add it to `src/api` as described above and
replace the local service it stands in for.
