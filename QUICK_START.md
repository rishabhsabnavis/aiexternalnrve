# 🚀 Quick Start Guide

Get Rhyme Racer running in under 5 minutes!

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.9+** - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

## Option 1: One-Click Setup (Recommended)

```bash
# Make setup script executable and run it
chmod +x setup.sh
./setup.sh
```

This will:
- ✅ Install all dependencies
- ✅ Start the backend server (port 8000)
- ✅ Start the frontend server (port 3000)
- ✅ Open the game in your browser

## Option 2: Manual Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🎮 Play the Game

1. **Open your browser** to `http://localhost:3000`
2. **Enter your name** and click "Start Racing!"
3. **Tap rhyming words** in rhythm with the beat
4. **Watch your score** and metrics improve!

## 🏗️ Architecture

```
game/
├── frontend/          # React app (port 3000)
│   ├── src/
│   │   ├── components/  # Game screens
│   │   └── App.tsx      # Main app
├── backend/           # FastAPI server (port 8000)
│   ├── main.py        # API endpoints
│   ├── scoring.py     # Game algorithms
│   └── models.py      # Database models
└── setup.sh          # One-click setup
```

## 🎯 Game Features

- **Real-time beat synchronization**
- **Rhyme accuracy scoring**
- **Tone matching algorithms**
- **Mobile-optimized UI**
- **Leaderboard system**
- **90-second game sessions**

## 📊 Game Metrics

The game tracks 4 key metrics:

1. **Rhyme Accuracy** - How well your words rhyme
2. **Beat Sync** - Timing precision with the rhythm
3. **Tone Match** - Contextual appropriateness
4. **Reaction Speed** - Response time in milliseconds

## 🔧 Development

### API Documentation
Visit `http://localhost:8000/docs` for interactive API docs

### Hot Reload
Both frontend and backend support hot reloading during development

### Database
SQLite database is automatically created in `backend/rhyme_racer.db`

## 🐳 Docker Deployment

```bash
# Build and run with Docker
docker-compose up --build

# Or build the image manually
docker build -t rhyme-racer .
docker run -p 8000:8000 rhyme-racer
```

## 📱 Mobile Testing

The game is optimized for mobile devices. Test on:
- **iOS Safari**
- **Android Chrome**
- **Desktop browsers**

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Node.js Version Issues
```bash
# Use nvm to install Node.js 18+
nvm install 18
nvm use 18
```

### Python Dependencies
```bash
# Upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

## 🎉 Ready to Race!

Your Rhyme Racer game is now running! 

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

Enjoy the rhythm! 🎵 