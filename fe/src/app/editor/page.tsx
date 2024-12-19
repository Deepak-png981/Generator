'use client';

import { useState, useEffect } from 'react';
import { Steps } from '@/components/steps';
import { FileExplorer } from '@/components/file-explorer';
import { FileNode } from '@/lib/utils';
import { CodeEditor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';

interface EditorPageProps {
  steps: string[];
  fileStructure: FileNode[];
}

export default function EditorPage({ steps, fileStructure }: EditorPageProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [view, setView] = useState<'code' | 'preview'>('code');

  useEffect(() => {
    if (fileStructure.length > 0 && !selectedFile) {
      const firstFile = fileStructure[0];
      setSelectedFile(firstFile.name || null);
      setFileContent(firstFile.content || '');
    }
  }, [fileStructure, selectedFile]);

  const handleFileSelect = (filePath: string, content: string | undefined) => {
    setSelectedFile(filePath);
    setFileContent(content || '');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-1/5 border-r border-border">
        <Steps steps={steps} />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border px-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={view === 'code' ? 'default' : 'outline'}
              onClick={() => setView('code')}
              size="sm"
            >
              Code
            </Button>
            <Button
              variant={view === 'preview' ? 'default' : 'outline'}
              onClick={() => setView('preview')}
              size="sm"
            >
              Preview
            </Button>
          </div>
        </header>
        <div className="flex-1 flex">
          <div className="w-64 border-r border-border">
            <FileExplorer fileStructure={fileStructure} onFileSelect={handleFileSelect} />
          </div>
          <div className="flex-1">
            {view === 'code' ? (
              <CodeEditor content={fileContent} />
            ) : (
              <Preview />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
