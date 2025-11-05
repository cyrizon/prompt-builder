import React, { useState } from 'react';
import { TagInputDialog } from '@/components/TagInputDialog';
import { TagContentDialog } from '@/components/TagContentDialog';
import { useShortcuts } from '@/hooks/useShortcuts';

const HomePage: React.FC = () => {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [currentTagName, setCurrentTagName] = useState<string>('');

  // Gestion des raccourcis clavier
  useShortcuts({
    onOpenTagDialog: () => setIsTagDialogOpen(true),
    onOpenContentDialog: () => setIsContentDialogOpen(true),
  });

  const handleInsertTag = (tagName: string) => {
    // Sauvegarder le nom de la balise et ouvrir la popup de contenu
    setCurrentTagName(tagName);
    setIsTagDialogOpen(false);
    setIsContentDialogOpen(true);
  };

  const handleInsertContent = (content: string) => {
    // Insérer la balise avec le contenu
    console.log('Insertion de la balise:', currentTagName, 'avec contenu:', content);
    // Plus tard, on insérera dans l'éditeur CodeMirror
    
    // Réinitialiser
    setCurrentTagName('');
    setIsContentDialogOpen(false);
  };

  const handleContentDialogClose = (open: boolean) => {
    if (!open) {
      // Si on ferme la popup de contenu (Escape ou clic dehors)
      // On insère quand même la balise vide
      if (currentTagName) {
        console.log('Insertion de la balise vide:', currentTagName);
        // Plus tard, on insérera dans l'éditeur CodeMirror
        setCurrentTagName('');
      }
    }
    setIsContentDialogOpen(open);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <h1>Prompt Builder</h1>
      <div style={{ textAlign: 'center' }}>
        <p>Appuyez sur <kbd>C</kbd> pour créer une balise</p>
        <p>Appuyez sur <kbd>V</kbd> pour insérer du contenu seul</p>
      </div>
      
      <TagInputDialog
        open={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        onInsertTag={handleInsertTag}
      />
      
      <TagContentDialog
        open={isContentDialogOpen}
        onOpenChange={handleContentDialogClose}
        onInsertContent={handleInsertContent}
      />
    </div>
  );
};

export default HomePage;