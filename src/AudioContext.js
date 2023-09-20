// AudioContext.js
import React, { createContext, useState } from 'react';

const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AudioContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </AudioContext.Provider>
  );
};

export { AudioContext, AudioProvider };
