import React from 'react';
import { Link } from 'react-router-dom';
import MoodChart from '../components/MoodChart';
import InsightsPanel from '../components/InsightsPanel';

const Dashboard = ({ entries, insights, isLoading }) => {
  // Get recent entries
  const recentEntries = entries.slice(0, 3);
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Your Mood Dashboard</h1>
        <Link to="/journal" className="button primary">New Journal Entry</Link>
      </header>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Mood Timeline</h2>
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <MoodChart entries={entries} />
          )}
        </div>
        
        <div className="dashboard-section">
          <h2>Insights & Recommendations</h2>
          <InsightsPanel insights={insights} />
        </div>
        
        <div className="dashboard-section">
          <h2>Recent Journal Entries</h2>
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : recentEntries.length > 0 ? (
            <div className="recent-entries">
              {recentEntries.map(entry => (
                <div key={entry.id} className="entry-preview">
                  <div className="entry-date">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </div>
                  <div className="entry-content">
                    {entry.content.length > 150
                      ? `${entry.content.substring(0, 150)}...`
                      : entry.content}
                  </div>
                  <div className="entry-mood">
                    Mood: {entry.mood_score > 0.5 ? '😊' : 
                          entry.mood_score > 0 ? '🙂' : 
                          entry.mood_score > -0.5 ? '😐' : '😞'}
                  </div>
                </div>
              ))}
              <Link to="/journal" className="view-all">View all entries</Link>
            </div>
          ) : (
            <div className="no-entries">
              <p>No journal entries yet. Start your journal today!</p>
              <Link to="/journal" className="button secondary">Start Journaling</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
