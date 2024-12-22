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
    let content = match[2].trim();
    if (content.startsWith('```') && content.endsWith('```')) {
      const firstNewlineIndex = content.indexOf('\n');
      if (firstNewlineIndex !== -1) {
        content = content.substring(firstNewlineIndex + 1, content.length - 3).trim();
      }
    }

    steps.push(`Created or updated file: ${filePath}`);

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
      } else if (isFile) {
        node.content = content;
      }

      if (!isFile && !node.children) {
        node.children = [];
      }

      current = node.children || [];
    });
  }

  return { steps, fileStructure };
}


export const mergeFileStructures = (structure1: FileNode[], structure2: FileNode[]): FileNode[] => {
  const merged: Record<string, FileNode> = {};

  const addToMerged = (node: FileNode, basePath: string = '') => {
    const path = `${basePath}/${node.name}`;
    if (merged[path]) {
      if (node.type === 'folder' && merged[path].type === 'folder') {
        merged[path].children = mergeFileStructures(
          merged[path].children || [],
          node.children || []
        );
      } else if (node.type === 'file') {
        merged[path].content = node.content;
      }
    } else {
      merged[path] = { ...node };
    }
  };

  [...structure1, ...structure2].forEach((node) => addToMerged(node));

  return Object.values(merged);
}
