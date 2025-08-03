import re
from typing import List, Dict, Tuple
import difflib

class RhymeScorer:
    """Calculate rhyme accuracy between words"""
    
    def __init__(self):
        # Common rhyming patterns
        self.rhyme_patterns = {
            "ash": ["dash", "flash", "cash", "trash", "splash"],
            "ow": ["flow", "soul", "gold", "bold", "cold"],
            "eel": ["steel", "feel", "real", "deal", "wheel"],
            "ing": ["sing", "ring", "wing", "thing", "bring"],
            "ight": ["light", "bright", "fight", "night", "sight"],
            "ay": ["day", "way", "say", "play", "stay"],
            "ee": ["free", "tree", "see", "me", "be"],
            "oo": ["cool", "pool", "rule", "tool", "fool"]
        }
    
    def calculate_rhyme_accuracy(self, chosen_word: str, lyric_context: str) -> float:
        """
        Calculate how well the chosen word rhymes with the lyric context
        Returns a score between 0.0 and 1.0
        """
        if not chosen_word or not lyric_context:
            return 0.0
        
        # Extract the word that should rhyme (usually the last word before the blank)
        context_words = lyric_context.split()
        if len(context_words) < 2:
            return 0.0
        
        # Find the word that should rhyme (usually the last complete word)
        rhyme_target = context_words[-2] if context_words[-1] == "___" else context_words[-1]
        
        # Calculate phonetic similarity
        phonetic_score = self._calculate_phonetic_similarity(chosen_word, rhyme_target)
        
        # Calculate contextual fit
        contextual_score = self._calculate_contextual_fit(chosen_word, lyric_context)
        
        # Weighted combination
        final_score = (phonetic_score * 0.7) + (contextual_score * 0.3)
        
        return min(1.0, max(0.0, final_score))
    
    def _calculate_phonetic_similarity(self, word1: str, word2: str) -> float:
        """Calculate phonetic similarity between two words"""
        # Simple rhyming detection based on ending sounds
        word1_clean = word1.lower().strip()
        word2_clean = word2.lower().strip()
        
        # Check for exact match
        if word1_clean == word2_clean:
            return 1.0
        
        # Check for known rhyme patterns
        for pattern, rhymes in self.rhyme_patterns.items():
            if word1_clean in rhymes and word2_clean in rhymes:
                return 0.9
            elif word1_clean in rhymes or word2_clean in rhymes:
                # Check if they end with the same pattern
                if word1_clean.endswith(pattern) and word2_clean.endswith(pattern):
                    return 0.8
        
        # Use difflib for general similarity
        similarity = difflib.SequenceMatcher(None, word1_clean, word2_clean).ratio()
        
        # Boost score if they have similar endings
        if word1_clean[-2:] == word2_clean[-2:]:
            similarity += 0.2
        
        return min(1.0, similarity)
    
    def _calculate_contextual_fit(self, word: str, context: str) -> float:
        """Calculate how well the word fits the context of the lyric"""
        # Simple contextual analysis
        positive_words = ["fast", "quick", "speed", "dash", "flash", "flow", "smooth"]
        negative_words = ["slow", "stop", "wait", "trash", "junk", "bad"]
        
        word_lower = word.lower()
        context_lower = context.lower()
        
        # Check if word matches the tone of the context
        if any(pos in context_lower for pos in positive_words) and word_lower in positive_words:
            return 0.9
        elif any(neg in context_lower for neg in negative_words) and word_lower in negative_words:
            return 0.9
        
        # Default score
        return 0.5

class BeatScorer:
    """Calculate beat synchronization accuracy"""
    
    def __init__(self):
        self.perfect_timing_threshold = 100  # milliseconds
        self.good_timing_threshold = 250     # milliseconds
        self.acceptable_timing_threshold = 500  # milliseconds
    
    def calculate_beat_accuracy(self, tap_timestamp: float, beat_timestamp: float) -> float:
        """
        Calculate how well the player tapped in sync with the beat
        Returns a score between 0.0 and 1.0
        """
        timing_offset = abs(tap_timestamp - beat_timestamp)
        
        if timing_offset <= self.perfect_timing_threshold:
            return 1.0
        elif timing_offset <= self.good_timing_threshold:
            return 0.8
        elif timing_offset <= self.acceptable_timing_threshold:
            return 0.5
        else:
            return max(0.0, 1.0 - (timing_offset / 1000))  # Linear decay
    
    def get_timing_feedback(self, timing_offset: float) -> Dict[str, str]:
        """Get feedback based on timing accuracy"""
        if timing_offset <= self.perfect_timing_threshold:
            return {"message": "Perfect timing! 🎯", "color": "green"}
        elif timing_offset <= self.good_timing_threshold:
            return {"message": "Good rhythm! 👍", "color": "blue"}
        elif timing_offset <= self.acceptable_timing_threshold:
            return {"message": "Almost on beat! ⚡", "color": "yellow"}
        else:
            return {"message": "Missed the beat! 💥", "color": "red"}

