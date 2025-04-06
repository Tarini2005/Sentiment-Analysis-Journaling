import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const MoodChart = ({ entries }) => {
  const [chartData, setChartData] = useState([]);
  const [emotionData, setEmotionData] = useState([]);
  const [viewMode, setViewMode] = useState('line'); // 'line' or 'bar'
  const [timeFrame, setTimeFrame] = useState('month'); // 'week', 'month', 'all'
  
  useEffect(() => {
    // Process entries for chart display
    if (entries.length === 0) return;
    
    // Filter entries by time frame
    let filteredEntries = [...entries];
    const now = new Date();
    
    if (timeFrame === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredEntries = entries.filter(entry => new Date(entry.date) >= oneWeekAgo);
    } else if (timeFrame === 'month') {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filteredEntries = entries.filter(entry => new Date(entry.date) >= oneMonthAgo);
    }
    
    // Format dates and prepare data for timeline chart
    const moodData = filteredEntries.map(entry => {
      const date = new Date(entry.date);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood_score,
        timestamp: date.getTime() // For sorting
      };
    });
    
    // Sort by date
    moodData.sort((a, b) => a.timestamp - b.timestamp);
    
    setChartData(moodData);
    
    // Process emotion data
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm'];
    const processedEmotions = emotions.map(emotion => {
      return {
        name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: filteredEntries.reduce((sum, entry) => sum + (entry.emotions[emotion] || 0), 0) / filteredEntries.length
      };
    });
    
    setEmotionData(processedEmotions);
  }, [entries, timeFrame]);
  
  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-mood">
            Mood: {payload[0].value.toFixed(2)}
            {payload[0].value > 0.5 ? ' 😊' : 
             payload[0].value > 0 ? ' 🙂' : 
             payload[0].value > -0.5 ? ' 😐' : ' 😞'}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="mood-chart">
      <div className="chart-controls">
        <div className="chart-type-toggle">
          <button 
            className={`chart-toggle ${viewMode === 'line' ? 'active' : ''}`}
            onClick={() => setViewMode('line')}
          >
            Timeline
          </button>
          <button 
            className={`chart-toggle ${viewMode === 'bar' ? 'active' : ''}`}
            onClick={() => setViewMode('bar')}
          >
            Emotions
          </button>
        </div>
        
        {viewMode === 'line' && (
          <div className="time-frame-controls">
            <button 
              className={`time-toggle ${timeFrame === 'week' ? 'active' : ''}`}
              onClick={() => setTimeFrame('week')}
            >
              Week
            </button>
            <button 
              className={`time-toggle ${timeFrame === 'month' ? 'active' : ''}`}
              onClick={() => setTimeFrame('month')}
            >
              Month
            </button>
            <button 
              className={`time-toggle ${timeFrame === 'all' ? 'active' : ''}`}
              onClick={() => setTimeFrame('all')}
            >
              All
            </button>
          </div>
        )}
      </div>
      
      <div className="chart-container">
        {entries.length === 0 ? (
          <div className="no-data">
            <p>No data available yet. Start journaling to see your mood patterns.</p>
          </div>
        ) : viewMode === 'line' ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                domain={[-1, 1]} 
                ticks={[-1, -0.5, 0, 0.5, 1]} 
                tickFormatter={(value) => value === 1 ? '😊' : 
                                          value === 0.5 ? '🙂' : 
                                          value === 0 ? '😐' : 
                                          value === -0.5 ? '😕' : 
                                          value === -1 ? '😞' : ''}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Mood" 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" name="Average Intensity" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MoodChart;
