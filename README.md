# AeroFatigue – Aviation Crew Fatigue Management System

[![Netlify Status](https://api.netlify.com/api/v1/badges/36ced440-b8ef-455a-a964-d459f869969f/deploy-status)](https://app.netlify.com/projects/aerofatigue/deploys)

Operational Fatigue Risk Monitoring & Real-time Telemetry Portal for **Air Crew** and **Ground Crew**.

---

## Key Features

- **Landing Portal**: Aviation gateway with quick launch and cloud sync status indicator.
- **Omni-Search Bar**: Instant search across both Air Crew and Ground Crew by Name, Personnel ID, Role, or Unit.
- **Individual Crew Security**: Unique password-protected dashboards for every crew member.
- **Admin Command Center**: Unified cross-fleet supervision, master fatigue logs table, and credential administration (ID: INAS336).
- **Cartesian Fatigue Graph**: Precision Cartesian coordinate graph plotting fatigue scores (0-100) over time with color-coded risk bands.
- **Google Firebase Cloud Sync**: Real-time cross-device data synchronization using Cloud Firestore, complete with offline local fallback.
- **Firebase Authentication**: Support for both Google Sign-In and Email/Password crew accounts.
- **100% Client-Side & Responsive**: Works out of the box in any browser on desktop, tablet, and mobile.

---

## Quick Start (Local)

Simply double-click or open `index.html` or `standalone.html` in any web browser. No web server, node installation, or build step required!

---

## Google Firebase Cloud Setup

1. Open [Firebase Console](https://console.firebase.google.com/) and create a free project (`aerofatigue-portal`).
2. In **Firestore Database**, click **Create database** (Start in Test Mode).
3. In **Authentication** > **Sign-in method**, enable **Email/Password** and **Google**.
4. In **Project Settings**, register a Web App (`</>`) to get your `firebaseConfig` object.
5. In AeroFatigue, click **`🔥 Cloud Sync`** in the top navigation bar, paste your configuration, and click **Connect & Save**.
6. Click **`🚀 Upload Local Data to Firebase`** to seed initial aircrew, ground crew, and fatigue records.

---

## Deploy Online Free

### 1. Netlify
- Netlify auto-deploys from the `main` branch via continuous deployment.
- Live Netlify Deploys: [https://app.netlify.com/projects/aerofatigue/deploys](https://app.netlify.com/projects/aerofatigue/deploys)

### 2. GitHub Pages
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Branch**, select `main` and root `/`, then click **Save**.
3. Your portal will be live at `https://harishtiwari2899-cpu.github.io/aerofatigue-portal/`.

### 3. Firebase Hosting
- Run `firebase deploy --only hosting` to publish to `https://aerofatigue-portal.web.app`.
