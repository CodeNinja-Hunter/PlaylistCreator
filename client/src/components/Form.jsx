

import React, { useState } from 'react';
import './Form.css';

const Form = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    genre: '',
    years: '',
    obscure: false,
    numberOfTracks: '',
  });

  // Handle input changes for text boxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add logic to create a playlist with the form data (e.g., API call)
  };

  return (
    <div className="form-container">
      <h2>Create a Playlist</h2>
      <form onSubmit={handleSubmit} className="playlist-form">
        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="e.g., Rock, Jazz"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="years">Years:</label>
          <input
            type="text"
            id="years"
            name="years"
            value={formData.years}
            onChange={handleChange}
            placeholder="e.g., 1980-1990"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="obscure">
            Obscure?
            <input
              type="checkbox"
              id="obscure"
              name="obscure"
              checked={formData.obscure}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="numberOfTracks">Number of Tracks:</label>
          <input
            type="number"
            id="numberOfTracks"
            name="numberOfTracks"
            value={formData.numberOfTracks}
            onChange={handleChange}
            placeholder="e.g., 10"
            min="1"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Create Playlist!
        </button>
      </form>
    </div>
  );
};

export default Form;