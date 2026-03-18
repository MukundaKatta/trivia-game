# Trivia Game

A real-time multiplayer trivia game with live lobbies, streaks, and leaderboards.

## Features

- **Real-Time Multiplayer** — Socket.io-powered game rooms with instant synchronization
- **Game Engine** — Server-authoritative scoring with timed questions and answer streaks
- **Lobby System** — Room codes, player cards, chat, and ready-up before matches
- **Live Scoreboard** — Real-time score updates with streak banners and point popups
- **Results & Podium** — Post-game podium, achievements, and detailed stats
- **Leaderboard** — Persistent global rankings across games
- **Player Profiles** — Track personal stats and match history
- **Sound Effects** — Audio feedback for correct/incorrect answers and streaks
- **Monorepo** — Turborepo workspace with shared types between client and server

## Tech Stack

- **Monorepo:** Turborepo with npm workspaces
- **Client:** React + Vite + Tailwind CSS + Zustand
- **Server:** Node.js + Express + Socket.io
- **Shared:** TypeScript types and constants package
- **Testing:** Vitest (game engine, scoring, API tests)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 10+

### Installation

```bash
git clone <repo-url>
cd trivia-game
npm install
```

### Run

```bash
npm run dev          # start both client and server via Turborepo
npm run db:seed      # seed trivia questions
npm test             # run all tests
```

## Project Structure

```
apps/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── game/     # Timer, QuestionCard, ScoreBoard
│       │   ├── lobby/    # PlayerCard, ChatBox, RoomCode
│       │   └── results/  # Podium, AchievementCard, GameStats
│       ├── pages/        # Home, Lobby, Game, Results, Leaderboard
│       ├── stores/       # Zustand game store
│       └── hooks/        # useSocket, useCountdown
├── server/               # Express + Socket.io backend
│   └── src/
│       ├── db/           # Schema, seed, queries
│       ├── services/     # GameEngine
│       ├── events/       # Socket handlers
│       └── routes/       # REST API
packages/
└── shared/               # Shared TypeScript types
```

## License

MIT
