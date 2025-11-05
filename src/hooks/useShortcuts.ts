import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';

interface UseShortcutsOptions {
  onOpenTagDialog: () => void;
}

export function useShortcuts({ onOpenTagDialog }: UseShortcutsOptions) {
  useEffect(() => {
    // Appuyer sur c pour ouvrir la popup d'insertion de balise
    hotkeys('c, c', (event) => {
      event.preventDefault();
      onOpenTagDialog();
    });

    // Cleanup
    return () => {
      hotkeys.unbind('c, c');
    };
  }, [onOpenTagDialog]);
}
