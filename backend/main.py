from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import time
import json
from datetime import datetime
import uuid

# Game scoring and rhyme detection imports
from scoring import RhymeScorer, BeatScorer, ToneMatcher
from models import GameSession, PlayerScore
from database import get_db, engine
import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rhyme Racer API",
    description="Backend API for the Rhyme Racer rhythm game",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scoring components
rhyme_scorer = RhymeScorer()
beat_scorer = BeatScorer()
tone_matcher = ToneMatcher()

# Pydantic models for API requests/responses
class GameStartRequest(BaseModel):
    player_name: str
    difficulty: str = "medium"

class LyricResponse(BaseModel):
    lyric_id: str
    lyric_text: str
    options: List[str]
    correct_rhyme: str
    beat_timing: float
    session_id: str

class PlayerChoice(BaseModel):
    session_id: str
    lyric_id: str
    chosen_word: str
    tap_timestamp: float
    beat_timestamp: float

class GameEndRequest(BaseModel):
    session_id: str
    total_score: int
    final_metrics: Dict[str, Any]

class GameMetrics(BaseModel):
    rhyme_accuracy_score: float
    beat_sync_accuracy: float
    tone_match_score: float
    reaction_speed_avg: float

# Game state storage (in production, use Redis or database)
active_sessions: Dict[str, Dict] = {}

@app.get("/")
async def root():
    return {"message": "Rhyme Racer API is running! 🎮"}

@app.post("/game/start", response_model=LyricResponse)
async def start_game(request: GameStartRequest):
    """Start a new game session and return the first lyric"""
    session_id = str(uuid.uuid4())
    
    # Create session record
    session = GameSession(
        session_id=session_id,
        player_name=request.player_name,
        difficulty=request.difficulty,
        start_time=datetime.utcnow()
    )
    
    # Store session data
    active_sessions[session_id] = {
        "player_name": request.player_name,
        "difficulty": request.difficulty,
        "start_time": time.time(),
        "choices": [],
        "current_lyric_index": 0
    }
    
    # Generate first lyric
    lyric_data = generate_lyric(session_id, 0)
    
    return LyricResponse(
        lyric_id=lyric_data["lyric_id"],
        lyric_text=lyric_data["lyric_text"],
        options=lyric_data["options"],
        correct_rhyme=lyric_data["correct_rhyme"],
        beat_timing=lyric_data["beat_timing"],
        session_id=session_id
    )

@app.post("/game/choice")
async def submit_choice(choice: PlayerChoice):
    """Process player's word choice and return scoring feedback"""
    if choice.session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[choice.session_id]
    
    # Calculate timing accuracy
    timing_offset = abs(choice.tap_timestamp - choice.beat_timestamp)
    beat_accuracy = max(0, 1 - (timing_offset / 500))  # 500ms tolerance
    
    # Calculate rhyme accuracy
    rhyme_accuracy = rhyme_scorer.calculate_rhyme_accuracy(
        choice.chosen_word, 
        session.get("current_lyric", "")
    )
    
    # Calculate tone match
    tone_score = tone_matcher.calculate_tone_match(
        choice.chosen_word,
        session.get("current_lyric", "")
    )
    
    # Store choice data
    session["choices"].append({
        "lyric_id": choice.lyric_id,
        "chosen_word": choice.chosen_word,
        "tap_timestamp": choice.tap_timestamp,
        "beat_timestamp": choice.beat_timestamp,
        "timing_offset": timing_offset,
        "rhyme_accuracy": rhyme_accuracy,
        "tone_score": tone_score,
        "beat_accuracy": beat_accuracy
    })
    
    # Calculate feedback
    feedback = calculate_feedback(rhyme_accuracy, beat_accuracy, tone_score)
    
    return {
        "feedback": feedback,
        "metrics": {
            "rhyme_accuracy": rhyme_accuracy,
            "beat_accuracy": beat_accuracy,
            "tone_score": tone_score,
            "timing_offset": timing_offset
        },
        "speed_boost": feedback.get("speed_boost", 0)
    }

