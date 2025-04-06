import React, { useState } from 'react';
import JournalEntry from '../components/JournalEntry';

const JournalPage = ({ entries, addEntry, isLoading }) => {
  const [newEntryText, setNewEntryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntryText.trim()) return;
    
    setIsSubmitting(true);
    await addEntry(newEntryText);
    setNewEntryText('');
    setIsSubmitting(false);
  };
  
  return (
    <div className="journal-page">
      <header className="journal-header">
        <h1>Your Journal</h1>
      </header>
      
      <div className="new-entry-section">
        <h2>How are you feeling today?</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newEntryText}
            onChange={(e) => setNewEntryText(e.target.value)}
            placeholder="Write your thoughts, feelings, and experiences..."
            rows={6}
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="button primary" 
            disabled={isSubmitting || !newEntryText.trim()}
          >
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </div>
      
      <div className="entries-section">
        <h2>Journal History</h2>
        {isLoading ? (
          <div className="loading">Loading entries...</div>
        ) : entries.length > 0 ? (
          <div className="entries-list">
            {entries.map(entry => (
              <JournalEntry key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="no-entries">
            <p>You haven't written any entries yet. Start your journal today!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
