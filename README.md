# BuddyTixTracker

Simple mobile-friendly web app to track comedy show ticket debt.

## What It Does

- Track $20 comedy show tickets your buddy owes you
- Record payments when your buddy pays you back
- See running total of current debt
- View history in calendar view

## Quick Start

```bash
npm install
npm run dev
```

Open in your Android Pixel browser: `http://your-nixos-ip:5173`

## Usage

- **+ Button**: Add 1 ticket ($20) for today. Press multiple times for multiple tickets.
- **$ Button**: Record a payment. Enter custom dollar amount.
- **Bottom Total**: Shows current debt (positive = buddy owes you, negative = you owe buddy)
- **Calendar**: Click any date to see that day's transactions

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS for styling
- localStorage for data persistence (no backend needed)
- Mobile-first responsive design

## Data Storage

All data stored locally in browser localStorage. No server, no database, no cloud.

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Accessing from Android

1. Find your NixOS VM IP: `hostname -I | awk '{print $1}'`
2. Open browser on Android: `http://YOUR-IP:5173`
3. Bookmark for easy access!
