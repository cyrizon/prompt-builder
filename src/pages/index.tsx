import React, { useState } from 'react';
import { TagInputDialog } from '@/components/TagInputDialog';
import { TagContentDialog } from '@/components/TagContentDialog';
import { useShortcuts } from '@/hooks/useShortcuts';

const HomePage: React.FC = () => {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);

  // Gestion des raccourcis clavier
  useShortcuts({
    onOpenTagDialog: () => setIsTagDialogOpen(true),
    onOpenContentDialog: () => setIsContentDialogOpen(true),
  });

  const handleInsertTag = (tagName: string) => {
    // Pour l'instant, on affiche juste dans la console
    // Plus tard, on insérera dans l'éditeur CodeMirror
    console.log('Insertion de la balise:', tagName);
    alert(`Balise insérée: <${tagName}></${tagName}>`);
  };

  const handleInsertContent = (content: string) => {
    console.log('Insertion du contenu:', content);
    alert(`Contenu inséré:\n${content}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <h1>Prompt Builder</h1>
      <div style={{ textAlign: 'center' }}>
        <p>Appuyez sur <kbd>C</kbd> pour insérer une balise</p>
        <p>Appuyez sur <kbd>V</kbd> pour insérer du contenu</p>
      </div>
      
      <TagInputDialog
        open={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        onInsertTag={handleInsertTag}
      />
      
      <TagContentDialog
        open={isContentDialogOpen}
        onOpenChange={setIsContentDialogOpen}
        onInsertContent={handleInsertContent}
      />
    </div>
  );
};

export default HomePage;