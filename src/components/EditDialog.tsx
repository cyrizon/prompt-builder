import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { XmlNode } from './Editor';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: XmlNode | null;
  onSave: (updatedNode: XmlNode) => void;
}

export function EditDialog({ open, onOpenChange, node, onSave }: EditDialogProps) {
  const [tagName, setTagName] = useState('');
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && node) {
      if (node.type === 'tag') {
        setTagName(node.tagName || '');
        setContent(node.content || '');
        setTimeout(() => inputRef.current?.focus(), 0);
      } else {
        setContent(node.content || '');
        setTimeout(() => textareaRef.current?.focus(), 0);
      }
    } else if (!open) {
      setTagName('');
      setContent('');
    }
  }, [open, node]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!node) return;

    if (node.type === 'tag') {
      if (tagName.trim()) {
        onSave({
          ...node,
          tagName: tagName.trim(),
          content: content.trim() || undefined,
        });
        onOpenChange(false);
      }
    } else {
      if (content.trim()) {
        onSave({
          ...node,
          content: content.trim(),
        });
        onOpenChange(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  if (!node) return null;

  if (node.type === 'tag') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="sm:max-w-md p-4 border-0 shadow-2xl bg-background" 
          hideCloseButton
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Edit tag</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Tag name..."
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onOpenChange(false);
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  textareaRef.current?.focus();
                  textareaRef.current?.focus();
                }
              }}
            />
            <Textarea
              ref={textareaRef}
              placeholder="Content (optional)... (Ctrl+Enter to submit)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onOpenChange(false);
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              className="min-h-[100px]"
              rows={5}
            />
          </form>
        </DialogContent>
      </Dialog>
    );
}  // Type 'content'
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-2xl p-4 border-0 shadow-2xl bg-background" 
        hideCloseButton
        aria-describedby={undefined}
      >
  <DialogTitle className="sr-only">Edit content</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Textarea
            ref={textareaRef}
            placeholder="Content... (Ctrl+Enter to submit)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onOpenChange(false);
              } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
            className="min-h-[200px] resize-none"
            rows={10}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
