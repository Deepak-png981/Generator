'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Sun, Moon } from 'lucide-react'
import { CodeEditor } from '@/components/editor'
import { FileExplorer } from '@/components/file-explorer'
import { Steps } from '@/components/steps'
import { Preview } from '@/components/preview'

export default function EditorPage() {
  const [view, setView] = useState<'code' | 'preview'>('code')
  const { theme, setTheme } = useTheme()
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Steps Sidebar */}
      <div className="w-1/5 border-r border-border">
        <Steps />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 flex">
          <div className="w-64 border-r border-border">
            <FileExplorer onFileSelect={setSelectedFile} />
          </div>
          <div className="flex-1">
            {view === 'code' ? (
              <CodeEditor file={selectedFile} />
            ) : (
              <Preview />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

