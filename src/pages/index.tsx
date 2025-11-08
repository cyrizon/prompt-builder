import React, { useState } from 'react';
import { TagInputDialog } from '@/components/TagInputDialog';
import { TagContentDialog } from '@/components/TagContentDialog';
import { EditDialog } from '@/components/EditDialog';
import { Editor, type XmlNode } from '@/components/Editor';
import { useShortcuts } from '@/hooks/useShortcuts';

const HomePage: React.FC = () => {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTagName, setCurrentTagName] = useState<string>('');
  
  // Initialiser avec une balise <prompt> de base
  const [nodes, setNodes] = useState<XmlNode[]>([{
    id: 'root-prompt',
    type: 'tag',
    tagName: 'prompt',
    children: []
  }]);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root-prompt');

  // Créer une liste plate de tous les nœuds pour la navigation
  const flattenNodes = (nodes: XmlNode[]): XmlNode[] => {
    const result: XmlNode[] = [];
    const traverse = (nodeList: XmlNode[]) => {
      for (const node of nodeList) {
        result.push(node);
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(nodes);
    return result;
  };

  // Navigation avec les flèches
  const navigateNodes = (direction: 'up' | 'down') => {
    const flatNodes = flattenNodes(nodes);
    if (flatNodes.length === 0) return;

    const currentIndex = flatNodes.findIndex(n => n.id === selectedNodeId);
    
    if (direction === 'down') {
      const nextIndex = currentIndex < flatNodes.length - 1 ? currentIndex + 1 : 0;
      setSelectedNodeId(flatNodes[nextIndex].id);
    } else {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : flatNodes.length - 1;
      setSelectedNodeId(flatNodes[prevIndex].id);
    }
  };

  // Gestion des raccourcis clavier
  useShortcuts({
    onOpenTagDialog: () => setIsTagDialogOpen(true),
    onOpenContentDialog: () => setIsContentDialogOpen(true),
    onNavigateUp: () => navigateNodes('up'),
    onNavigateDown: () => navigateNodes('down'),
    onDelete: () => handleDeleteNode(),
    onEdit: () => {
      if (selectedNodeId) {
        setIsEditDialogOpen(true);
      }
    },
  });

  // Générer un ID unique
  const generateId = () => `node-${Date.now()}-${Math.random()}`;

  // Trouver un nœud par son ID de manière récursive
  const findNodeById = (nodes: XmlNode[], id: string): XmlNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Insérer un nouveau nœud
  const insertNode = (newNode: XmlNode) => {
    if (selectedNodeId === null) {
      // Insérer à la racine
      setNodes([...nodes, newNode]);
    } else {
      // Vérifier si le nœud sélectionné est de type 'content'
      const flatNodes = flattenNodes(nodes);
      const selectedNode = flatNodes.find(n => n.id === selectedNodeId);
      
      if (selectedNode?.type === 'content') {
        // On ne peut pas ajouter d'enfants à un nœud de contenu
        // On ne fait rien ou on peut afficher un message
        console.warn('Impossible d\'ajouter un enfant à un nœud de contenu');
        return;
      }
      
      // Insérer comme enfant du nœud sélectionné
      const updateNodes = (nodes: XmlNode[]): XmlNode[] => {
        return nodes.map(node => {
          if (node.id === selectedNodeId) {
            // Ajouter le nouveau nœud comme enfant
            return {
              ...node,
              children: [...(node.children || []), newNode]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateNodes(node.children)
            };
          }
          return node;
        });
      };
      setNodes(updateNodes(nodes));
    }
  };

  const handleInsertTag = (tagName: string) => {
    // Sauvegarder le nom de la balise et ouvrir la popup de contenu
    setCurrentTagName(tagName);
    setIsTagDialogOpen(false);
    setIsContentDialogOpen(true);
  };

  const handleInsertContent = (content: string) => {
    if (currentTagName) {
      // Insérer la balise avec le contenu directement
      const newTag: XmlNode = {
        id: generateId(),
        type: 'tag',
        tagName: currentTagName,
        content: content.trim() ? content.trim() : undefined, // Ajouter le contenu s'il existe
        children: []
      };
      insertNode(newTag);
      setCurrentTagName(''); // Réinitialiser AVANT de fermer la dialog
    } else {
      // Insérer juste du contenu
      const newContent: XmlNode = {
        id: generateId(),
        type: 'content',
        content
      };
      insertNode(newContent);
    }
    
    // Réinitialiser et fermer
    setIsContentDialogOpen(false);
  };

  const handleContentDialogClose = (open: boolean) => {
    if (!open) {
      // Si on ferme la popup de contenu (Escape ou clic dehors)
      // On insère quand même la balise vide
      if (currentTagName) {
        const newTag: XmlNode = {
          id: generateId(),
          type: 'tag',
          tagName: currentTagName,
          children: []
        };
        insertNode(newTag);
        setCurrentTagName('');
      }
    }
    setIsContentDialogOpen(open);
  };

  // Trouver le nœud sélectionné
  const getSelectedNode = (): XmlNode | null => {
    if (!selectedNodeId) return null;
    const flatNodes = flattenNodes(nodes);
    return flatNodes.find(n => n.id === selectedNodeId) || null;
  };

  // Mettre à jour un nœud
  const handleUpdateNode = (updatedNode: XmlNode) => {
    const updateNodesRecursive = (nodes: XmlNode[]): XmlNode[] => {
      return nodes.map(node => {
        if (node.id === updatedNode.id) {
          return updatedNode;
        }
        if (node.children) {
          return {
            ...node,
            children: updateNodesRecursive(node.children)
          };
        }
        return node;
      });
    };
    setNodes(updateNodesRecursive(nodes));
  };

  // Supprimer un nœud
  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    
    const deleteNodeRecursive = (nodes: XmlNode[]): XmlNode[] => {
      return nodes
        .filter(node => node.id !== selectedNodeId)
        .map(node => {
          if (node.children) {
            return {
              ...node,
              children: deleteNodeRecursive(node.children)
            };
          }
          return node;
        });
    };
    
    setNodes(deleteNodeRecursive(nodes));
    setSelectedNodeId(null);
  };

  return (
    <div className="h-screen flex">
      {/* Partie gauche - Éditeur */}
      <div className="w-1/2 p-4">
        <Editor 
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
      </div>

      {/* Partie droite - Preview ou aide */}
      <div className="w-1/2 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Prompt Builder</h1>
          <div className="space-y-2 text-muted-foreground">
            <p>Appuyez sur <kbd className="px-2 py-1 bg-accent rounded">C</kbd> pour créer une balise</p>
            <p>Appuyez sur <kbd className="px-2 py-1 bg-accent rounded">V</kbd> pour insérer du contenu seul</p>
            <p>Appuyez sur <kbd className="px-2 py-1 bg-accent rounded">E</kbd> pour éditer</p>
            <p>Appuyez sur <kbd className="px-2 py-1 bg-accent rounded">↑/↓</kbd> pour naviguer</p>
            <p>Appuyez sur <kbd className="px-2 py-1 bg-accent rounded">Suppr</kbd> pour supprimer</p>
          </div>
        </div>
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
      
      <EditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        node={getSelectedNode()}
        onSave={handleUpdateNode}
      />
    </div>
  );
};

export default HomePage;