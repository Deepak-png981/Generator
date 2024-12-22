'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SERVER_BASE_URL } from '@/constants/urls';
import { parseUIPrompts, FileNode, mergeFileStructures } from '@/lib/utils';
import EditorPage from './editor/page';
import { streamChatAPI } from './APIs/chat';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<{
    steps: string[];
    fileStructure: FileNode[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SERVER_BASE_URL}/target`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const uiPrompts = data.uiPrompts?.[0];
      const pormptToLLM = data.prompts?.[0];
      const { steps, fileStructure } = parseUIPrompts(uiPrompts);
      const {llmSteps , llmFileStructure} = await streamChatAPI(prompt + '\n' + pormptToLLM)
      console.log('llmsteps : ', llmSteps);
      console.log('llmFileStructure : ', llmFileStructure);
      const mergedSteps = [...steps, ...llmSteps];
      const mergedFileStructure = mergeFileStructures(fileStructure, llmFileStructure);

      console.log('mergedFileStructure : ', mergedFileStructure);
      

      setResponseData({ steps: mergedSteps, fileStructure: mergedFileStructure });
    } catch (error: any) {
      console.error('Error submitting prompt:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (responseData) {
    return <EditorPage steps={responseData.steps} fileStructure={responseData.fileStructure} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Web App Generator</h1>
        <p className="text-xl text-muted-foreground">
          Describe your web app and we&apos;ll help you build it
        </p>
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-2xl mx-auto">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your web app..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
