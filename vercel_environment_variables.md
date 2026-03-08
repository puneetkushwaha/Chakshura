# Vercel Environment Variables Setup Guide

In Vercel, navigate to your Project Dashboard -> **Settings** -> **Environment Variables**. 
Add the following key-value pairs exactly as written below. Copy the values from your local `.env` file.

## 1. Frontend (Vite) Variables

**Groq API Key (Used by ChatPage for AI generation)**
- **Key:** `VITE_GROQ_API_KEY`
- **Value:** *(Found in your .env or provided in chat)*

**Backend Base URL**
- **Key:** `VITE_API_BASE_URL`
- **Value:** `/api`

**Firebase Configuration (Required for Login/Auth)**
Copy these from your root `.env` file:
- **Key:** `VITE_FIREBASE_API_KEY`
- **Key:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Key:** `VITE_FIREBASE_PROJECT_ID`
- **Key:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Key:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Key:** `VITE_FIREBASE_APP_ID`

---

## 2. Backend Server Variables

**Groq API Key (Used by the server.js /api/generate endpoint)**
- **Key:** `API_KEY`

**MongoDB Connection String**
- **Key:** `MONGO_URI`

---

## Important Final Step:
After adding all environment variables, go to the **Deployments** tab in Vercel and **Redeploy** your latest commit. Vercel will only inject these new variables upon a fresh deployment.
