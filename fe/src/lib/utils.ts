import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string | null;
}

export function parseUIPrompts(uiPrompt: string): { steps: string[]; fileStructure: FileNode[] } {
  const steps: string[] = [];
  const fileStructure: FileNode[] = [];
  
  const boltActionRegex = /<boltAction\s+[^>]*type="file"[^>]*filePath="([^"]+)"[^>]*>([\s\S]*?)<\/boltAction>/g;

  let match;
  while ((match = boltActionRegex.exec(uiPrompt)) !== null) {
    const filePath = match[1];
    const content = match[2];

    steps.push(`Created file: ${filePath}`);

    const parts = filePath.split('/');
    let current = fileStructure;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;

      let node = current.find(node => node.name === part);

      if (!node) {
        node = {
          name: part,
          type: isFile ? 'file' : 'folder',
          ...(isFile && { content }),
        };
        current.push(node);
      }

      if (!isFile && !node.children) {
        node.children = [];
      }

      current = node.children || [];
    });
  }

  return { steps, fileStructure };
}
