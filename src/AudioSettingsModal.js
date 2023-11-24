import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AudioButton from './AudioButton';
import { storage } from './firebase';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import axios from 'axios';

const AudioSettingsModal = ({ onSelectAudio }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioUpload, setAudioUpload] = useState(null);
  const [audioList, setAudioList] = useState([]);
  const [pixabayResults, setPixabayResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPixabayAudio, setPreviewPixabayAudio] = useState(null);

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

  const searchPixabayAudio = async () => {
    try {
      const apiKey = '40625015-ab19160267bc0cdaa73bd5e00'; // Replace with your Pixabay API key
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: apiKey,
          q: searchQuery,
          category: 'music',
          per_page: 10,
          video_type: 'animation',
        },
      });

      const pixabayResultsData = response.data;

      console.log('Pixabay API response:', pixabayResultsData);

      if (pixabayResultsData.totalHits === 0) {
        console.log('No Pixabay audio found.');
        setPixabayResults([]);
      } else {
        const audioResults = pixabayResultsData.hits
          .filter((hit) => hit.audio && hit.audio.mp3) // Check if 'audio' and 'mp3' properties exist
          .map((hit) => ({
            name: hit.tags,
            url: hit.audio.mp3,
          }));

        console.log('Pixabay audio results:', audioResults);
        setPixabayResults(audioResults);
      }
    } catch (error) {
      console.error('Error fetching Pixabay audio: ', error);
    }
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
            width: '600px',
            height: 'max-content',
            maxHeight: '70vh',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            overflow: 'auto',
          },
        }}
      >
        <h2 style={{ margin: 'auto', textAlign: 'center' }}>Audio Settings</h2>

        {/* Section for Pixabay audio */}
        <div style={{ textAlign: 'center', margin: '5vw auto' }}>
          <h3>Pixabay Audio</h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input
              type='text'
              placeholder='Search Pixabay Audio'
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '1vw',
                margin: '0.5vw',
                minWidth: 'max-content',
              }}
            />
            <button
              onClick={searchPixabayAudio}
              style={{
                color: 'white',
                backgroundColor: 'black',
                padding: '1vw',
                margin: '0.5vw',
                minWidth: 'max-content',
              }}
            >
              Search
            </button>
          </div>
          <div
            className='audio-selection'
            style={{ textAlign: 'center', margin: '5vw auto' }}
          >
            {pixabayResults.map((audioInfo) => (
              <div key={audioInfo.name} style={{ marginBottom: '1em' }}>
                <button
                  onClick={() => {
                    handleAudioSelection(audioInfo);
                    setPreviewPixabayAudio(audioInfo.url);
                  }}
                  className={`button ${
                    selectedAudio === audioInfo.name ? 'active' : ''
                  }`}
                  style={{
                    backgroundColor: '#2ecc71',
                    border:
                      selectedAudio === audioInfo.name
                        ? '4px white solid'
                        : 'none',
                    padding: selectedAudio === audioInfo.name ? '1vw' : '0.5vw',
                    margin: '0.5vw',
                    minWidth: 'max-content',
                  }}
                >
                  {audioInfo.name}
                </button>
              </div>
            ))}
          </div>
          {previewPixabayAudio && (
            <div style={{ marginTop: '1em' }}>
              <audio controls>
                <source src={previewPixabayAudio} type='audio/mp3' />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
        </div>

        {/* Section for Firebase audio */}
        <div style={{ textAlign: 'center', margin: '5vw auto' }}>
          <h3>Firebase Audio</h3>
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
                    selectedAudio === audioInfo.name
                      ? '4px white solid'
                      : 'none',
                  padding: selectedAudio === audioInfo.name ? '1vw' : '0.5vw',
                  margin: '0.5vw',
                  minWidth: 'max-content',
                }}
              >
                {audioInfo.name}
              </button>
            ))}
          </div>

          {/* Audio upload section */}
          <div className='audio-upload' style={{ textAlign: 'center' }}>
            <input
              type='file'
              onChange={(event) => setAudioUpload(event.target.files[0])}
              style={{
                padding: '1vw',
                margin: '0.5vw auto',
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
        </div>
      </Modal>
    </>
  );
};

export default AudioSettingsModal;