class ToneMatcher:
    """Calculate tone matching between chosen word and lyric context"""
    
    def __init__(self):
        # Tone categories for different contexts
        self.tone_categories = {
            "energetic": ["fast", "quick", "dash", "flash", "speed", "rush", "burst"],
            "smooth": ["flow", "smooth", "glide", "drift", "float", "wave"],
            "powerful": ["strong", "mighty", "force", "power", "steel", "hammer", "thunder"],
            "emotional": ["feel", "heart", "soul", "love", "pain", "joy", "tears"],
            "negative": ["trash", "junk", "waste", "bad", "wrong", "fail", "lose"],
            "positive": ["good", "great", "best", "win", "success", "gold", "shine"]
        }
    
    def calculate_tone_match(self, chosen_word: str, lyric_context: str) -> float:
        """
        Calculate how well the chosen word matches the tone of the lyric
        Returns a score between 0.0 and 1.0
        """
        if not chosen_word or not lyric_context:
            return 0.0
        
        # Determine the tone of the lyric context
        context_tone = self._analyze_context_tone(lyric_context)
        
        # Determine the tone of the chosen word
        word_tone = self._analyze_word_tone(chosen_word)
        
        # Calculate tone match
        if context_tone == word_tone:
            return 1.0
        elif self._are_compatible_tones(context_tone, word_tone):
            return 0.7
        else:
            return 0.3
    
    def _analyze_context_tone(self, context: str) -> str:
        """Analyze the tone of the lyric context"""
        context_lower = context.lower()
        
        # Check for tone indicators in the context
        for tone, words in self.tone_categories.items():
            if any(word in context_lower for word in words):
                return tone
        
        # Default tone based on common patterns
        if any(word in context_lower for word in ["fast", "quick", "speed"]):
            return "energetic"
        elif any(word in context_lower for word in ["flow", "smooth", "river"]):
            return "smooth"
        elif any(word in context_lower for word in ["hard", "hit", "hammer"]):
            return "powerful"
        else:
            return "neutral"
    
    def _analyze_word_tone(self, word: str) -> str:
        """Analyze the tone of a single word"""
        word_lower = word.lower()
        
        for tone, words in self.tone_categories.items():
            if word_lower in words:
                return tone
        
        return "neutral"
    
    def _are_compatible_tones(self, tone1: str, tone2: str) -> bool:
        """Check if two tones are compatible"""
        compatible_pairs = [
            ("energetic", "powerful"),
            ("smooth", "emotional"),
            ("positive", "energetic"),
            ("positive", "smooth"),
            ("negative", "emotional")
        ]
        
        return (tone1, tone2) in compatible_pairs or (tone2, tone1) in compatible_pairs

class GameScorer:
    """Main scoring class that combines all scoring components"""
    
    def __init__(self):
        self.rhyme_scorer = RhymeScorer()
        self.beat_scorer = BeatScorer()
        self.tone_matcher = ToneMatcher()
    
    def calculate_comprehensive_score(self, 
                                   chosen_word: str, 
                                   lyric_context: str,
                                   tap_timestamp: float,
                                   beat_timestamp: float) -> Dict[str, float]:
        """
        Calculate comprehensive game score including all metrics
        """
        rhyme_score = self.rhyme_scorer.calculate_rhyme_accuracy(chosen_word, lyric_context)
        beat_score = self.beat_scorer.calculate_beat_accuracy(tap_timestamp, beat_timestamp)
        tone_score = self.tone_matcher.calculate_tone_match(chosen_word, lyric_context)
        
        # Calculate overall score (weighted average)
        overall_score = (rhyme_score * 0.4) + (beat_score * 0.4) + (tone_score * 0.2)
        
        return {
            "rhyme_accuracy": rhyme_score,
            "beat_accuracy": beat_score,
            "tone_match": tone_score,
            "overall_score": overall_score,
            "timing_offset": abs(tap_timestamp - beat_timestamp)
        }
    
    def get_performance_feedback(self, scores: Dict[str, float]) -> Dict[str, str]:
        """Get comprehensive feedback based on all scores"""
        overall = scores["overall_score"]
        
        if overall > 0.9:
            return {
                "message": "🔥 Perfect! Amazing flow!",
                "color": "green",
                "speed_boost": 1.5
            }
        elif overall > 0.7:
            return {
                "message": "👍 Great rhythm! Keep it up!",
                "color": "blue",
                "speed_boost": 1.2
            }
        elif overall > 0.5:
            return {
                "message": "⚠️ Good effort! Almost there!",
                "color": "yellow",
                "speed_boost": 1.0
            }
        else:
            return {
                "message": "💥 Missed the mark! Try again!",
                "color": "red",
                "speed_boost": 0.5
            } 