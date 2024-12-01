'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { SERVER_BASE_URL } from '@/constants/urls'


export default function LandingPage() {
  const [prompt, setPrompt] = useState('')
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
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
      console.log('Prompts:', data.prompts);
      console.log('UI Prompts:', data.uiPrompts);

      // Example navigation (if needed)
      router.push(`/editor?prompt=${encodeURIComponent(prompt)}`);
    } catch (error) {
      console.error('Error submitting prompt:', error);
    } finally {
      setLoading(false);
    }
  };

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
          />
          <Button type="submit">Generate</Button>
        </form>
      </div>
    </div>
  )
}

