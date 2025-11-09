import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';

interface UseShortcutsOptions {
  onOpenTagDialog: () => void;
  onOpenContentDialog: () => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onIndent: () => void;
  onUnindent: () => void;
}

export function useShortcuts({ 
  onOpenTagDialog, 
  onOpenContentDialog, 
  onNavigateUp, 
  onNavigateDown,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  onIndent,
  onUnindent
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

    // Alt+Flèche haut pour déplacer l'élément vers le haut
    hotkeys('alt+up', (event) => {
      event.preventDefault();
      onMoveUp();
    });

    // Alt+Flèche bas pour déplacer l'élément vers le bas
    hotkeys('alt+down', (event) => {
      event.preventDefault();
      onMoveDown();
    });

    // Tab pour indenter (augmenter le niveau)
    hotkeys('tab', (event) => {
      event.preventDefault();
      onIndent();
    });

    // Shift+Tab pour désindenter (diminuer le niveau)
    hotkeys('shift+tab', (event) => {
      event.preventDefault();
      onUnindent();
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
      hotkeys.unbind('alt+up');
      hotkeys.unbind('alt+down');
      hotkeys.unbind('tab');
      hotkeys.unbind('shift+tab');
      hotkeys.unbind('del, delete');
    };
  }, [onOpenTagDialog, onOpenContentDialog, onNavigateUp, onNavigateDown, onDelete, onEdit, onMoveUp, onMoveDown, onIndent, onUnindent]);
}
