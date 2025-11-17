# BuddyTixTracker Design Document

## Overview

Mobile-first web app for tracking $20 comedy show ticket debt between friends.

## Core Concept

- Each transaction is either:
  - **Ticket**: +$20 (buddy owes you)
  - **Payment**: -$X (buddy pays you back)
- Running total displayed prominently
- All data in localStorage (no backend)

## User Interface

### Layout

```
┌─────────────────────────────┐
│    BuddyTixTracker 🎟️      │
├─────────────────────────────┤
│                             │
│   [Calendar View]           │
│   - Shows all dates         │
│   - Highlights dates with   │
│     transactions            │
│   - Click date = view txns  │
│                             │
├─────────────────────────────┤
│                             │
│  [ + ]        [ $ ]         │
│  Add Ticket   Add Payment   │
│                             │
├─────────────────────────────┤
│  Current Balance: $XXX      │
│  (buddy owes you)           │
└─────────────────────────────┘
```

### Interactions

**Add Ticket (+) Button:**
- Click once = Add 1 ticket ($20) for today
- Click multiple times = Multiple tickets same day
- Shows quick feedback ("+$20")

**Add Payment ($) Button:**
- Opens modal with number input
- User enters payment amount
- Subtracts from balance
- Shows feedback ("-$X")

**Calendar:**
- Default view: Current month
- Dates with transactions: Highlighted/badged
- Click date: Show transaction list for that day
- Navigation: < > arrows for prev/next month

## Data Model

```typescript
interface Transaction {
  id: string;           // UUID
  date: string;         // ISO date string (YYYY-MM-DD)
  type: 'ticket' | 'payment';
  amount: number;       // 20 for tickets, custom for payments
  timestamp: number;    // Unix timestamp for sorting
}

interface AppState {
  transactions: Transaction[];
  balance: number;      // Calculated from transactions
}
```

## Storage

- localStorage key: `buddyTixTracker`
- Data: JSON string of transactions array
- Balance: Calculated on load/update

## Calculations

```typescript
balance = sum of all transactions where:
  - tickets add $20
  - payments subtract payment amount
```

## Technical Architecture

### Tech Stack
- **Vite**: Fast dev server, optimized builds
- **React**: UI components
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **date-fns**: Date manipulation
- **UUID**: Transaction IDs

### File Structure

```
src/
├── App.tsx              # Main app component
├── components/
│   ├── Calendar.tsx     # Calendar view
│   ├── AddButton.tsx    # + and $ buttons
│   ├── Balance.tsx      # Current balance display
│   └── PaymentModal.tsx # Payment input modal
├── hooks/
│   └── useTransactions.tsx  # Transaction state management
├── types/
│   └── index.ts         # TypeScript types
├── utils/
│   └── storage.ts       # localStorage helpers
└── main.tsx             # App entry point
```

### State Management

- React useState + useEffect
- Custom hook: `useTransactions()`
- Automatic localStorage sync

### Mobile Optimization

- Large touch targets (min 48px)
- Responsive font sizes
- No hover states (touch-only)
- Portrait orientation optimized
- Fast, minimal animations

## Color Scheme

Simple, high-contrast for mobile readability:
- Background: White (#FFFFFF)
- Text: Dark gray (#1F2937)
- Primary (buttons): Blue (#3B82F6)
- Success (positive): Green (#10B981)
- Warning (negative): Red (#EF4444)
- Border: Light gray (#E5E7EB)

## Implementation Plan

### Phase 1 - MVP (Start Here)
1. Basic layout with balance display ✅
2. Add ticket button (+) ✅
3. Add payment button ($) with modal ✅
4. localStorage persistence ✅
5. Transaction list view ✅

### Phase 2 - Calendar
1. Simple calendar grid
2. Highlight dates with transactions
3. Month navigation
4. Date click → transaction detail

### Phase 3 - Polish
1. Mobile touch optimizations
2. Animations/transitions
3. Error handling
4. Loading states

## Future Enhancements (Not MVP)

- Export data to CSV
- Multiple buddies
- Notes per transaction
- Dark mode
- Share via link
- PWA install prompt
