import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AudioButton from './AudioButton';
import { storage } from './firebase';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const AudioSettingsModal = ({ onSelectAudio }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null); // Change default value to null

  const [audioUpload, setAudioUpload] = useState(null);
  const [audioList, setAudioList] = useState([]);

  const audioListRef = ref(storage, 'audio/');

  const handleAudioSelection = (audioInfo) => {
    setSelectedAudio(audioInfo.name === selectedAudio ? null : audioInfo.name);
    onSelectAudio(audioInfo.url);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const uploadAudio = () => {
    if (audioUpload == null) return;
    const audioRef = ref(storage, `audio/${audioUpload.name + v4()}`);
    uploadBytes(audioRef, audioUpload).then(() => {
      alert('Audio uploaded');
    });
  };

  useEffect(() => {
    listAll(audioListRef)
      .then((response) => {
        const promises = response.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const fileNameWithoutExtension = item.name.replace(/\.[^/.]+$/, ''); // Remove extension
          return { name: fileNameWithoutExtension, url };
        });

        return Promise.all(promises);
      })
      .then((audioInfoArray) => {
        setAudioList(audioInfoArray);
      })
      .catch((error) => {
        console.error('Error fetching audio URLs: ', error);
      });
  }, []);

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
          {audioList.map((audioInfo) => (
            <button
              key={audioInfo.name}
              onClick={() => handleAudioSelection(audioInfo)}
              className={`button ${
                selectedAudio === audioInfo.name ? 'active' : ''
              }`}
              style={{
                backgroundColor: '#2ecc71',
                border:
                  selectedAudio === audioInfo.name ? '4px white solid' : 'none',
                padding: selectedAudio === audioInfo.name ? '1vw' : '0.5vw',
                margin: '0.5vw',
                minWidth: 'max-content',
              }}
            >
              {audioInfo.name}
            </button>
          ))}
        </div>
        <div
          className='audio-upload'
          style={{
            textAlign: 'center',
          }}
        >
          <input
            type='file'
            onChange={(event) => setAudioUpload(event.target.files[0])}
            style={{
              padding: '1vw',
              margin: '0.5vw, auto',
              minWidth: 'max-content',
            }}
          />
          <button
            onClick={uploadAudio}
            style={{
              color: 'white',
              backgroundColor: 'black',
              padding: '1vw',
              margin: '0.5vw',
              minWidth: 'max-content',
            }}
          >
            Upload Audio
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AudioSettingsModal;
