import React, { useState } from 'react';
import Modal from 'react-modal';
import AudioButton from './AudioButton';

const AudioSettingsModal = ({ onSelectAudio }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('ambient');

  const audioUrls = {
    ambient:
      'https://firebasestorage.googleapis.com/v0/b/sprinting-poc.appspot.com/o/ambient.mp3?alt=media&token=90c8910c-f1f7-42f6-b02f-9ced240a763b',
    forest:
      'https://firebasestorage.googleapis.com/v0/b/sprinting-poc.appspot.com/o/forest.mp3?alt=media&token=ff804c0b-aea4-4cfc-a93e-e5ac1ee8a70b',
    ocean:
      'https://firebasestorage.googleapis.com/v0/b/sprinting-poc.appspot.com/o/ocean.mp3?alt=media&token=7a386e9a-bc25-4271-993e-9a86d4ff985b',
  };

  const handleAudioSelection = (audioType) => {
    setSelectedAudio(audioType);
    setShowModal(false);
    onSelectAudio(audioUrls[audioType]);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <AudioButton onClick={handleShowModal} />

      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: 'max-content',
            maxHeight: 'max-content',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
          },
        }}
      >
        <h2 style={{ margin: 'auto', textAlign: 'center' }}>Audio Settings</h2>

        <div
          className='audio-selection'
          style={{ textAlign: 'center', margin: '5vw auto' }}
        >
          <button
            onClick={() => handleAudioSelection('ambient')}
            className={`button ${selectedAudio === 'ambient' ? 'active' : ''}`}
            style={{
              backgroundColor: '#2ecc71',
              padding: selectedAudio === 'ambient' ? '1vw' : '0.5vw',
              margin: '0.5vw',
              minWidth: 'max-content',
            }}
          >
            Ambient
          </button>

          <button
            onClick={() => handleAudioSelection('forest')}
            className={`button ${selectedAudio === 'forest' ? 'active' : ''}`}
            style={{
              backgroundColor: '#e74c3c',
              padding: selectedAudio === 'forest' ? '1vw' : '0.5vw',
              margin: '0.5vw',
              minWidth: 'max-content',
            }}
          >
            Forest
          </button>

          <button
            onClick={() => handleAudioSelection('ocean')}
            className={`button ${selectedAudio === 'ocean' ? 'active' : ''}`}
            style={{
              backgroundColor: '#f39c12',
              padding: selectedAudio === 'ocean' ? '1vw' : '0.5vw',
              margin: '0.5vw',
              minWidth: 'max-content',
            }}
          >
            Ocean
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AudioSettingsModal;
