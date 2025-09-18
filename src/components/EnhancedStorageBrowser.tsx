import React, { useState } from 'react';
import { 
  createAmplifyAuthAdapter, 
  createStorageBrowser
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

interface FileData {
  path: string;
  type?: string;
  [key: string]: any;
}

const EnhancedStorageBrowser: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [showViewer, setShowViewer] = useState<boolean>(false);

  // Helper function to get MIME type from file extension
  const getMimeTypeFromExtension = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
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
    
    return extension && mimeTypeMap[extension] ? mimeTypeMap[extension] : 'application/octet-stream';
  };

  // Custom preview handler
  const handleFilePreview = async (fileData: FileData) => {
    try {
      const urlResult = await getUrl({ 
        path: fileData.path,
        options: { 
          expiresIn: 3600,
          useAccelerateEndpoint: false 
        }
      });
      
      const fileName = fileData.path.split('/').pop() || 'Unknown';
      const mimeType = fileData.type || getMimeTypeFromExtension(fileName);

      setSelectedFile({
        url: urlResult.url.toString(),
        type: mimeType,
        name: fileName
      });
      setShowViewer(true);
    } catch (error) {
      console.error('Error previewing file:', error);
    }
  };

  // Create Storage Browser with custom actions
  const { StorageBrowser } = createStorageBrowser({
    config: createAmplifyAuthAdapter(),
    actions: {
      custom: {
        preview: {
          actionHandler: async ({ data }: { data: FileData }) => {
            await handleFilePreview(data);
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
