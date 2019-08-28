import React from 'react';
import './App.css';
import Tesseract from 'tesseract.js';
import fortis from './Frame3.png';

const App = () => {
  const [uploads, setUploads] = React.useState([]);
  const [processedUploads, setProcessedUploads] = React.useState([]);
  const [progress, setProgress] = React.useState(0);
  const handleChange = event => {
    if (event.target.files[0]) {
      var uploads = [];
      for (var key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key];
        uploads.push(URL.createObjectURL(upload));
      }
      setUploads(uploads);
    } else {
      setUploads(uploads);
    }
  };

  const generateText = () => {
    uploads.map(file => {
      Tesseract.recognize(file, 'nld')
        .progress(p => {
          console.log('progress', p);

          setProgress(p.progress);
        })
        .then(result => {
          const upload = {
            text: result.text,
            confidence: result.confidence
          };
          setProcessedUploads(processedUploads => [
            ...processedUploads,
            upload
          ]);
        });
    });
  };
  return (
    <div className="app">
      <header className="header">
        <h1>krisdevs.com - OCR </h1>
      </header>

      {/* File uploader */}
      <section className="hero">
        <label className="fileUploaderContainer">
          Click here to upload documents
          <input
            type="file"
            id="fileUploader"
            onChange={handleChange}
            multiple
          />
        </label>

        <div>
          {uploads.map((upload, key) => (
            <img key={key} src={upload} alt="file" width="100px" />
          ))}
        </div>

        <button className="button" onClick={generateText}>
          Generate
        </button>
        <div className="progress">
          <div className="x" style={{ width: Math.round(progress * 100) + `%` }}>
            {Math.round(progress * 100)}
          </div>
        </div>
      </section>

      <section className="results">
        {processedUploads.map((result, index) => (
          <div key={index} className="results__result">
            <div className="results__result__image">
              <img src={uploads[index]} alt={index} width="250px" />
            </div>
            <div className="results__result__info">
              <div className="results__result__info__codes">
                <small>
                  <strong>Confidence Score:</strong> {result.confidence}
                </small>
              </div>

              <div className="results__result__info__text">
                <small>
                  <strong>Full Output:</strong>
                  <pre>{result.text}</pre>
                </small>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default App;
