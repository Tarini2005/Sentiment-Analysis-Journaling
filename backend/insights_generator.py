import numpy as np
from datetime import datetime
import re
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

try:
    stop_words = set(stopwords.words('english'))
except:
    # Fallback if NLTK resources aren't downloaded
    stop_words = set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
                      'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 
                      'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
                      'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 
                      'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
                      'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 
                      'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 
                      'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 
                      'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 
                      'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 
                      'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 
                      'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 
                      'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 
                      'wasn', 'weren', 'won', 'wouldn'])

def extract_common_topics(entries, n=5):
    """Extract common topics from journal entries"""
    all_text = " ".join([entry['content'] for entry in entries])
    all_text = re.sub(r'[^\w\s]', '', all_text.lower())
    words = word_tokenize(all_text)
    
    # Remove stopwords
    words = [word for word in words if word not in stop_words and len(word) > 3]
    
    # Get most common words
    word_counts = Counter(words)
    return word_counts.most_common(n)

def find_mood_patterns(entries):
    """Find patterns in mood over time"""
    if len(entries) < 5:  # Need enough entries for meaningful patterns
        return []
    
    # Extract mood scores and dates
    dates = [datetime.fromisoformat(entry['date']) for entry in entries]
    mood_scores = [entry['mood_score'] for entry in entries]
    
    patterns = []
    
    # Check for overall trend
    if len(mood_scores) > 7:
        # Simple linear regression
        x = np.arange(len(mood_scores))
        slope, _ = np.polyfit(x, mood_scores, 1)
        
        if slope > 0.05:
            patterns.append({
                'type': 'trend',
                'description': 'Your mood has been improving over time.',
                'strength': abs(slope) * 10  # Scale to 0-1
            })
        elif slope < -0.05:
            patterns.append({
                'type': 'trend',
                'description': 'Your mood has been declining recently.',
                'strength': abs(slope) * 10  # Scale to 0-1
            })
    
    # Check for weekly patterns
    if len(entries) >= 14:  # Need at least 2 weeks of data
        days_of_week = [date.weekday() for date in dates]
        mood_by_day = [[] for _ in range(7)]
        
        for i, day in enumerate(days_of_week):
            mood_by_day[day].append(mood_scores[i])
        
        avg_mood_by_day = [np.mean(moods) if moods else 0 for moods in mood_by_day]
        
        best_day = np.argmax(avg_mood_by_day)
        worst_day = np.argmin(avg_mood_by_day)
        
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        if max(avg_mood_by_day) - min(avg_mood_by_day) > 0.3:  # Significant difference
            patterns.append({
                'type': 'weekly',
                'description': f'You tend to feel best on {day_names[best_day]} and worst on {day_names[worst_day]}.',
                'strength': 0.7
            })
    
    return patterns

def generate_insights(entries):
    """
    Generate insights based on journal entries
    
    Args:
        entries (list): List of journal entry dictionaries
        
    Returns:
        dict: Dictionary containing insights and recommendations
    """
    if not entries:
        return {
            'insights': [],
            'recommendations': [],
            'mood_summary': {}
        }
    
    insights = []
    recommendations = []
    
    # Calculate overall mood statistics
    mood_scores = [entry['mood_score'] for entry in entries]
    avg_mood = np.mean(mood_scores)
    recent_mood = np.mean(mood_scores[-5:]) if len(mood_scores) >= 5 else avg_mood
    
    # Extract emotion data
    emotions_data = {}
    for emotion in ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm']:
        emotion_scores = [entry['emotions'].get(emotion, 0) for entry in entries]
        emotions_data[emotion] = np.mean(emotion_scores)
    
    # Find dominant emotions
    dominant_emotions = sorted(emotions_data.items(), key=lambda x: x[1], reverse=True)[:2]
    
    # Find mood patterns
    patterns = find_mood_patterns(entries)
    for pattern in patterns:
        insights.append(pattern['description'])
    
    # Extract common topics
    common_topics = extract_common_topics(entries)
    if common_topics:
        topics_str = ", ".join([topic for topic, _ in common_topics])
        insights.append(f"You frequently write about: {topics_str}.")
    
    # Generate recommendations based on mood and emotions
    if avg_mood < -0.2:
        recommendations.append("Consider incorporating more positive activities into your routine.")
        recommendations.append("Try journaling about three things you're grateful for each day.")
    
    if emotions_data['anger'] > 0.4:
        recommendations.append("When feeling angry, try deep breathing exercises or a brief walk to cool down.")
    
    if emotions_data['fear'] > 0.4:
        recommendations.append("Practice mindfulness or meditation to help manage anxiety.")
    
    if emotions_data['sadness'] > 0.4:
        recommendations.append("Connect with friends or loved ones when feeling down.")
        recommendations.append("Physical activity can help improve your mood when feeling sad.")
    
    if recent_mood < avg_mood - 0.2:
        recommendations.append("Your mood has dipped recently. Be gentle with yourself and practice self-care.")
    
    if emotions_data['calm'] < 0.2:
        recommendations.append("Try to build in moments of calm in your day, even if just for a few minutes.")
    
    # Mood summary
    mood_summary = {
        'average_mood': avg_mood,
        'recent_mood': recent_mood,
        'dominant_emotions': [emotion for emotion, _ in dominant_emotions],
        'emotion_data': emotions_data
    }
    
    return {
        'insights': insights,
        'recommendations': recommendations,
        'mood_summary': mood_summary
    }

# Example
if __name__ == "__main__":
    sample_entries = [
        {
            'content': 'Had a great day today. Everything went well at work.',
            'mood_score': 0.8,
            'emotions': {'joy': 0.7, 'sadness': 0.1, 'anger': 0.05, 'fear': 0.05, 'surprise': 0.3, 'calm': 0.6},
            'date': '2023-01-01T12:00:00'
        },
        {
            'content': 'Feeling a bit anxious about the presentation tomorrow.',
            'mood_score': -0.2,
            'emotions': {'joy': 0.1, 'sadness': 0.3, 'anger': 0.1, 'fear': 0.6, 'surprise': 0.1, 'calm': 0.1},
            'date': '2023-01-02T12:00:00'
        }
    ]
    
    result = generate_insights(sample_entries)
    print(result)
