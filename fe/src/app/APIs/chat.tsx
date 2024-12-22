import { SERVER_BASE_URL } from "@/constants/urls";
import { FileNode, parseUIPrompts } from "@/lib/utils";

export const streamChatAPI = async (prompt: string) : Promise<{ llmSteps: string[], llmFileStructure: FileNode[] }> => {
    const response = await fetch(`${SERVER_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
  
    if (!response.ok) {
      console.error('Failed to connect to the API:', response.statusText);
      return { llmSteps: [], llmFileStructure: [] };
    }
    const data = await response.json();
    const llmResponse = data.chat;
    const { steps, fileStructure } = parseUIPrompts(llmResponse);
    return { llmSteps: steps, llmFileStructure: fileStructure };
  }
  