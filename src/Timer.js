import './App.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import BreakButton from './BreakButton';
import WriteButton from './WriteButton';
import SettingsButton from './SettingsButton';
import { useContext, useState, useEffect, useRef } from 'react';
import SettingsContext from './SettingsContext';
import Audio from './Audio';

const red = '#f00';
const green = '#0f0';
const blue = '#00f';
let rerenderKey = 0;
function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState('work'); // ['work', 'break'/'null]
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [volume, setVolume] = useState(settingsInfo.volume);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const soundRef = useRef(null);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  function initTimer() {
    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);
  }

  function endSprint() {
    resetTimer();
    alert('Sprint Complete!');
    settingsInfo.setShowSettings(true);
  }

  function resetTimer() {
    initTimer();
    setIsPaused(true);
    isPausedRef.current = true;
  }

  function switchMode() {
    const nextMode = modeRef.current === 'work' ? 'break' : 'work';
    const nextSecondsLeft =
      (nextMode === 'work'
        ? settingsInfo.workMinutes
        : settingsInfo.breakMinutes) * 60;

    setMode(nextMode);
    modeRef.current = nextMode;

    setSecondsLeft(nextSecondsLeft);
    secondsLeftRef.current = nextSecondsLeft;
  }

  useEffect(() => {
    initTimer();

    const interval = setInterval(() => {
      if (settingsInfo.wordCount === wordsGoal) {
        endSprint();
      }
      if (isPausedRef.current) return;
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 1000);
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      clearInterval(interval);
    };
  }, [settingsInfo]);

  const totalSeconds =
    mode === 'work'
      ? settingsInfo.workMinutes * 60
      : settingsInfo.breakMinutes * 60;

  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = '0' + seconds;

  const wordsGoal = settingsInfo.wordGoal;

  return (
    <div className='timer'>
      <CircularProgressbar
        className='progress'
        value={percentage}
        text={minutes + ':' + seconds}
        styles={buildStyles({
          textColor: 'rgba(255, 255, 255, 0.8)',
          pathColor: mode === 'work' ? red : green,
          tailColor: 'rgba(255,255,255,.2)',
        })}
      />
      <h1>{mode === 'work' ? 'Work' : 'Break'}</h1>

      <h2>Word Goal: {wordsGoal}</h2>
      <div className='buttons'>
        <div>
          {isPaused ? (
            <PlayButton
              onClick={() => {
                setIsPaused(false);
                isPausedRef.current = false;
              }}
            />
          ) : (
            <PauseButton
              onClick={() => {
                setIsPaused(true);
                isPausedRef.current = true;
              }}
            />
          )}
          {mode === 'work' ? (
            <BreakButton
              onClick={() => {
                setIsPaused(false);
                isPausedRef.current = false;
                switchMode();
              }}
            />
          ) : (
            <WriteButton
              onClick={() => {
                setIsPaused(false);
                isPausedRef.current = false;
                switchMode();
              }}
            />
          )}
        </div>
      </div>
      <div>
        <SettingsButton
          onClick={() => {
            settingsInfo.setShowSettings(true);
          }}
        />
        <Audio volume={volume} setVolume={setVolume} />
      </div>
    </div>
  );
}

export default Timer;
