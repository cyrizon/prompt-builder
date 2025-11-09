import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';

interface UseShortcutsOptions {
  onOpenTagDialog: () => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onIndent: () => void;
  onUnindent: () => void;
  onOpenHelp: () => void;
}

export function useShortcuts({ 
  onOpenTagDialog, 
  onNavigateUp, 
  onNavigateDown,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  onIndent,
  onUnindent,
  onOpenHelp
}: UseShortcutsOptions) {
  useEffect(() => {
    // Create a new tag
    hotkeys('c', (event) => {
      event.preventDefault();
      onOpenTagDialog();
    });

    // Edit selected element
    hotkeys('e', (event) => {
      event.preventDefault();
      onEdit();
    });

    // Navigate up
    hotkeys('up', (event) => {
      event.preventDefault();
      onNavigateUp();
    });

    // Navigate down
    hotkeys('down', (event) => {
      event.preventDefault();
      onNavigateDown();
    });

    // Move element up
    hotkeys('alt+up', (event) => {
      event.preventDefault();
      onMoveUp();
    });

    // Move element down
    hotkeys('alt+down', (event) => {
      event.preventDefault();
      onMoveDown();
    });

    // Indent element
    hotkeys('tab', (event) => {
      event.preventDefault();
      onIndent();
    });

    // Unindent element
    hotkeys('shift+tab', (event) => {
      event.preventDefault();
      onUnindent();
    });

    // Delete selected element
    hotkeys('del, delete', (event) => {
      event.preventDefault();
      onDelete();
    });

    // Open help dialog
    hotkeys('h', (event) => {
      event.preventDefault();
      onOpenHelp();
    });

    return () => {
      hotkeys.unbind('c');
      hotkeys.unbind('e');
      hotkeys.unbind('up');
      hotkeys.unbind('down');
      hotkeys.unbind('alt+up');
      hotkeys.unbind('alt+down');
      hotkeys.unbind('tab');
      hotkeys.unbind('shift+tab');
      hotkeys.unbind('del, delete');
      hotkeys.unbind('h');
    };
  }, [onOpenTagDialog, onNavigateUp, onNavigateDown, onDelete, onEdit, onMoveUp, onMoveDown, onIndent, onUnindent, onOpenHelp]);
}
