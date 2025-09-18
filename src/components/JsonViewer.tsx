import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import './JsonViewer.css';

interface JsonViewerProps {
  fileKey: string;
  fileName: string;
  onClose: () => void;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ fileKey, fileName, onClose }) => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the file content from S3
        const result = await Storage.get(fileKey, {
          download: true,
          contentType: 'application/json'
        });
        
        // Convert the Body (Uint8Array) to string
        const decoder = new TextDecoder('utf-8');
        const jsonString = decoder.decode(result.Body as Uint8Array);
        
        // Parse the JSON string
        const parsedJson = JSON.parse(jsonString);
        setJsonData(parsedJson);
      } catch (err) {
        console.error('Error fetching or parsing JSON:', err);
        setError('Failed to load or parse JSON file');
      } finally {
        setLoading(false);
      }
    };

    fetchJsonData();
  }, [fileKey]);

  const renderJsonValue = (value: any, level: number = 0): React.ReactNode => {
    const indent = '  '.repeat(level);
    
    if (value === null) return <span className="json-null">null</span>;
    if (typeof value === 'boolean') return <span className="json-boolean">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="json-number">{value}</span>;
    if (typeof value === 'string') return <span className="json-string">"{value}"</span>;
    
    if (Array.isArray(value)) {
      return (
        <div className="json-array">
          <span className="json-bracket">[</span>
          {value.map((item, index) => (
            <div key={index} className="json-array-item">
              {indent}  {renderJsonValue(item, level + 1)}
              {index < value.length - 1 && <span className="json-comma">,</span>}
            </div>
          ))}
          <div>{indent}<span className="json-bracket">]</span></div>
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      return (
        <div className="json-object">
          <span className="json-bracket">{'{'}</span>
          {entries.map(([objKey, objValue], index) => (
            <div key={objKey} className="json-object-item">
              {indent}  <span className="json-key">"{objKey}"</span>
              <span className="json-colon">: </span>
              {renderJsonValue(objValue, level + 1)}
              {index < entries.length - 1 && <span className="json-comma">,</span>}
            </div>
          ))}
          <div>{indent}<span className="json-bracket">{'}'}</span></div>
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  if (loading) {
    return (
      <div className="json-viewer-overlay">
        <div className="json-viewer-modal">
          <div className="json-viewer-header">
            <h3>Loading JSON...</h3>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          <div className="json-viewer-content">
            <div className="loading-spinner">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="json-viewer-overlay">
        <div className="json-viewer-modal">
          <div className="json-viewer-header">
            <h3>Error Loading JSON</h3>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          <div className="json-viewer-content">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="json-viewer-overlay">
      <div className="json-viewer-modal">
        <div className="json-viewer-header">
          <h3>{fileName}</h3>
          <div className="json-viewer-controls">
            <button 
              onClick={() => {
                const dataStr = JSON.stringify(jsonData, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="download-button"
            >
              Download
            </button>
            <button onClick={onClose} className="close-button">×</button>
          </div>
        </div>
        <div className="json-viewer-content">
          <pre className="json-display">
            {renderJsonValue(jsonData)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;
