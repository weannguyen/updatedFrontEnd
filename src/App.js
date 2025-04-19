import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function SheetifyApp() {
  const [file, setFile] = useState(null);
  const [instrument, setInstrument] = useState('piano');
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'audio/wav') {
      setFile(selected);
    } else {
      alert('Only .wav files are supported.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!file) return alert('Please upload a .wav file.');
    setLoading(true);
    setDownloadLink('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `https://music-ai-backend-with-instrument.onrender.com/upload-audio/?instrument=${instrument}`,
        formData,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadLink(url);
    } catch (error) {
      alert('Error generating sheet: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-6 text-center font-sans">
      <h1 className="text-4xl font-bold text-indigo-800 mb-4">Sheetify</h1>
      <p className="mb-6 text-gray-700 text-lg">Turn your audio into music sheets with AI</p>

      <div className="mb-4">
        <button
          onClick={handleUploadClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Choose .wav File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".wav"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
      </div>

      <div className="mb-4">
        <label className="mr-2 text-gray-700">Instrument:</label>
        <select
          className="p-2 rounded border border-gray-300"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
        >
          <option value="piano">Piano</option>
          <option value="guitar">Guitar</option>
          <option value="bass">Bass</option>
          <option value="drums">Drums</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Sheet'}
      </button>

      {downloadLink && (
        <div className="mt-6">
          <p className="text-gray-800">Your music sheet is ready!</p>
          <a
            href={downloadLink}
            download={`music_output_${instrument}.musicxml`}
            className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download Sheet
          </a>
        </div>
      )}
    </div>
  );
}
