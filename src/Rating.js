import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const Rating = ({ initialRating = 0, onRate, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (value) => {
    if (!readOnly) {
      setRating(value);
      if (onRate) onRate(value);
    }
  };

  const getStarColor = (index) => {
    const value = index + 1;
    if (hover >= value || (!hover && rating >= value)) {
      return '#fe9d00'; // Use the same orange color from your CSS
    }
    return '#4b4b4b';
  };

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[...Array(10)].map((_, index) => {
        const value = index + 1;
        return (
          <Star
            key={index}
            style={{
              width: '24px',
              height: '24px',
              cursor: readOnly ? 'default' : 'pointer',
              fill: getStarColor(index),
              stroke: getStarColor(index),
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={() => !readOnly && setHover(value)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => handleClick(value)}
          />
        );
      })}
    </div>
  );
};

export default Rating;