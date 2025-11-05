import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';

interface UseShortcutsOptions {
  onOpenTagDialog: () => void;
  onOpenContentDialog: () => void;
}

export function useShortcuts({ onOpenTagDialog, onOpenContentDialog }: UseShortcutsOptions) {
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

    // Cleanup
    return () => {
      hotkeys.unbind('c');
      hotkeys.unbind('v');
    };
  }, [onOpenTagDialog, onOpenContentDialog]);
}
