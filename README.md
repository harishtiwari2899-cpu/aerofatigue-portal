# AeroFatigue – Aviation Crew Fatigue Management System

Operational Fatigue Risk Monitoring & Real-time Telemetry Portal for **Air Crew** and **Ground Crew**.

---

## Key Features

- **Landing Portal**: Aviation gateway with quick launch and cloud sync status indicator.
- **Omni-Search Bar**: Instant search across both Air Crew and Ground Crew by Name, Personnel ID, Role, or Unit.
- **Individual Crew Security**: Unique password-protected dashboards for every crew member.
- **Admin Command Center**: Unified cross-fleet supervision, master fatigue logs table, and credential administration (ID: INAS336).
- **Cartesian Fatigue Graph**: Precision Cartesian coordinate graph plotting fatigue scores (0-100) over time with color-coded risk bands.
- **Google Firebase Cloud Sync**: Real-time cross-device data synchronization using Cloud Firestore, complete with offline local fallback.
- **100% Client-Side & Responsive**: Works out of the box in any browser on desktop, tablet, and mobile.

---

## Quick Start (Local)

Simply double-click or open `index.html` or `standalone.html` in any web browser. No web server, node installation, or build step required!

---

## Google Firebase Cloud Setup

1. Open [Firebase Console](https://console.firebase.google.com/) and create a free project.
2. In **Firestore Database**, click **Create database** (Start in Test Mode).
3. In **Project Settings**, register a Web App (`</>`) to get your `firebaseConfig` object.
4. In AeroFatigue, click **`🔥 Cloud Sync`** in the top navigation bar, paste your configuration, and click **Connect & Save**.
5. Click **`🚀 Upload Local Data to Firebase`** to seed initial aircrew, ground crew, and fatigue records.

---

## Deploy Online Free

### 1. GitHub Pages
1. Push this repository to your GitHub account.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. Your portal will be live at `https://<your-username>.github.io/<repo-name>/`.

### 2. Netlify
- Drag and drop this folder at [app.netlify.com/drop](https://app.netlify.com/drop).

### 3. Firebase Hosting
- Run `npm install -g firebase-tools`
- Run `firebase login` and `firebase deploy`
