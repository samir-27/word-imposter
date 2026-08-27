# 🕵️‍♂️ Word Imposter — Real-Time Multiplayer Party Game

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge\&logo=socket.io\&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vitejs.dev/)

> A real-time, server-authoritative social deduction game built from scratch with **React**, **TypeScript**, **Node.js**, **Socket.IO**, and **Tailwind CSS**. Playable across multiple devices on the same local network via instant QR code onboarding.

---

## 🎮 Game Concept & Rules

**Word Imposter** is a hidden-role social deduction party game inspired by games such as Spyfall and Chameleon. It is designed for **3+ players**.

### 1. Role & Secret Word Distribution

* Most players receive the **Innocent Word**.

  * Example: `"Pizza"`
* Exactly one player is randomly designated as the **Imposter**.
* The Imposter receives a related **decoy word**.

  * Example: `"Burger"`
* Roles and secret words are privately distributed by the server.
* A client never receives another player's secret role or word.

### 2. Turn-Based Clue Giving

The game consists of up to **3 clue rounds**.

* Players take turns giving a short clue.
* The goal is to prove that you know the word without making it too obvious to the Imposter.
* Each turn is controlled by an authoritative **30-second server-side timer**.
* The server determines whose turn it is and validates all clue submissions.

### 3. Voting Phase 1

After Round 2, players enter the first voting phase.

Players can:

* Vote for the player they believe is the Imposter.
* Choose **"Another Round"**.

Rules:

* If one player receives the strict highest number of votes, that player's role is revealed immediately.
* If there is a tie for the highest vote count, the game proceeds to Round 3.
* If **"Another Round"** receives the highest number of votes, the game proceeds to Round 3.
* Round 3 is the final clue round.

### 4. Final Voting

After Round 3, players enter the final voting phase.

* There is no **"Another Round"** option.
* Players must vote for a suspected Imposter.
* If a single player receives the strict highest number of votes:

  * If they are the Imposter → **Innocents Win**
  * If they are not the Imposter → **Imposter Wins**
* If the final vote results in a tie → **Imposter Wins**

---

## ✨ Key Features

### 🛡️ Server-Authoritative Game Engine

The server is the single source of truth for the game.

* Prevents client-side game manipulation.
* Prevents players from skipping phases.
* Validates player actions.
* Controls turns and timers.
* Controls role assignment.
* Controls voting and win conditions.
* Uses a deterministic **Finite State Machine (FSM)**.

### ⚡ Real-Time Multiplayer

Powered by **Socket.IO** for real-time communication.

* Instant room updates.
* Real-time player synchronization.
* Live clue submission.
* Real-time voting updates.
* Server acknowledgements.
* Automatic state synchronization.

### 🔒 End-to-End Type Safety

TypeScript is used across the application.

* Typed Socket.IO events.
* Shared interfaces.
* Strongly typed game states.
* Typed server/client payloads.
* Reduced runtime errors caused by incorrect event data.

### 📱 LAN Multiplayer + QR Onboarding

Players can join from their phones without manually typing the server address.

* Automatically detects the local network IP.
* Generates a dynamic QR code.
* Players scan the QR code using their phone.
* All devices connect through the same Wi-Fi network.

### 🔄 Fault-Tolerant Reconnection

Players can reconnect after temporary disconnections.

* Session tokens identify players.
* Active sessions have a **60-second reconnection grace period**.
* Refreshing the browser does not immediately remove the player.
* Reconnecting players can recover their active game state.

### 🎨 Responsive UI

Built with React and Tailwind CSS.

