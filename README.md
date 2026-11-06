
# Skribbl.io Clone – Real-Time Multiplayer Drawing Game

A real-time multiplayer drawing and guessing game inspired by Skribbl.io. Players join game rooms, take turns drawing a secret word, and compete to guess the correct word to earn points.

## Features

- Create and join multiplayer game rooms.
- Public and password-protected private rooms.
- Configurable player capacity, rounds, and drawing time.
- Host-controlled game start, round ending, and next turns.
- Random word selection for each drawing round.
- Real-time drawing synchronization using Socket.IO.
- Drawing tools: multiple colors, brush sizes, eraser, undo, and clear canvas.
- Real-time chat and word guessing.
- Hint system for players.
- Countdown timer for drawing rounds.
- Player scoring and leaderboard.
- Automatic round and game completion.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML5 Canvas
- CSS

### Backend
- Node.js
- Express.js
- Socket.IO

### Communication
- WebSockets through Socket.IO for real-time multiplayer events.

## Project Structure

```text
skribble-clone/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── drawing/
│   │   │   ├── game/
│   │   │   └── room/
│   │   ├── hooks/
│   │   │   ├── chat/
│   │   │   ├── drawing/
│   │   │   ├── game/
│   │   │   ├── room/
│   │   │   └── socket/
│   │   ├── socket/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── classes/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
│
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/riyasingh49/skribbl-clone.git
cd skribbl-clone
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment

Create a `.env` file inside the `server` directory:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
```

### 4. Start the backend

```bash
npm run dev
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite, normally:

http://localhost:5173

## How to Play

1. Enter a username.
2. Create a room or join an existing room using its room ID.
3. The room host configures the game settings.
4. The host starts the game when at least two players have joined.
5. The drawer selects a secret word.
6. The drawer sketches the word using the drawing tools.
7. Other players submit guesses through chat.
8. Correct guesses earn points.
9. Players take turns drawing until all rounds are complete.
10. The final leaderboard displays the game results.

## Architecture Overview

The application uses a client-server architecture.

- **React frontend:** Displays the lobby, drawing canvas, chat, game controls, and leaderboard.
- **Express backend:** Hosts the application server and API routes.
- **Socket.IO:** Handles real-time room events, drawing updates, chat messages, guesses, and game-state changes.
- **Game classes and services:** Manage rooms, players, rounds, scoring, hints, timers, and player departures.
- **Custom React hooks:** Separate frontend logic for drawing, rooms, chat, socket communication, and game state.

## Object-Oriented Design

The backend uses classes and service modules to organize game functionality.

- `Player`: Represents an individual player.
- `Room`: Manages room membership, host information, and room settings.
- `Game`: Manages the game lifecycle and current round.
- `RoundManager`: Controls round progression.
- `ScoreManager`: Handles player scoring.
- `HintManager`: Manages word hints.
- `TimerManager`: Controls drawing timers.

## Future Improvements

- Add persistent player accounts.
- Add more drawing tools and shapes.
- Improve mobile responsiveness.
- Deploy the application for online multiplayer access.
- Add additional game themes and word categories.

## Author

Developed as an internship project.
