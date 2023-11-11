import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import { Editor } from 'primereact/editor';
import { useState, useEffect, useContext } from 'react';
import SettingsContext from './SettingsContext';

function Notebook() {
  const [editorValue, setEditorValue] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const settingsInfo = useContext(SettingsContext);

  useEffect(() => {
    settingsInfo.setWordCount(wordCount);
  }, [wordCount]);

  useEffect(() => {
    setWordCount(countWords(editorValue));
  }, [editorValue]);

  const handleEditorChange = (e) => {
    setEditorValue(e.htmlValue);
  };

  useEffect(() => {
    if (settingsInfo.showSettings) {
      setEditorValue('');
    }
  }, [settingsInfo.showSettings]);

  const countWords = (value) => {
    const plainText = value
      ? value
          .replace(/<\/?(p|br|h[1-6])\b[^>]*>/gi, ' ')
          .replace(/<[^>]+>/g, '')
      : '';
    const words = plainText.trim().split(/\s+/);
    const wordsWithoutEmptyLines = words.filter((word) => word.trim() !== '');
    return wordsWithoutEmptyLines.length;
  };

  return (
    <>
      <div
        style={{
          color: 'white',
          fontSize: '20px',
          textAlign: 'right',
          fontWeight: 'bold',
        }}
      >
        <h2 style={{ color: 'rgb(225,135,0)' }}>Word Count: {wordCount}</h2>
      </div>
      <Editor
        style={{ height: '90vh' }}
        value={editorValue}
        onTextChange={handleEditorChange}
      />
    </>
  );
}
export default Notebook;