* Mobile-friendly interface.
* Desktop support.
* Dark-themed game UI.
* Responsive game screens.
* Component-based architecture.

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) v18+
* [Git](https://git-scm.com/)
* npm
* Devices connected to the same Wi-Fi network for LAN multiplayer

---

### 1. Clone the Repository

```bash
git clone https://github.com/samir-27/word-imposter.git
cd word-imposter
```

---

### 2. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

The server also detects and displays your local network address, for example:

```text
http://192.168.1.X:5000
```

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

The Vite server is configured for local network access.

---

## 📱 Playing Over Local Wi-Fi

You can play the game using multiple phones and a computer connected to the same Wi-Fi network.

### Host

1. Open:

```text
http://localhost:5173
```

2. Click **Create New Room**.
3. Wait for the lobby to open.
4. Click **Show Phone QR Code**.

### Other Players

1. Connect your phone to the **same Wi-Fi network** as the host computer.
2. Open the phone camera.
3. Scan the displayed QR code.
4. Enter your player name.
5. Join the room.

No manually typing an IP address required.

---


## 🏗️ Architecture

The application follows a **client-server architecture** where the backend acts as the authoritative game engine.

```text
                         ┌──────────────────────┐
                         │      Browser         │
                         │   React + TypeScript │
                         └──────────┬───────────┘
                                    │
                              Socket.IO
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Backend        │
                         │ Node.js + Express    │
                         │      + Socket.IO     │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              Room Manager    Game Engine     Socket Handlers
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                             Authoritative
                              Game State
```

The client sends **intent/actions** to the server.

The server validates the action, updates the game state, and broadcasts the resulting state to the appropriate players.

---

## 🔄 Game State Machine

The game is controlled using a finite state machine.

```text
LOBBY
  │
  ▼
ROUND_1
  │
  ▼
ROUND_2
  │
  ▼
VOTING_1
  │
  ├───────────────► GAME_OVER
  │
  ▼
ROUND_3
  │
  ▼
FINAL_VOTING
  │
  ▼
GAME_OVER
```

### Game States

| State          | Description                                 |
| -------------- | ------------------------------------------- |
| `LOBBY`        | Players join and wait for the host to start |
| `ROUND_1`      | Players provide their first clues           |
| `ROUND_2`      | Players provide their second clues          |
| `VOTING_1`     | Players vote or choose another round        |
| `ROUND_3`      | Final clue round                            |
| `FINAL_VOTING` | Players make the final Imposter vote        |
| `GAME_OVER`    | Results are revealed                        |

---

## 📁 Repository Structure

```text
word-imposter/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── # Environment variables & runtime validation
│   │   │
│   │   ├── game/
│   │   │   └── # Authoritative game logic, word bank & room store
│   │   │
│   │   ├── sockets/
│   │   │   └── # Socket.IO room & game handlers
│   │   │
│   │   ├── types/
│   │   │   └── # Shared TypeScript event contracts & interfaces
│   │   │
│   │   ├── utils/
│   │   │   └── # LAN IPv4 detection helpers
│   │   │
│   │   └── index.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── # Reusable UI components
│   │   │
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── LobbyScreen.tsx
│   │   │   ├── GameScreen.tsx
│   │   │   ├── VotingScreen.tsx
│   │   │   └── GameOverScreen.tsx
│   │   │
│   │   ├── types/
│   │   │   └── # Client-side TypeScript contracts
│   │   │
│   │   ├── socket.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---


## 🧩 Example Game Flow

Imagine four players join:

```text
Alice
Bob
Charlie
David
```

The server randomly selects:

```text
Innocent Word: Pizza
Imposter Word: Burger
Imposter: Charlie
```

Players then provide clues:

```text
Alice    → "Cheese"
Bob      → "Slice"
Charlie  → "Grill"
David    → "Italian"
```

After Round 2, players vote.

If the vote is:

```text
Alice    → Charlie
Bob      → Charlie
David    → Alice
Charlie  → Alice
```

The result is:

```text
Charlie = 2
Alice   = 2
```

Because there is a tie, the game proceeds to:

```text
ROUND_3
```

After Round 3, the players vote again.

---

## 🛠️ Tech Stack

| Domain       | Technology      | Purpose                                |
| ------------ | --------------- | -------------------------------------- |
| Frontend     | React 18        | Component-based UI                     |
| Build Tool   | Vite            | Fast development and builds            |
| Language     | TypeScript      | Static typing and shared contracts     |
| Styling      | Tailwind CSS v4 | Responsive and mobile-first UI         |
| Backend      | Node.js         | Server runtime                         |
| HTTP         | Express         | HTTP server and middleware             |
| Real-Time    | Socket.IO       | Bi-directional real-time communication |
| Networking   | WebSockets      | Persistent client-server communication |
| QR Code      | `qrcode.react`  | Mobile LAN onboarding                  |
| Architecture | FSM             | Deterministic game-state management    |

---


## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

## 👨‍💻 Author

**Samir**

GitHub: [@samir-27](https://github.com/samir-27)

---

<p align="center">
  Built with React, TypeScript, Node.js, Socket.IO and Tailwind CSS.
</p>
