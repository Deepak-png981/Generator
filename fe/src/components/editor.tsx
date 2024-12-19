'use client';

import { useTheme } from 'next-themes';
import { Editor as MonacoEditor } from '@monaco-editor/react';

interface CodeEditorProps {
  content: string | null;
}

export function CodeEditor({ content }: { content: string | null }) {
  const { theme } = useTheme();

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        defaultLanguage="typescript"
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          snippetSuggestions: 'none',
          wordBasedSuggestions: 'off',
          tabCompletion: 'off',
          acceptSuggestionOnEnter: 'off',
        }}
        value={content || '// Loading...'}
      />
    </div>
  );
}
