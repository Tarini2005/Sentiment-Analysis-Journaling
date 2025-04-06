import React from 'react';

const InsightsPanel = ({ insights }) => {
  const { insights: insightsList, recommendations, mood_summary } = insights;
  
  // Helper function to get emoji for mood score
  const getMoodEmoji = (score) => {
    if (score > 0.5) return '😊';
    if (score > 0) return '🙂';
    if (score > -0.5) return '😐';
    return '😞';
  };
  
  // Helper function to get color class based on mood score
  const getMoodColorClass = (score) => {
    if (score > 0.5) return 'positive';
    if (score > 0) return 'slightly-positive';
    if (score > -0.5) return 'slightly-negative';
    return 'negative';
  };
  
  return (
    <div className="insights-panel">
      {mood_summary && Object.keys(mood_summary).length > 0 ? (
        <>
          <div className="mood-summary">
            <div className={`mood-indicator ${getMoodColorClass(mood_summary.average_mood || 0)}`}>
              <div className="mood-emoji">{getMoodEmoji(mood_summary.average_mood || 0)}</div>
              <div className="mood-label">Average Mood</div>
            </div>
            
            {mood_summary.dominant_emotions && mood_summary.dominant_emotions.length > 0 && (
              <div className="dominant-emotions">
                <h3>Primary Emotions</h3>
                <div className="emotions-list">
                  {mood_summary.dominant_emotions.map((emotion, index) => (
                    <span key={emotion} className="emotion-tag">
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      {index < mood_summary.dominant_emotions.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {insightsList && insightsList.length > 0 && (
            <div className="insights-section">
              <h3>Insights</h3>
              <ul className="insights-list">
                {insightsList.map((insight, index) => (
                  <li key={index} className="insight-item">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {recommendations && recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>Gentle Recommendations</h3>
              <ul className="recommendations-list">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="recommendation-item">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="no-insights">
          <p>Not enough journal entries to generate insights yet. Keep journaling regularly to see patterns and recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
