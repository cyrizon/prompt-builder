import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';

interface UseShortcutsOptions {
  onOpenTagDialog: () => void;
  onOpenContentDialog: () => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
}

export function useShortcuts({ 
  onOpenTagDialog, 
  onOpenContentDialog, 
  onNavigateUp, 
  onNavigateDown 
}: UseShortcutsOptions) {
  useEffect(() => {
    // Appuyer sur c pour ouvrir la popup d'insertion de balise
    hotkeys('c', (event) => {
      event.preventDefault();
      onOpenTagDialog();
    });

    // Appuyer sur v pour ouvrir la popup de contenu
    hotkeys('v', (event) => {
      event.preventDefault();
      onOpenContentDialog();
    });

    // Flèche haut pour naviguer vers le haut
    hotkeys('up', (event) => {
      event.preventDefault();
      onNavigateUp();
    });

    // Flèche bas pour naviguer vers le bas
    hotkeys('down', (event) => {
      event.preventDefault();
      onNavigateDown();
    });

    // Cleanup
    return () => {
      hotkeys.unbind('c');
      hotkeys.unbind('v');
      hotkeys.unbind('up');
      hotkeys.unbind('down');
    };
  }, [onOpenTagDialog, onOpenContentDialog, onNavigateUp, onNavigateDown]);
}
