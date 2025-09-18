import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { createAmplifyAuthAdapter, createStorageBrowser } from '@aws-amplify/ui-react-storage/browser';
import JsonViewer from './components/JsonViewer';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react-storage/styles.css';

Amplify.configure(outputs);

// Create custom Storage Browser with JSON viewer action
const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
  actions: {
    custom: {
      viewJson: {
        actionListItem: {
          icon: 'view' as any,
          label: 'View JSON',
          disable: (selected) => !selected?.some(item => item.key?.endsWith('.json')),
        },
        handler: async ({ key }) => {
          return { 
            result: Promise.resolve({ 
              status: 'COMPLETE' as const, 
              value: { key } 
            }) 
          };
        },
        viewName: 'ViewJsonView',
      },
    },
  },
});

// Custom view for JSON display
const ViewJsonView = () => {
  const [selectedFile, setSelectedFile] = React.useState<{ path: string; name: string } | null>(null);
  
  React.useEffect(() => {
    // Get selected file info from URL or state management
    // This is simplified - you'd need to pass the selected file data
  }, []);

  if (selectedFile) {
    return (
      <JsonViewer
        path={selectedFile.path}
        fileName={selectedFile.name}
        onClose={() => setSelectedFile(null)}
      />
    );
  }

  return <div>No JSON file selected</div>;
};

function App() {
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
              views={{ ViewJsonView }}
            />
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
