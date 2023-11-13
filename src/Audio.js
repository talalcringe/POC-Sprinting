// Audio.js
import React, { useState, useRef, useContext, useEffect } from 'react';
import ReactSlider from 'react-slider';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import { Howl } from 'howler';
import { AudioContext } from './AudioContext';
import AudioButton from './AudioButton';
import AudioSettingsModal from './AudioSettingsModal';

function Audio({ volume, setVolume }) {
  const { isPlaying, setIsPlaying } = useContext(AudioContext);
  const [sound, setSound] = useState(null);
  const soundRef = useRef(null);
  const [selectedAudioUrl, setSelectedAudioUrl] = useState('');

  useEffect(() => {
    const initializeSound = () => {
      const newSound = new Howl({
        src: [selectedAudioUrl], // Use the selected audio URL
        format: ['mp3'],
        html5: true,
        loop: true,
        volume: volume / 100,
        onplay: () => {
          // Set isPlaying to true when the sound starts playing
          setIsPlaying(true);
        },
        onpause: () => {
          // Set isPlaying to false when the sound is paused
          setIsPlaying(false);
        },
        onend: () => {
          // Set isPlaying to false when the sound ends
          setIsPlaying(false);
        },
      });

      setSound(newSound);
      soundRef.current = newSound;
    };

    // If isPlaying is true, initialize and play the sound
    if (isPlaying) {
      initializeSound();
      soundRef.current.play();
    } else {
      // If not playing, unload the sound
      if (soundRef.current) {
        soundRef.current.unload();
      }
    }

    return () => {
      // Clean up and unload the sound when the component unmounts
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [isPlaying, volume, setIsPlaying, selectedAudioUrl]);

  const handleSliderChange = (newValue) => {
    setVolume(newValue);
    if (soundRef.current) {
      soundRef.current.volume(newValue / 100);
    }
  };

  return (
    <div>
      <h2>Ambient Sound</h2>

      <ReactSlider
        className={'slider volume'}
        thumbClassName={'thumb'}
        trackClassName={'track'}
        value={volume}
        onChange={handleSliderChange}
        min={0}
        max={100}
      />
      <label>Volume: {volume}</label>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {isPlaying ? (
          <PauseButton onClick={() => setIsPlaying(false)} />
        ) : (
          <PlayButton onClick={() => setIsPlaying(true)} />
        )}
      </div>
      <AudioSettingsModal
        onSelectAudio={(selectedAudioUrl) =>
          setSelectedAudioUrl(selectedAudioUrl)
        }
      />
    </div>
  );
}

export default Audio;
