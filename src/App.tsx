import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { createAmplifyAuthAdapter, createStorageBrowser } from '@aws-amplify/ui-react-storage/browser';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react-storage/styles.css';

Amplify.configure(outputs);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

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
            <StorageBrowser />
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
              <p><strong>Note:</strong> To view JSON files inline, right-click on any .json file and select "View JSON" from the context menu (this feature requires the custom action implementation above).</p>
            </div>
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
