import { File, Folder } from 'lucide-react'
import { useState } from 'react'

interface FileExplorerProps {
  onFileSelect: (file: string) => void
}

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

export function FileExplorer({ onFileSelect }: FileExplorerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['/src']))

  const fileStructure: FileNode[] = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Editor.tsx', type: 'file' },
            { name: 'FileExplorer.tsx', type: 'file' },
            { name: 'Preview.tsx', type: 'file' }
          ]
        },
        { name: 'App.tsx', type: 'file' },
        { name: 'main.tsx', type: 'file' }
      ]
    }
  ]

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpanded(newExpanded)
  }

  const renderNode = (node: FileNode, path: string) => {
    const isExpanded = expanded.has(path)

    return (
      <div key={path} className="select-none">
        <div
          className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded cursor-pointer"
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(path)
            } else {
              onFileSelect(path)
            }
          }}
        >
          {node.type === 'folder' ? (
            <Folder className="h-4 w-4" />
          ) : (
            <File className="h-4 w-4" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div className="pl-4">
            {node.children.map((child) =>
              renderNode(child, `${path}/${child.name}`)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-2 h-full overflow-auto">
      {fileStructure.map((node) => renderNode(node, `/${node.name}`))}
    </div>
  )
}

