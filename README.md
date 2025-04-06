# MoodJournal - Emotional Pattern Analysis App

MoodJournal is a journaling application that helps users track their emotional patterns over time. The app analyzes journal entries using natural language processing to identify emotions and mood trends, providing visualizations and personalized insights.

## Features

- **Journal Entries**: Write and save daily journal entries
- **Sentiment Analysis**: Automatic emotion detection from text
- **Visual Analytics**: Charts showing mood trends over time
- **Insights**: Personalized insights based on emotional patterns
- **Recommendations**: Gentle suggestions for emotional well-being

## Tech Stack

### Backend
- Python with Flask framework
- SQLite database (can be upgraded to PostgreSQL)
- Natural Language Processing (NLP) with NLTK and TextBlob
- Data analysis with NumPy

### Frontend
- React with hooks
- React Router for navigation
- Recharts for data visualization
- Responsive design with CSS

## Project Structure

```
MoodJournal/
│
├── backend/               # Flask server
│   ├── app.py             # Main application file
│   ├── models.py          # Database models
│   ├── sentiment_analyzer.py  # NLP sentiment analysis
│   ├── insights_generator.py  # Pattern recognition
│   ├── requirements.txt   # Python dependencies
│   └── config.py          # Configuration settings
│
├── frontend/              # React frontend
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # UI components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── App.js         # Main app component
│       └── styles.css     # Application styles
│
└── docker-compose.yml     # Docker configuration
```

## Getting Started

### Prerequisites
- Docker and Docker Compose (optional)
- Node.js and npm (if not using Docker)
- Python 3.8+ (if not using Docker)

### Running with Docker
1. Clone the repository
   ```
   git clone https://github.com/yourusername/mood-journal.git
   cd mood-journal
   ```

2. Start the application with Docker Compose
   ```
   docker-compose up
   ```

3. Access the application at http://localhost:3000

### Running without Docker

#### Backend Setup
1. Navigate to the backend directory
   ```
   cd backend
   ```

2. Create a virtual environment
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask application
   ```
   flask run
   ```

#### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Access the application at http://localhost:3000

## API Endpoints

### Journal Entries
- `GET /api/journal` - Get all journal entries
- `POST /api/journal` - Create a new journal entry
- `GET /api/journal/:id` - Get a specific journal entry

### Analytics
- `GET /api/insights` - Get insights and recommendations
- `GET /api/mood/timeline` - Get mood timeline data

## Future Enhancements

- User authentication system
- Advanced emotion detection with machine learning
- Weekly/monthly email reports
- Export options for journal data
- Integration with other health tracking apps
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NLTK for natural language processing capabilities
- React team for the frontend framework
- Flask team for the backend framework
