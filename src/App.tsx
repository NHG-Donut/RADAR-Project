import React, { useState } from 'react';
import { StorageBrowser } from '@aws-amplify/ui-react-storage';
import JsonViewer from './components/JsonViewer';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

function App() {
  const [selectedJsonFile, setSelectedJsonFile] = useState<{
    key: string;
    name: string;
  } | null>(null);

  const defaultPrefixes = [
    'public/',
    (identityId: string) => `protected/${identityId}/`,
    (identityId: string) => `private/${identityId}/`,
  ];

  const handleFileClick = (file: any) => {
    if (file.key && file.key.toLowerCase().endsWith('.json')) {
      setSelectedJsonFile({
        key: file.key,
        name: file.key.split('/').pop() || 'unknown.json'
      });
    }
  };

  return (
    <div className="App">
      <StorageBrowser
        defaultPrefixes={defaultPrefixes}
        onActionStart={(details) => {
          if (details.type === 'DOWNLOAD' && details.data?.key?.endsWith('.json')) {
            handleFileClick(details.data);
            return { cancel: true }; // Prevent default download
          }
        }}
      />
      
      {selectedJsonFile && (
        <JsonViewer
          fileKey={selectedJsonFile.key}
          fileName={selectedJsonFile.name}
          onClose={() => setSelectedJsonFile(null)}
        />
      )}
    </div>
  );
}

export default App;
