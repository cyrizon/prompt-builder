import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-center">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Creation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Creation</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Create a new tag</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">C</kbd>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Navigate up</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">↑</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Navigate down</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">↓</kbd>
              </div>
            </div>
          </div>

          {/* Editing */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Editing</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Edit selected element</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">E</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Delete selected element</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Del</kbd>
              </div>
            </div>
          </div>

          {/* Move */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Move</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Move up</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Alt + ↑</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Move down</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Alt + ↓</kbd>
              </div>
            </div>
          </div>

          {/* Indentation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Indentation</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Indent (become child of previous element)</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Tab</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Unindent (move up to parent level)</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Shift + Tab</kbd>
              </div>
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Help</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Show this help</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">H</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Close dialogs</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
