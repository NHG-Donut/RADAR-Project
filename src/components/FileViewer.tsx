import React, { useState, useEffect } from 'react';
import './FileViewer.css';

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
  fileName: string;
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileType, fileName, onClose }) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (fileType.startsWith('text/') || fileType === 'application/json') {
      setLoading(true);
      fetch(fileUrl)
        .then(response => response.text())
        .then(content => {
          setFileContent(content);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load file content');
          setLoading(false);
        });
    }
  }, [fileUrl, fileType]);

  const renderFileContent = () => {
    if (loading) return <div className="loading">Loading file...</div>;
    if (error) return <div className="error">{error}</div>;

    if (fileType.startsWith('text/') || fileType === 'application/json') {
      return (
        <div className="file-viewer-text">
          <pre>{fileContent}</pre>
        </div>
      );
    } else if (fileType.startsWith('image/')) {
      return (
        <div className="file-viewer-image">
          <img 
            src={fileUrl} 
            alt={fileName}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <iframe
          src={fileUrl}
          width="100%"
          height="600px"
          title={fileName}
          className="file-viewer-pdf"
        />
      );
    } else {
      return (
        <div className="file-viewer-unsupported">
          <p>Preview not available for this file type: {fileType}</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download file
          </a>
        </div>
      );
    }
  };

  return (
    <div className="file-viewer-container">
      <div className="file-viewer-header">
        <h3>{fileName}</h3>
        <button onClick={onClose} className="close-button">
          ✕
        </button>
      </div>
      <div className="file-viewer-content">
        {renderFileContent()}
      </div>
    </div>
  );
};

export default FileViewer;
