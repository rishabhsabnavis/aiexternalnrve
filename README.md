# 🎮 Rhyme Racer

A high-energy, rhythm-based lyric completion game where players tap rhyming words in beat to race across a music highway.

## 🎵 Game Concept

- **Objective**: Complete lyric lines by tapping rhyming words in rhythm
- **Duration**: ~90 seconds per session
- **Mechanics**: Tap-based gameplay with beat synchronization
- **Scoring**: Rhyme accuracy, beat sync, tone matching, and reaction speed

## 🏗️ Architecture

### Frontend (React)
- Mobile-optimized UI with touch controls
- Real-time beat visualization
- Responsive design for various screen sizes
- Game state management with React hooks

### Backend (FastAPI)
- RESTful API for game data
- Scoring algorithms for rhyme accuracy and beat sync
- Session management and leaderboards
- Ready for AWS deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- pip

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📊 Game Metrics

1. **Rhyme Accuracy Score**: % of rhymes that match phonetically and contextually
2. **Beat Sync Accuracy**: Average timing offset in milliseconds
3. **Tone Match Score**: AI-estimated match between chosen rhyme and lyric tone (0-1 scale)
4. **Reaction Speed Average**: Average time between lyric display and word choice

## 🎯 Features

- Real-time beat synchronization
- Dynamic difficulty progression
- Visual feedback for timing and accuracy
- Leaderboard system
- Mobile-optimized touch controls
- Session replay and analytics

## 🏆 Scoring System

- Perfect rhyme + perfect timing = Speed boost
- Weak rhyme or missed beat = Speed reduction
- Streak bonuses for consistent performance
- Daily leaderboards

## 📱 Mobile Optimization

- Touch-friendly interface
- Responsive design
- Optimized for portrait orientation
- Fast loading and smooth animations

## 🔧 Development

### Project Structure
```
game/
├── frontend/          # React application
├── backend/           # FastAPI server
├── shared/            # Shared types and utilities
└── docs/             # Documentation
```

### Key Technologies
- **Frontend**: React, TypeScript, Styled Components
- **Backend**: FastAPI, Python, SQLAlchemy
- **Deployment**: Docker, AWS-ready
- **Analytics**: Custom scoring algorithms

## 🎮 Game Flow

1. Player starts a 90-second session
2. Lyrics appear with rhyming word options
3. Player taps words in rhythm with the beat
4. Real-time feedback on accuracy and timing
5. Final score and analytics displayed
6. Option to replay or view leaderboard

## 📈 Future Enhancements

- AWS deployment with auto-scaling
- Real-time multiplayer features
- Advanced AI for dynamic lyric generation
- Social features and achievements
- Custom beat creation tools 