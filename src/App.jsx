import './App.css';
import { useState } from 'react';
import Notebook from './Notebook.js';
import Timer from './Timer';
import Settings from './Settings';
import Audio from './Audio';
import SettingsContext from './SettingsContext';
import { AudioProvider } from './AudioContext';

function App() {
  const [showSettings, setShowSettings] = useState(true);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);
  const [wordGoal, setWordGoal] = useState(200);
  const [wordCount, setWordCount] = useState(0);

  const [showAudio, setShowAudio] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  return (
    <div style={{ padding: '20px', display: 'flex', gap: '2rem' }}>
      <AudioProvider>
        <SettingsContext.Provider
          value={{
            showSettings,
            setShowSettings,
            workMinutes,
            breakMinutes,
            setWorkMinutes,
            setBreakMinutes,
            wordGoal,
            setWordGoal,
            wordCount,
            setWordCount,
            showAudio,
            setShowAudio,
            volume,
            setVolume,
            isAudioPlaying,
            setIsAudioPlaying,
          }}
        >
          <div style={{ width: '82%' }}>
            <Notebook />
          </div>

          <div
            style={{
              width: '18%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {showSettings ? <Settings /> : showAudio ? <Audio /> : <Timer />}
            <Audio volume={volume} setVolume={setVolume} />
          </div>
        </SettingsContext.Provider>
      </AudioProvider>
    </div>
  );
}

export default App;
