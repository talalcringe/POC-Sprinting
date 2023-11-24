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
  const [freesoundResults, setFreesoundResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedResults, setDisplayedResults] = useState(8);

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

  const searchFreesoundAudio = async () => {
    try {
      const apiKey = 'MapqUvbtruxt9yDY3UTnL9SQISAkmHXOm3RKNIBU';
      const response = await axios.get(
        `https://freesound.org/apiv2/search/text/?query=${searchQuery}&token=${apiKey}&format=json`
      );

      const freesoundResultsData = response.data;

      console.log('Freesound API response:', freesoundResultsData);

      if (freesoundResultsData.count === 0) {
        console.log('No Freesound audio found.');
        setFreesoundResults([]);
      } else {
        const soundInfoPromises = freesoundResultsData.results.map(
          async (result) => {
            const soundInfoResponse = await axios.get(
              `https://freesound.org/apiv2/sounds/${result.id}/?token=${apiKey}&format=json`
            );

            const soundInfo = soundInfoResponse.data;
            return {
              name: soundInfo.name,
              url: soundInfo.previews
                ? soundInfo.previews['preview-hq-mp3']
                : null,
            };
          }
        );

        const audioResults = await Promise.all(soundInfoPromises);

        console.log('Freesound audio results:', audioResults);
        setFreesoundResults(audioResults);
      }
    } catch (error) {
      console.error('Error fetching Freesound audio: ', error);
    }
  };

  useEffect(() => {
    listAll(audioListRef)
      .then((response) => {
        const promises = response.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const fileNameWithoutExtension = item.name.replace(/\.[^/.]+$/, '');
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

  const loadMoreResults = async () => {
    try {
      const apiKey = 'MapqUvbtruxt9yDY3UTnL9SQISAkmHXOm3RKNIBU';
      const nextPage = Math.ceil(displayedResults / 10) + 1;

      const response = await axios.get(
        'https://freesound.org/apiv2/search/text/',
        {
          params: {
            query: searchQuery,
            token: apiKey,
            page_size: 10,
            page: nextPage,
          },
        }
      );

      const additionalResults = response.data.results;

      if (additionalResults.length === 0) {
        console.log('No additional Freesound audio found.');
        return;
      }

      const soundInfoPromises = additionalResults.map(async (result) => {
        const soundInfoResponse = await axios.get(
          `https://freesound.org/apiv2/sounds/${result.id}/?token=${apiKey}&format=json`
        );

        const soundInfo = soundInfoResponse.data;
        return {
          name: soundInfo.name,
          url: soundInfo.previews ? soundInfo.previews['preview-hq-mp3'] : null,
        };
      });

      const newResults = await Promise.all(soundInfoPromises);

      setFreesoundResults(newResults);
      setDisplayedResults((prevCount) => prevCount + 10);
    } catch (error) {
      console.error('Error fetching additional Freesound audio: ', error);
    }
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

        {/* Section for Freesound audio */}
        <div style={{ textAlign: 'center', margin: '5vw auto' }}>
          <h3>Freesound Audio</h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Search input and button */}
            <input
              type='text'
              placeholder='Search Freesound Audio'
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '1vw',
                margin: '0.5vw',
                minWidth: 'max-content',
              }}
            />
            <button
              onClick={searchFreesoundAudio}
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

          {/* Audio selection and load more results */}
          <div
            className='audio-selection'
            style={{
              display: 'flex',
              flexWrap: 'wrap', // Allows items to wrap to the next line
              alignItems: 'center',
              justifyContent: 'center',
              overflowX: 'auto',
              whiteSpace: 'nowrap', // Prevents wrapping to the next line
              margin: '5vw auto',
            }}
          >
            {freesoundResults.map((audioInfo, index) => (
              <div
                key={audioInfo.name}
                style={{
                  margin: '0.5vw',
                  flexBasis: 'calc(50% - 1vw)', // Set the flex basis to 50% with margin included
                  boxSizing: 'border-box', // Ensure the margin is included in the width calculation
                }}
              >
                <button
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
                    minWidth: 'max-content',
                    width: '100%', // Ensure the button takes full width
                  }}
                >
                  {audioInfo.name}
                </button>
                <div>
                  {selectedAudio === audioInfo.name && (
                    <audio key={audioInfo.name} controls>
                      <source src={audioInfo.url} type='audio/mp3' />
                      Your browser does not support the audio tag.
                    </audio>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={loadMoreResults}
              style={{
                color: 'white',
                backgroundColor: 'black',
                padding: '1vw',
                margin: '0.5vw',
                minWidth: 'max-content',
                width: '100%', // Ensure the button takes full width
              }}
            >
              Load More
            </button>
          </div>
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
