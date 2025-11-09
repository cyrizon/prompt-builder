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
          <DialogTitle className="text-center">Raccourcis clavier</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Création */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Création</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Créer une nouvelle balise</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">C</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Insérer du contenu seul</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">V</kbd>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Naviguer vers le haut</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">↑</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Naviguer vers le bas</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">↓</kbd>
              </div>
            </div>
          </div>

          {/* Édition */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Édition</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Éditer l'élément sélectionné</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">E</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Supprimer l'élément sélectionné</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Suppr</kbd>
              </div>
            </div>
          </div>

          {/* Déplacement */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Déplacement</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Déplacer vers le haut</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Alt + ↑</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Déplacer vers le bas</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Alt + ↓</kbd>
              </div>
            </div>
          </div>

          {/* Indentation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Indentation</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Indenter (devenir enfant de l'élément précédent)</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Tab</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Désindenter (remonter au niveau parent)</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Shift + Tab</kbd>
              </div>
            </div>
          </div>

          {/* Aide */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Aide</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Afficher cette aide</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">H</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Fermer les modales</span>
                <kbd className="px-3 py-1.5 bg-accent rounded font-mono text-sm">Échap</kbd>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
