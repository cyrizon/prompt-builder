import React, { useState } from 'react';
import { type XmlNode } from '@/components/Editor';
import { formatXml } from '@/utils/xmlFormatter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PreviewProps {
  nodes: XmlNode[];
}

const AI_SERVICES = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    logo: '/ai-logos/chatgpt.svg',
    color: 'hover:bg-green-50 dark:hover:bg-green-950',
  },
  {
    name: 'Claude',
    url: 'https://claude.ai/new',
    logo: '/ai-logos/claude.svg',
    color: 'hover:bg-orange-50 dark:hover:bg-orange-950',
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
    logo: '/ai-logos/gemini.svg',
    color: 'hover:bg-blue-50 dark:hover:bg-blue-950',
  },
  {
    name: 'Mistral',
    url: 'https://chat.mistral.ai/chat',
    logo: '/ai-logos/mistral.svg',
    color: 'hover:bg-purple-50 dark:hover:bg-purple-950',
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/',
    logo: '/ai-logos/perplexity.svg',
    color: 'hover:bg-teal-50 dark:hover:bg-teal-950',
  },
  {
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    logo: '/ai-logos/deepseek.svg',
    color: 'hover:bg-indigo-50 dark:hover:bg-indigo-950',
  },
  {
    name: 'HuggingChat',
    url: 'https://huggingface.co/chat/',
    logo: '/ai-logos/huggingchat.svg',
    color: 'hover:bg-yellow-50 dark:hover:bg-yellow-950',
  },
  {
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com/',
    logo: '/ai-logos/copilot.svg',
    color: 'hover:bg-cyan-50 dark:hover:bg-cyan-950',
  },
];

export const Preview: React.FC<PreviewProps> = ({ nodes }) => {
  const [copied, setCopied] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  
  const formattedXml = formatXml(nodes);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedXml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSendToAI = async (aiUrl: string) => {
    await navigator.clipboard.writeText(formattedXml);
    window.open(aiUrl, '_blank');
    setIsAiDialogOpen(false);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">XML Preview</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleCopy}
            variant="outline"
            size="sm"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
          <Button 
            onClick={() => setIsAiDialogOpen(true)}
            variant="outline"
            size="sm"
          >
            Send to AI
          </Button>
        </div>
      </div>
      
      <Card className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono whitespace-pre">
          <code>{formattedXml}</code>
        </pre>
      </Card>

      {/* AI selection dialog */}
      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-center">Choose an AI</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {AI_SERVICES.map((ai) => (
              <button
                key={ai.name}
                onClick={() => handleSendToAI(ai.url)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent transition-all ${ai.color} hover:border-primary`}
              >
                <div className="text-foreground">
                  <img src={ai.logo} alt={ai.name} className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium">{ai.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground">
            The prompt will be copied to your clipboard
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
