# Mobile Fast Text Reader (PWA)

A slick, phone‑optimized **PWA** for rapid reading in two modes: **RSVP** (one‑word‑at‑a‑time) and **Scroll** (continuous with auto‑scroll). Fully offline‑capable, with settings stored locally in **IndexedDB (Dexie)**. Built with **React + Vite + Tailwind + vite-plugin-pwa**.

**Live demo:** https://HanKM-99.github.io/Mobile-Fast-Text-Reader-Beta/

## ✨ Features
- **Two reading modes**: RSVP (single word) and Scroll (continuous)
- **Auto‑scroll** with speed control (px/sec)
- **Single tap** play/pause, **double tap** to enter/exit fullscreen
- **Dark/Light theme** with persistence
- Import **.txt / .pdf / .epub** (PDF/EPUB parsed client‑side)
- **Fully offline** (PWA, service worker) & installable
- **Mobile‑first** UI with sticky bottom controls

## 📦 Tech
- React 18, Vite 5
- Tailwind CSS
- Dexie (IndexedDB)
- vite-plugin-pwa

## 🚀 Quick Start (Local)
```bash
# 1) Install
npm i

# 2) Dev (http://localhost:5173)
npm run dev

# 3) Build for production
npm run build

# 4) Preview the build
npm run preview