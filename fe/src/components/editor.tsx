'use client'

import { useTheme } from 'next-themes'
import { Editor as MonacoEditor } from '@monaco-editor/react'

interface CodeEditorProps {
  file: string | null
}

export function CodeEditor({ file }: CodeEditorProps) {
  const { theme } = useTheme()

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
        }}
        value={file ? '// Loading...' : '// Select a file to edit'}
      />
    </div>
  )
}

