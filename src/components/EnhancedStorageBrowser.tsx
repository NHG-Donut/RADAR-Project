import React, { useState } from 'react';
import { 
  createAmplifyAuthAdapter, 
  createStorageBrowser,
  defaultActionConfigs,
  defaultHandlers
} from '@aws-amplify/ui-react-storage/browser';
import { getUrl } from 'aws-amplify/storage';
import '@aws-amplify/ui-react-storage/styles.css';
import FileViewer from './FileViewer';
import './EnhancedStorageBrowser.css';

interface SelectedFile {
  url: string;
  type: string;
  name: string;
}

const EnhancedStorageBrowser: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [showViewer, setShowViewer] = useState<boolean>(false);

  // Create custom Storage Browser with preview action
  const { StorageBrowser } = createStorageBrowser({
    config: createAmplifyAuthAdapter(),
    actions: {
      default: {
        download: {
          ...defaultActionConfigs.download,
          handler: async (input) => {
            try {
              // Get file URL for preview
              const urlResult = await getUrl({ 
                path: input.data.path,
                options: { 
                  expiresIn: 3600,
                  useAccelerateEndpoint: false 
                }
              });
              
              // Determine file type from path extension or use provided type
              const fileName = input.data.path.split('/').pop() || 'Unknown';
              const fileExtension = fileName.split('.').pop()?.toLowerCase();
              
              let mimeType = input.data.type || 'application/octet-stream';
              
              // Map common extensions to MIME types
              const mimeTypeMap: { [key: string]: string } = {
                'txt': 'text/plain',
                'json': 'application/json',
                'js': 'text/javascript',
                'jsx': 'text/javascript',
                'ts': 'text/typescript',
                'tsx': 'text/typescript',
                'css': 'text/css',
                'html': 'text/html',
                'md': 'text/markdown',
                'xml': 'text/xml',
                'csv': 'text/csv',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'svg': 'image/svg+xml',
                'pdf': 'application/pdf'
              };
              
              if (fileExtension && mimeTypeMap[fileExtension]) {
                mimeType = mimeTypeMap[fileExtension];
              }

              // Show file viewer instead of downloading
              setSelectedFile({
                url: urlResult.url.toString(),
                type: mimeType,
                name: fileName
              });
              setShowViewer(true);
              
              // Return empty result to prevent default download
              return { result: Promise.resolve({ status: 'COMPLETE' as const }) };
            } catch (error) {
              console.error('Error previewing file:', error);
              // Fall back to default download behavior
              return defaultHandlers.download(input);
            }
          }
        }
      },
      custom: {
        preview: {
          displayName: 'Preview',
          icon: 'visibility' as any,
          actionHandler: async ({ data }) => {
            try {
              const urlResult = await getUrl({ 
                path: data.path,
                options: { 
                  expiresIn: 3600,
                  useAccelerateEndpoint: false 
                }
              });
              
              const fileName = data.path.split('/').pop() || 'Unknown';
              const fileExtension = fileName.split('.').pop()?.toLowerCase();
              
              let mimeType = data.type || 'application/octet-stream';
              
              const mimeTypeMap: { [key: string]: string } = {
                'txt': 'text/plain',
                'json': 'application/json',
                'js': 'text/javascript',
                'jsx': 'text/javascript',
                'ts': 'text/typescript',
                'tsx': 'text/typescript',
                'css': 'text/css',
                'html': 'text/html',
                'md': 'text/markdown',
                'xml': 'text/xml',
                'csv': 'text/csv',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'svg': 'image/svg+xml',
                'pdf': 'application/pdf'
              };
              
              if (fileExtension && mimeTypeMap[fileExtension]) {
                mimeType = mimeTypeMap[fileExtension];
              }

              setSelectedFile({
                url: urlResult.url.toString(),
                type: mimeType,
                name: fileName
              });
              setShowViewer(true);
            } catch (error) {
              console.error('Error previewing file:', error);
            }
          }
        }
      }
    }
  });

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedFile(null);
  };

  return (
    <div className="enhanced-storage-browser">
      <div className={`browser-section ${showViewer ? 'with-viewer' : 'full-width'}`}>
        <StorageBrowser />
      </div>
      {showViewer && selectedFile && (
        <div className="viewer-section">
          <FileViewer
            fileUrl={selectedFile.url}
            fileType={selectedFile.type}
            fileName={selectedFile.name}
            onClose={handleCloseViewer}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedStorageBrowser;
