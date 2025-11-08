import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface TagContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertContent: (content: string) => void;
}

export function TagContentDialog({ open, onOpenChange, onInsertContent }: TagContentDialogProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      // Focus le textarea quand la dialog s'ouvre
      setTimeout(() => textareaRef.current?.focus(), 0);
      setContent('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onInsertContent(content.trim());
      setContent('');
      // Ne pas fermer ici, laisser le parent gérer
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
    // Ctrl/Cmd + Enter pour valider
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (content.trim()) {
        onInsertContent(content.trim());
        setContent('');
        // Ne pas fermer ici, laisser le parent gérer
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-2xl p-4 border-0 shadow-2xl bg-background" 
        hideCloseButton
      >
        <form onSubmit={handleSubmit}>
          <Textarea
            ref={textareaRef}
            placeholder="Contenu de la balise... (Ctrl+Entrée pour valider)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[200px] resize-none"
            rows={10}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
