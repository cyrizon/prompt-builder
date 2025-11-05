import React, { useState } from 'react';
import { TagInputDialog } from '@/components/TagInputDialog';
import { useShortcuts } from '@/hooks/useShortcuts';

const HomePage: React.FC = () => {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  // Gestion des raccourcis clavier
  useShortcuts({
    onOpenTagDialog: () => setIsTagDialogOpen(true),
  });

  const handleInsertTag = (tagName: string) => {
    // Pour l'instant, on affiche juste dans la console
    // Plus tard, on insérera dans l'éditeur CodeMirror
    console.log('Insertion de la balise:', tagName);
    alert(`Balise insérée: <${tagName}></${tagName}>`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <h1>Prompt Builder</h1>
      <p>Appuyez sur <kbd>C</kbd> pour insérer une balise</p>
      
      <TagInputDialog
        open={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        onInsertTag={handleInsertTag}
      />
    </div>
  );
};

export default HomePage;