import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JournalPage from './pages/JournalPage';
import SettingsPage from './pages/SettingsPage';
import NavBar from './components/NavBar';
import './styles.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState({
    insights: [],
    recommendations: [],
    mood_summary: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/journal');
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchInsights = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/insights');
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };
  
  const addEntry = async (content) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        await fetchEntries();
        await fetchInsights();
      } else {
        console.error('Failed to add entry');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEntries();
    fetchInsights();
  }, []);
  
  return (
    <Router>
      <div className="app">
        <NavBar />
        <div className="content">
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard entries={entries} insights={insights} isLoading={isLoading} />} 
            />
            <Route 
              path="/journal" 
              element={<JournalPage entries={entries} addEntry={addEntry} isLoading={isLoading} />} 
            />
            <Route 
              path="/settings" 
              element={<SettingsPage />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
