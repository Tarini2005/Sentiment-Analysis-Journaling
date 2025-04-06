from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from models import db, Journal, User
from sentiment_analyzer import analyze_sentiment
from insights_generator import generate_insights

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///journal.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/api/journal', methods=['POST'])
def add_entry():
    data = request.get_json()
    
    # Extract data from request
    user_id = data.get('user_id', 1)  # Default to user 1 for now
    content = data.get('content', '')
    
    if not content:
        return jsonify({'error': 'Journal content is required'}), 400
    
    # Analyze sentiment
    sentiment_data = analyze_sentiment(content)
    
    # Create journal entry
    entry = Journal(
        user_id=user_id,
        content=content,
        mood_score=sentiment_data['mood_score'],
        emotions=json.dumps(sentiment_data['emotions']),
        date=datetime.now()
    )
    
    db.session.add(entry)
    db.session.commit()
    
    return jsonify({
        'id': entry.id,
        'mood_score': entry.mood_score,
        'emotions': json.loads(entry.emotions),
        'date': entry.date.isoformat()
    }), 201

@app.route('/api/journal', methods=['GET'])
def get_entries():
    user_id = request.args.get('user_id', 1)  # Default to user 1
    
    # Get all entries for the user
    entries = Journal.query.filter_by(user_id=user_id).order_by(Journal.date.desc()).all()
    
    result = []
    for entry in entries:
        result.append({
            'id': entry.id,
            'content': entry.content,
            'mood_score': entry.mood_score,
            'emotions': json.loads(entry.emotions),
            'date': entry.date.isoformat()
        })
    
    return jsonify(result)

@app.route('/api/journal/<int:entry_id>', methods=['GET'])
def get_entry(entry_id):
    entry = Journal.query.get_or_404(entry_id)
    
    return jsonify({
        'id': entry.id,
        'content': entry.content,
        'mood_score': entry.mood_score,
        'emotions': json.loads(entry.emotions),
        'date': entry.date.isoformat()
    })

@app.route('/api/insights', methods=['GET'])
def get_insights():
    user_id = request.args.get('user_id', 1)  # Default to user 1
    
    # Get all entries for the user
    entries = Journal.query.filter_by(user_id=user_id).order_by(Journal.date).all()
    
    if not entries:
        return jsonify({'error': 'No journal entries found'}), 404
    
    # Prepare data for insights generation
    entries_data = []
    for entry in entries:
        entries_data.append({
            'content': entry.content,
            'mood_score': entry.mood_score,
            'emotions': json.loads(entry.emotions),
            'date': entry.date.isoformat()
        })
    
    # Generate insights
    insights = generate_insights(entries_data)
    
    return jsonify(insights)

@app.route('/api/mood/timeline', methods=['GET'])
def get_mood_timeline():
    user_id = request.args.get('user_id', 1)  # Default to user 1
    
    # Get all entries for the user
    entries = Journal.query.filter_by(user_id=user_id).order_by(Journal.date).all()
    
    if not entries:
        return jsonify({'error': 'No journal entries found'}), 404
    
    # Prepare timeline data
    timeline = []
    for entry in entries:
        timeline.append({
            'date': entry.date.isoformat(),
            'mood_score': entry.mood_score,
            'emotions': json.loads(entry.emotions)
        })
    
    return jsonify(timeline)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
