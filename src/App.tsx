import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { createAmplifyAuthAdapter, createStorageBrowser } from '@aws-amplify/ui-react-storage/browser';
import JsonViewer from './components/JsonViewer';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react-storage/styles.css';

Amplify.configure(outputs);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

function App() {
  const [selectedJsonFile, setSelectedJsonFile] = useState<{
    path: string;
    name: string;
  } | null>(null);

  const handleJsonFileClick = (path: string) => {
    const fileName = path.split('/').pop() || 'unknown.json';
    setSelectedJsonFile({ path, name: fileName });
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
            <StorageBrowser />
            
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#f0f8ff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}>
              <h3>JSON File Viewer</h3>
              <p>To view JSON files inline, enter the file path below:</p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter JSON file path (e.g., public/data.json)"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      const path = target.value.trim();
                      if (path.toLowerCase().endsWith('.json')) {
                        handleJsonFileClick(path);
                      } else {
                        alert('Please enter a valid JSON file path ending with .json');
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                    const path = input?.value.trim();
                    if (path && path.toLowerCase().endsWith('.json')) {
                      handleJsonFileClick(path);
                    } else {
                      alert('Please enter a valid JSON file path ending with .json');
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  View JSON
                </button>
              </div>
              <small style={{ color: '#666', marginTop: '8px', display: 'block' }}>
                Example paths: public/config.json, private/123abc/data.json
              </small>
            </div>
            
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