@app.post("/game/end")
async def end_game(request: GameEndRequest):
    """End game session and calculate final metrics"""
    if request.session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[request.session_id]
    choices = session["choices"]
    
    # Calculate final metrics
    final_metrics = calculate_final_metrics(choices)
    
    # Save to database
    player_score = PlayerScore(
        session_id=request.session_id,
        player_name=session["player_name"],
        total_score=request.total_score,
        rhyme_accuracy=final_metrics["rhyme_accuracy_score"],
        beat_sync_accuracy=final_metrics["beat_sync_accuracy"],
        tone_match_score=final_metrics["tone_match_score"],
        reaction_speed_avg=final_metrics["reaction_speed_avg"],
        created_at=datetime.utcnow()
    )
    
    # Clean up session
    del active_sessions[request.session_id]
    
    return {
        "final_metrics": final_metrics,
        "message": "Game completed successfully!"
    }

@app.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top player scores"""
    # In production, query database
    return {
        "leaderboard": [
            {"player": "Player1", "score": 9500, "accuracy": 0.92},
            {"player": "Player2", "score": 8900, "accuracy": 0.88},
            {"player": "Player3", "score": 8200, "accuracy": 0.85},
        ]
    }

def generate_lyric(session_id: str, lyric_index: int) -> Dict:
    """Generate a lyric with rhyming options"""
    lyrics = [
        {
            "lyric_text": "I'm moving fast like a flash of ___",
            "options": ["trash", "cash", "dash"],
            "correct_rhyme": "dash",
            "beat_timing": 1.0
        },
        {
            "lyric_text": "The rhythm flows like a river of ___",
            "options": ["gold", "soul", "flow"],
            "correct_rhyme": "flow",
            "beat_timing": 1.2
        },
        {
            "lyric_text": "My words hit hard like a hammer of ___",
            "options": ["steel", "feel", "real"],
            "correct_rhyme": "steel",
            "beat_timing": 0.8
        }
    ]
    
    lyric_data = lyrics[lyric_index % len(lyrics)]
    
    return {
        "lyric_id": f"lyric_{lyric_index}",
        "lyric_text": lyric_data["lyric_text"],
        "options": lyric_data["options"],
        "correct_rhyme": lyric_data["correct_rhyme"],
        "beat_timing": lyric_data["beat_timing"]
    }

def calculate_feedback(rhyme_accuracy: float, beat_accuracy: float, tone_score: float) -> Dict:
    """Calculate game feedback based on player performance"""
    total_score = (rhyme_accuracy + beat_accuracy + tone_score) / 3
    
    if total_score > 0.9:
        return {
            "message": "🔥 Perfect! Great flow!",
            "speed_boost": 1.5,
            "color": "green"
        }
    elif total_score > 0.7:
        return {
            "message": "👍 Nice! Keep the rhythm!",
            "speed_boost": 1.2,
            "color": "blue"
        }
    elif total_score > 0.5:
        return {
            "message": "⚠️ Almost there!",
            "speed_boost": 1.0,
            "color": "yellow"
        }
    else:
        return {
            "message": "💥 Missed the beat!",
            "speed_boost": 0.5,
            "color": "red"
        }

def calculate_final_metrics(choices: List[Dict]) -> Dict[str, float]:
    """Calculate final game metrics"""
    if not choices:
        return {
            "rhyme_accuracy_score": 0.0,
            "beat_sync_accuracy": 0.0,
            "tone_match_score": 0.0,
            "reaction_speed_avg": 0.0
        }
    
    rhyme_scores = [choice["rhyme_accuracy"] for choice in choices]
    beat_scores = [choice["beat_accuracy"] for choice in choices]
    tone_scores = [choice["tone_score"] for choice in choices]
    reaction_times = [choice["timing_offset"] for choice in choices]
    
    return {
        "rhyme_accuracy_score": sum(rhyme_scores) / len(rhyme_scores),
        "beat_sync_accuracy": sum(beat_scores) / len(beat_scores),
        "tone_match_score": sum(tone_scores) / len(tone_scores),
        "reaction_speed_avg": sum(reaction_times) / len(reaction_times)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 