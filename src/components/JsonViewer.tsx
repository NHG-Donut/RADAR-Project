import React, { useState, useEffect } from 'react';
import { downloadData } from 'aws-amplify/storage';
import './JsonViewer.css';

interface JsonViewerProps {
  path: string;
  fileName: string;
  onClose: () => void;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ path, fileName, onClose }) => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use Amplify Gen 2 storage API
        const downloadResult = await downloadData({
          path: path,
        }).result;
        
        // Convert the Body to text
        const text = await downloadResult.body.text();
        
        // Parse the JSON string
        const parsedJson = JSON.parse(text);
        setJsonData(parsedJson);
      } catch (err) {
        console.error('Error fetching or parsing JSON:', err);
        setError('Failed to load or parse JSON file');
      } finally {
        setLoading(false);
      }
    };

    fetchJsonData();
  }, [path]);

  // ... rest of the component (same as previous CSS and render methods)
};

export default JsonViewer;
