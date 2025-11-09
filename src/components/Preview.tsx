import React, { useState } from 'react';
import { type XmlNode } from '@/components/Editor';
import { formatXml } from '@/utils/xmlFormatter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PreviewProps {
  nodes: XmlNode[];
}

export const Preview: React.FC<PreviewProps> = ({ nodes }) => {
  const [copied, setCopied] = useState(false);
  
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
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Preview XML</h2>
        <Button 
          onClick={handleCopy}
          variant="outline"
          size="sm"
        >
          {copied ? '✓ Copié' : 'Copier'}
        </Button>
      </div>
      
      <Card className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono whitespace-pre">
          <code>{formattedXml}</code>
        </pre>
      </Card>
    </div>
  );
};
