from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class GameSession(Base):
    """Model for storing game session data"""
    __tablename__ = "game_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, index=True)
    player_name = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="medium")
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    total_score = Column(Integer, default=0)
    is_completed = Column(Integer, default=0)  # 0 = active, 1 = completed

class PlayerScore(Base):
    """Model for storing player scores and metrics"""
    __tablename__ = "player_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, index=True)
    player_name = Column(String(100), nullable=False)
    total_score = Column(Integer, default=0)
    rhyme_accuracy = Column(Float, default=0.0)
    beat_sync_accuracy = Column(Float, default=0.0)
    tone_match_score = Column(Float, default=0.0)
    reaction_speed_avg = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class GameChoice(Base):
    """Model for storing individual player choices during gameplay"""
    __tablename__ = "game_choices"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), index=True)
    lyric_id = Column(String(100), nullable=False)
    chosen_word = Column(String(100), nullable=False)
    correct_word = Column(String(100), nullable=False)
    tap_timestamp = Column(Float, nullable=False)
    beat_timestamp = Column(Float, nullable=False)
    timing_offset = Column(Float, default=0.0)
    rhyme_accuracy = Column(Float, default=0.0)
    beat_accuracy = Column(Float, default=0.0)
    tone_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow) 