# Skribbl.io Clone

A real-time multiplayer drawing and guessing game inspired by Skribbl.io. Players can create or join rooms, take turns drawing secret words, and guess what other players are drawing through live chat.

## Features

- Create and join multiplayer rooms.
- Real-time drawing using a shared canvas.
- Multiple word choices for each drawing turn.
- Live chat and word guessing.
- Automatic correct-guess detection.
- Round timers and scoring system.
- Player leaderboard and game results.
- Host controls for ending rounds and starting the next turn.
- Player disconnection handling.
- Drawing tools, colors, brush sizes, and eraser.
- Responsive game interface.

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Socket.IO Client

**Backend**
- Node.js
- Express
- Socket.IO

## Project Structure

```text
skribbl-clone/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── classes/
│   │   ├── services/
│   │   └── socket/
│   └── package.json
│
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/riyasingh49/skribbl-clone.git
cd skribbl-clone
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Running the Application

Start the backend using its configured start script:

```bash
cd server
npm start
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite in your browser.

## How to Play

1. Create a room or join an existing room.
2. Wait for at least two players.
3. The drawer selects one of the available words.
4. The drawer illustrates the selected word on the canvas.
5. Other players submit guesses through chat.
6. Players earn points for correct guesses.
7. The host can end a round and start the next turn.
8. The game displays the leaderboard and final results.

## Deployment

The frontend can be deployed on Vercel and the Socket.IO backend on Render.

Configure the frontend to connect to the deployed backend URL. Configure the backend to accept the deployed frontend origin through CORS and support WebSocket connections.

Set all required environment variables in the hosting dashboards. Never commit secrets or private credentials to GitHub.

## Author

Riya Singh

## Repository

https://github.com/riyasingh49/skribbl-clone
