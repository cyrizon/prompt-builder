import React, { useState } from 'react';
import { TagInputDialog } from '@/components/TagInputDialog';
import { TagContentDialog } from '@/components/TagContentDialog';
import { EditDialog } from '@/components/EditDialog';
import { HelpDialog } from '@/components/HelpDialog';
import { Editor, type XmlNode } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { useShortcuts } from '@/hooks/useShortcuts';

const HomePage: React.FC = () => {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [currentTagName, setCurrentTagName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Initialiser avec une balise <prompt> de base
  const [nodes, setNodes] = useState<XmlNode[]>([{
    id: 'root-prompt',
    type: 'tag',
    tagName: 'prompt',
    children: []
  }]);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root-prompt');

  // Afficher une erreur temporaire
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

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

  // Déplacer un élément vers le haut ou le bas dans sa liste
  const moveNode = (direction: 'up' | 'down') => {
    if (!selectedNodeId) return;

    const moveInArray = (nodes: XmlNode[], parentPath: XmlNode[] = []): XmlNode[] => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === selectedNodeId) {
          // Trouvé l'élément à déplacer
          if (direction === 'up' && i > 0) {
            // Échanger avec l'élément précédent
            const newNodes = [...nodes];
            [newNodes[i - 1], newNodes[i]] = [newNodes[i], newNodes[i - 1]];
            return newNodes;
          } else if (direction === 'down' && i < nodes.length - 1) {
            // Échanger avec l'élément suivant
            const newNodes = [...nodes];
            [newNodes[i], newNodes[i + 1]] = [newNodes[i + 1], newNodes[i]];
            return newNodes;
          }
          return nodes;
        }
        
        // Chercher dans les enfants
        if (nodes[i].children && nodes[i].children!.length > 0) {
          const newChildren = moveInArray(nodes[i].children!, [...parentPath, nodes[i]]);
          if (newChildren !== nodes[i].children) {
            const newNodes = [...nodes];
            newNodes[i] = { ...nodes[i], children: newChildren };
            return newNodes;
          }
        }
      }
      return nodes;
    };

    setNodes(moveInArray(nodes));
  };

  // Changer le niveau d'indentation (Tab/Shift+Tab)
  const changeIndentation = (direction: 'indent' | 'unindent') => {
    if (!selectedNodeId) return;

    // Fonction pour trouver le parent et l'index de l'élément
    const findNodeContext = (
      nodes: XmlNode[], 
      targetId: string, 
      parent: XmlNode | null = null
    ): { parent: XmlNode | null; index: number; siblings: XmlNode[] } | null => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId) {
          return { parent, index: i, siblings: nodes };
        }
        if (nodes[i].children) {
          const result = findNodeContext(nodes[i].children!, targetId, nodes[i]);
          if (result) return result;
        }
      }
      return null;
    };

    const context = findNodeContext(nodes, selectedNodeId);
    if (!context) return;

    const { parent, index, siblings } = context;

    if (direction === 'indent') {
      // Devenir enfant de l'élément précédent
      if (index === 0) return; // Pas d'élément précédent
      
      const previousSibling = siblings[index - 1];
      if (previousSibling.type !== 'tag') return; // Peut seulement devenir enfant d'une balise

      const nodeToMove = siblings[index];
      
      // Si on est au niveau racine, gérer directement
      if (!parent) {
        const newNodes = [...nodes];
        // Retirer l'élément de sa position actuelle
        newNodes.splice(index, 1);
        // Ajouter aux enfants de l'élément précédent
        const prevIndex = newNodes.findIndex(n => n.id === previousSibling.id);
        newNodes[prevIndex] = {
          ...newNodes[prevIndex],
          children: [...(newNodes[prevIndex].children || []), nodeToMove]
        };
        setNodes(newNodes);
        return;
      }
      
      // Fonction récursive pour mettre à jour l'arbre
      const updateNodes = (nodes: XmlNode[]): XmlNode[] => {
        return nodes.map(node => {
          // Si c'est l'élément précédent, ajouter le noeud dans ses enfants
          if (node.id === previousSibling.id) {
            return {
              ...node,
              children: [...(node.children || []), nodeToMove]
            };
          }
          // Si ce noeud contient l'élément à déplacer dans ses enfants
          if (node.children) {
            const hasChild = node.children.some(child => child.id === selectedNodeId);
            if (hasChild) {
              // Retirer l'élément de cette liste
              return {
                ...node,
                children: node.children.filter(child => child.id !== selectedNodeId).map(child => updateNodes([child])[0])
              };
            }
            // Sinon continuer la recherche récursivement
            return {
              ...node,
              children: updateNodes(node.children)
            };
          }
          return node;
        });
      };

      setNodes(updateNodes(nodes));
      
    } else {
      // Désindenter : remonter au niveau du parent
      if (!parent) return; // Déjà au niveau racine

      const nodeToMove = siblings[index];
      
      // Trouver le contexte du parent (grand-parent, position du parent)
      const parentContext = findNodeContext(nodes, parent.id);
      if (!parentContext) return;

      const { parent: grandParent, index: parentIndex, siblings: parentSiblings } = parentContext;
      
      // Bloquer la désindentation si le parent est au niveau racine (empêcher plusieurs racines)
      if (!grandParent) {
        showError('Impossible de créer plusieurs balises racines');
        return;
      }
      
      // Fonction récursive pour mettre à jour l'arbre
      const updateNodes = (nodes: XmlNode[]): XmlNode[] => {
        return nodes.map(node => {
          // Si c'est le parent, retirer l'élément de ses enfants
          if (node.id === parent.id) {
            return {
              ...node,
              children: node.children!.filter(child => child.id !== selectedNodeId)
            };
          }
          // Si ce noeud contient le parent dans ses enfants
          if (node.children) {
            const hasParent = node.children.some(child => child.id === parent.id);
            if (hasParent) {
              // Trouver la position du parent et insérer le noeud juste après
              const newChildren = [...node.children];
              const parentIdx = newChildren.findIndex(child => child.id === parent.id);
              newChildren.splice(parentIdx + 1, 0, nodeToMove);
              return {
                ...node,
                children: newChildren.map(child => {
                  // Retirer le noeud des enfants du parent
                  if (child.id === parent.id) {
                    return {
                      ...child,
                      children: child.children!.filter(c => c.id !== selectedNodeId)
                    };
                  }
                  return child;
                })
              };
            }
            // Sinon continuer la recherche récursivement
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

  // Gestion des raccourcis clavier
  useShortcuts({
    onOpenTagDialog: () => {
      // Vérifier si la balise sélectionnée a déjà du contenu texte
      if (selectedNodeId) {
        const selectedNode = getSelectedNode();
        if (selectedNode?.content && selectedNode.content.trim() !== '') {
          showError('Cette balise contient déjà du texte');
          return;
        }
      }
      setIsTagDialogOpen(true);
    },
    onNavigateUp: () => navigateNodes('up'),
    onNavigateDown: () => navigateNodes('down'),
    onDelete: () => handleDeleteNode(),
    onEdit: () => {
      if (selectedNodeId) {
        setIsEditDialogOpen(true);
      }
    },
    onMoveUp: () => moveNode('up'),
    onMoveDown: () => moveNode('down'),
    onIndent: () => changeIndentation('indent'),
    onUnindent: () => changeIndentation('unindent'),
    onOpenHelp: () => setIsHelpDialogOpen(true),
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
        console.warn('Impossible d\'ajouter un enfant à un nœud de contenu');
        return;
      }
      
      // Note: La vérification du contenu texte est faite avant l'ouverture du dialog
      
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
    // Créer la balise avec le contenu (depuis C)
    const newTag: XmlNode = {
      id: generateId(),
      type: 'tag',
      tagName: currentTagName,
      content: content.trim() ? content.trim() : undefined,
      children: []
    };
    insertNode(newTag);
    setCurrentTagName('');
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
    // Bloquer l'ajout de contenu texte si la balise a déjà des enfants
    if (updatedNode.type === 'tag' && 
        updatedNode.content && 
        updatedNode.content.trim() !== '' &&
        updatedNode.children && 
        updatedNode.children.length > 0) {
      showError('Cette balise contient déjà des balises enfants');
      return;
    }
    
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
    <div className="h-screen flex flex-col">
      {/* Layout principal : Éditeur + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Partie gauche - Éditeur */}
        <div className="w-1/2 p-4 border-r overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Structure XML</h2>
          <Editor 
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />
        </div>

        {/* Partie droite - Preview */}
        <div className="w-1/2 p-4 overflow-hidden">
          <Preview nodes={nodes} />
        </div>
      </div>

      {/* Hint en bas */}
      <div className="border-t bg-muted/30 px-4 py-2 text-center text-sm text-muted-foreground">
        Appuyez sur <kbd className="px-2 py-1 bg-accent rounded text-xs mx-1">H</kbd> pour afficher l'aide
      </div>

      {/* Toast d'erreur */}
      {errorMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300">
          {errorMessage}
        </div>
      )}
      
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

      <HelpDialog
        open={isHelpDialogOpen}
        onOpenChange={setIsHelpDialogOpen}
      />
    </div>
  );
};

export default HomePage;