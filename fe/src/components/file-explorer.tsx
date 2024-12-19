import { FileNode } from "@/lib/utils";
import { useState } from "react";
import { File, Folder } from 'lucide-react'
interface FileExplorerProps {
  fileStructure: FileNode[];
  onFileSelect: (filePath: string, content: string | undefined) => void;
}

export function FileExplorer({ fileStructure, onFileSelect }: FileExplorerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['/src']));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const renderNode = (node: FileNode, path: string) => {
    const isExpanded = expanded.has(path);

    return (
      <div key={path} className="select-none">
        <div
          className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded cursor-pointer"
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(path);
            } else {
              onFileSelect(path, node.content ? node.content : '');
            }
          }}
        >
          {node.type === 'folder' ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div className="pl-4">
            {node.children.map((child) => renderNode(child, `${path}/${child.name}`))}
          </div>
        )}
      </div>
    );
  };

  return <div className="p-2 h-full overflow-auto">{fileStructure.map((node) => renderNode(node, `/${node.name}`))}</div>;
}
