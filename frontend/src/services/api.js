const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getEntries = async () => {
  try {
    const response = await fetch(`${API_URL}/journal`);
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getEntry = async (id) => {
  try {
    const response = await fetch(`${API_URL}/journal/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch entry');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const createEntry = async (content) => {
  try {
    const response = await fetch(`${API_URL}/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create entry');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getInsights = async () => {
  try {
    const response = await fetch(`${API_URL}/insights`);
    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getMoodTimeline = async () => {
  try {
    const response = await fetch(`${API_URL}/mood/timeline`);
    if (!response.ok) {
      throw new Error('Failed to fetch mood timeline');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User authentication functions would go here in a real app

export default {
  getEntries,
  getEntry,
  createEntry,
  getInsights,
  getMoodTimeline
};
