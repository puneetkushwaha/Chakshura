# Project Setup & Run Guide

This document explains how to set up and run the project locally on your system.

---

## Prerequisites

Before starting, ensure the following tools are installed on your system:

* **Node.js** (v18 or above recommended)
* **npm** (comes bundled with Node.js)
* **Visual Studio Code (VS Code)**

---

## Step-by-Step Setup

### 1. Open the Project in VS Code

1. Launch **Visual Studio Code**
2. Open the **project root folder** in VS Code

---

### 2. Create Required Configuration Files

Inside the **root directory** of the project, create the following files **exactly with these names**:

* `.env`
* `.env.local`
* `.gitignore`

> ⚠️ **Important:** File names (including dots) must be exactly the same.

---

### 3. Configure `.env` File

Paste the following content into the `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSyA5uisAAYS-B2HZGwzI4iGbMnBxd3buwq0
VITE_FIREBASE_AUTH_DOMAIN=chak-shura.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chak-shura
VITE_FIREBASE_STORAGE_BUCKET=chak-shura.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=616434260720
VITE_FIREBASE_APP_ID=1:616434260720:web:a1d6678358c4ce45878035

MONGO_URI=mongodb+srv://demon:god@cluster0.iypjzms.mongodb.net/intel_dashboard?retryWrites=true&w=majority&appName=Cluster0
MONGO_DB_NAME=intel_dashboard
PATENTS_COLLECTION=patents
PATENT_DOMAINS_COLLECTION=patent_domains

PUBLICATIONS_DB=intel_dashboard
PUBLICATIONS_COLLECTION=publications
PUBLICATIONS_CSV=ml/publication_intel/data/public.csv
```

---

### 4. Configure `.env.local` File

Paste the following content into the `.env.local` file:

```env
VITE_API_BASE_URL="http://localhost:5001"
```

---

### 5. Configure `.gitignore` File

Paste the following content into the `.gitignore` file:

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## Running the Project

### 6. Install Dependencies

Open the **VS Code terminal** and run:

```bash
npm install
```

---

### 7. Start the Backend Server

1. Open a **new terminal** in VS Code
2. Run the following commands:

```bash
cd server
npm run dev
```

This will start the backend server.

---

### 8. Start the Frontend Application

1. Go back to the **first terminal** (where `npm install` was executed)
2. Run:

```bash
npm run dev
```

This will start the frontend application.

---

## Accessing the Application

* After starting the frontend, a **localhost URL** will be displayed in the terminal
* Example:

```
http://localhost:5173
```

* Open this URL in your browser to view and use the application

---

## Completion Status

✅ The project should now be running successfully on your local machine.

If any issue occurs, recheck the file names, environment variables, and running terminals carefully.
