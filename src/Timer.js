import React, { useContext, useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import BreakButton from './BreakButton';
import WriteButton from './WriteButton';
import SettingsButton from './SettingsButton';
import SettingsContext from './SettingsContext';
import Modal from 'react-modal';

const red = '#f00';
const green = '#0f0';

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sprintPassed, setSprintPassed] = useState(false);
  const [sprintFailed, setSprintFailed] = useState(false);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const soundRef = useRef(null);

  const wordCount = settingsInfo.wordCount;
  const wordGoal = settingsInfo.wordGoal;

  // Separate function for timer initialization
  const initTimer = () => {
    secondsLeftRef.current =
      modeRef.current === 'work'
        ? settingsInfo.workMinutes * 60
        : settingsInfo.breakMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);
  };

  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  };

  const endSprint = () => {
    resetTimer();
    clearInterval(compareWords);

    if (wordCount >= wordGoal) {
      setSprintPassed(true);
    } else {
      setSprintFailed(true);
    }
  };

  const resetTimer = () => {
    initTimer();
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const handleEndSprint = () => {
    setSprintPassed(false);
    setSprintFailed(false);
    settingsInfo.setShowSettings(true);
  };

  const compareWords = setInterval(() => {
    if (wordCount >= wordGoal) {
      endSprint();
    }
  }, 1000);

  useEffect(() => {
    initTimer();

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      if (secondsLeftRef.current === 0) {
        return endSprint();
      }

      tick();
    }, 1000);

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkSprintCompletion = () => {
      if (wordCount >= wordGoal) {
        endSprint();
      }
    };

    const wordCountInterval = setInterval(checkSprintCompletion, 1000);

    return () => {
      clearInterval(wordCountInterval);
    };
  }, [wordCount, wordGoal]);

  const totalSeconds =
    mode === 'work'
      ? settingsInfo.workMinutes * 60
      : settingsInfo.breakMinutes * 60;

  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = '0' + seconds;

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

      <h2>Word Goal: {settingsInfo.wordGoal}</h2>
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
                endSprint();
              }}
            />
          ) : (
            <WriteButton
              onClick={() => {
                setIsPaused(false);
                isPausedRef.current = false;
                endSprint();
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
      </div>

      {/* Modal for successful sprint completion */}
      <Modal
        isOpen={sprintPassed}
        onRequestClose={handleEndSprint}
        contentLabel='Sprint Complete'
        style={{
          content: {
            backgroundColor: 'rgb(0, 220, 50)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '8px',
            maxWidth: '250px',
            maxHeight: '200px',
            margin: 'auto',
            textAlign: 'center',
          },
        }}
      >
        <h2>Congratulations!</h2>
        <p>You've completed your sprint.</p>
        <button onClick={handleEndSprint}>
          <h3>Close</h3>
        </button>
      </Modal>

      {/* Modal for failed sprint */}
      <Modal
        isOpen={sprintFailed}
        onRequestClose={handleEndSprint}
        contentLabel='Sprint Failed'
        style={{
          content: {
            backgroundColor: 'red',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '8px',
            maxWidth: '250px',
            maxHeight: '200px',
            margin: 'auto',
            textAlign: 'center',
          },
        }}
      >
        <h2>Sprint Failed</h2>
        <p>You did not meet the word goal in time.</p>
        <button onClick={handleEndSprint}>
          <h3>Close</h3>
        </button>
      </Modal>
    </div>
  );
}

export default Timer;
