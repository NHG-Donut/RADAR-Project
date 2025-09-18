import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import EnhancedStorageBrowser from './components/EnhancedStorageBrowser';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

// Import your Amplify configuration
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

function App() {
  return (
    <Authenticator>
      <div className="App">
        <header className="App-header">
          <h1>RADAR Project - File Browser</h1>
        </header>
        <main className="App-main">
          <EnhancedStorageBrowser />
        </main>
      </div>
    </Authenticator>
  );
}

export default App;
