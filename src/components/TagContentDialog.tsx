import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
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
      setTimeout(() => textareaRef.current?.focus(), 0);
      setContent('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onInsertContent(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (content.trim()) {
        onInsertContent(content.trim());
        setContent('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-2xl p-4 border-0 shadow-2xl bg-background" 
        hideCloseButton
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Tag content</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Textarea
            ref={textareaRef}
            placeholder="Tag content... (Ctrl+Enter to submit)"
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
