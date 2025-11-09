import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface TagInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertTag: (tagName: string) => void;
}

export function TagInputDialog({ open, onOpenChange, onInsertTag }: TagInputDialogProps) {
  const [tagName, setTagName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
      setTagName('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagName.trim()) {
      onInsertTag(tagName.trim());
      setTagName('');
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md p-4 border-0 shadow-2xl bg-background" 
        hideCloseButton
        aria-describedby={undefined}
      >
  <DialogTitle className="sr-only">Tag name</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Tag name..."
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
