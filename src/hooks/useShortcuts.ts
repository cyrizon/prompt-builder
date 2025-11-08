import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';

interface UseShortcutsOptions {
  onOpenTagDialog: () => void;
  onOpenContentDialog: () => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function useShortcuts({ 
  onOpenTagDialog, 
  onOpenContentDialog, 
  onNavigateUp, 
  onNavigateDown,
  onDelete,
  onEdit
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

    // Appuyer sur e pour éditer l'élément sélectionné
    hotkeys('e', (event) => {
      event.preventDefault();
      onEdit();
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

    // Suppr/Delete pour supprimer l'élément sélectionné
    hotkeys('del, delete', (event) => {
      event.preventDefault();
      onDelete();
    });

    // Cleanup
    return () => {
      hotkeys.unbind('c');
      hotkeys.unbind('v');
      hotkeys.unbind('e');
      hotkeys.unbind('up');
      hotkeys.unbind('down');
      hotkeys.unbind('del, delete');
    };
  }, [onOpenTagDialog, onOpenContentDialog, onNavigateUp, onNavigateDown, onDelete, onEdit]);
}
