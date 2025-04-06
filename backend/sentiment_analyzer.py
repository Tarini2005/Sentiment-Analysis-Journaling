import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import re
from textblob import TextBlob
import numpy as np

# Download NLTK resources (uncomment first time)
# nltk.download('vader_lexicon')
# nltk.download('punkt')

# Initialize the NLTK Sentiment Analyzer
sia = SentimentIntensityAnalyzer()

# Define emotion keywords
emotion_keywords = {
    'joy': ['happy', 'happiness', 'joy', 'excited', 'exciting', 'thrilled', 'delighted', 'pleased', 'elated', 
            'cheerful', 'content', 'glad', 'satisfied', 'grateful', 'thankful', 'love', 'loving'],
    'sadness': ['sad', 'sadness', 'unhappy', 'depressed', 'depression', 'miserable', 'gloomy', 'down', 'blue', 
                'heartbroken', 'hurt', 'disappointed', 'upset', 'regret', 'sorry', 'lonely', 'alone'],
    'anger': ['angry', 'anger', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'rage', 'outrage',
              'hate', 'hatred', 'resent', 'resentment', 'bitter', 'disgusted', 'disgusting'],
    'fear': ['afraid', 'fear', 'scared', 'frightened', 'terrified', 'anxious', 'worried', 'nervous', 'panic',
             'paranoid', 'uneasy', 'dread', 'concerned', 'alarmed', 'stress', 'stressed'],
    'surprise': ['surprised', 'surprise', 'astonished', 'amazed', 'shocking', 'shocked', 'unexpected', 
                'startled', 'stunned', 'bewildered', 'perplexed', 'confused', 'disbelief', 'wonder'],
    'calm': ['calm', 'peace', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed', 'centered', 
             'balanced', 'still', 'quiet', 'ease', 'relieved', 'secure', 'comfort', 'comfortable']
}

def analyze_sentiment(text):
    """
    Analyze the sentiment and emotions in a text
    
    Args:
        text (str): The text to analyze
        
    Returns:
        dict: Dictionary containing mood score and emotion scores
    """
    # Clean text
    text = re.sub(r'[^\w\s]', '', text.lower())
    
    # Get overall sentiment using NLTK's VADER
    sentiment = sia.polarity_scores(text)
    compound_score = sentiment['compound']
    
    # Get emotion scores
    emotions = {}
    words = nltk.word_tokenize(text)
    
    # Calculate emotion scores based on keyword presence
    for emotion, keywords in emotion_keywords.items():
        score = 0
        for keyword in keywords:
            score += sum(1 for word in words if keyword in word)
        emotions[emotion] = min(1.0, score / 10)  # Normalize to 0-1
    
    # Use TextBlob for additional sentiment analysis
    blob = TextBlob(text)
    blob_polarity = blob.sentiment.polarity
    
    # Average the sentiment scores from different methods
    mood_score = (compound_score + blob_polarity) / 2
    
    return {
        'mood_score': mood_score,
        'emotions': emotions
    }

# Example usage
if __name__ == "__main__":
    sample_text = "I had a really great day today. The weather was beautiful and I felt very happy."
    result = analyze_sentiment(sample_text)
    print(result)
