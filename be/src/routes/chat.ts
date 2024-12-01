import { Request, Response, Router } from 'express';
import OpenAI from 'openai';
import { reactBasePrompt } from '../default/react';
import { BASE_PROMPT } from '../default/basePrompt';
import { nodeBasePrompt } from '../default/node';
import { getSystemPrompt } from '../default/systemPromptForChat';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(),
        },
        { role: 'user', content: prompt },
      ],
      stream: true,
    });

    for await (const part of completion) {
      const content = part.choices[0].delta?.content;
      if (content) {
        res.write(`data: ${content}\n\n`);
      }
    }

    return res.end() as any;
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request.',
    });
  }
});

router.post('/target', async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
        },
        { role: 'user', content: prompt },
      ],
    });

    const answer = response.choices[0].message.content;
    console.log('Answer:', answer);
    
    if (!answer) {
      return res.status(500).json({ error: 'Failed to get a valid response from OpenAI.' });
    }

    if (answer === 'react') {
      return res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
    }

    if (answer === 'node') {
      return res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
    }

    return res.status(403).json({ message: "You can't access this" }) as any;
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
});


export default router;