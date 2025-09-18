import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { StorageBrowser } from '@aws-amplify/ui-react-storage';
import { Authenticator } from '@aws-amplify/ui-react';
import JsonViewer from './components/JsonViewer';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react-storage/storage-browser-styles.css';

Amplify.configure(outputs);

function App() {
  const [selectedJsonFile, setSelectedJsonFile] = useState<{
    path: string;
    name: string;
  } | null>(null);

  const handleFileAction = (data: any) => {
    if (data?.path && data.path.toLowerCase().endsWith('.json')) {
      setSelectedJsonFile({
        path: data.path,
        name: data.path.split('/').pop() || 'unknown.json'
      });
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <h1>RADAR Project - File Browser</h1>
            <div>
              <span>Hello {user?.username}</span>
              <button onClick={signOut} style={{ marginLeft: '1rem' }}>
                Sign out
              </button>
            </div>
          </header>
          
          <main style={{ padding: '1rem' }}>
            <StorageBrowser 
              onActionStart={({ type, data }) => {
                if (type === 'DOWNLOAD' && data?.path?.endsWith('.json')) {
                  handleFileAction(data);
                  return { cancel: true }; // Cancel the default download
                }
                return { cancel: false };
              }}
            />
            
            {selectedJsonFile && (
              <JsonViewer
                path={selectedJsonFile.path}
                fileName={selectedJsonFile.name}
                onClose={() => setSelectedJsonFile(null)}
              />
            )}
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
