import './App.css';
import ReactSlider from 'react-slider';
import SettingsContext from './SettingsContext';
import { useContext } from 'react';
import BackButton from './BackButton';

function Settings() {
  const settingsInfo = useContext(SettingsContext);
  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ marginTop: '35px' }}>Sprint Settings</h2>
      <label>Work for: {settingsInfo.workMinutes}</label>
      <ReactSlider
        className={'slider workFor'}
        thumbClassName={'thumb'}
        trackClassName={'track'}
        value={settingsInfo.workMinutes}
        onChange={(newValue) => settingsInfo.setWorkMinutes(newValue)}
        min={1}
        max={120}
      />
      <label>Break for: {settingsInfo.breakMinutes}</label>
      <ReactSlider
        className={'slider breakFor'}
        thumbClassName={'thumb'}
        trackClassName={'track'}
        value={settingsInfo.breakMinutes}
        onChange={(newValue) => settingsInfo.setBreakMinutes(newValue)}
        min={1}
        max={120}
      />
      <label>Word Goal: {settingsInfo.wordGoal}</label>
      <ReactSlider
        className={'slider wordGoal'}
        thumbClassName={'thumb'}
        trackClassName={'track'}
        value={settingsInfo.wordGoal}
        onChange={(newValue) => settingsInfo.setWordGoal(newValue)}
        min={1}
        max={1000}
      />

      <BackButton
        onClick={() => {
          settingsInfo.setShowSettings(false);
        }}
      />
    </div>
  );
}

export default Settings;
