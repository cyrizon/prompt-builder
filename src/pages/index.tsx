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
  
  const [nodes, setNodes] = useState<XmlNode[]>([{
    id: 'root-prompt',
    type: 'tag',
    tagName: 'prompt',
    children: []
  }]);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root-prompt');

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

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

  const moveNode = (direction: 'up' | 'down') => {
    if (!selectedNodeId) return;

    const moveInArray = (nodes: XmlNode[], parentPath: XmlNode[] = []): XmlNode[] => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === selectedNodeId) {
          if (direction === 'up' && i > 0) {
            const newNodes = [...nodes];
            [newNodes[i - 1], newNodes[i]] = [newNodes[i], newNodes[i - 1]];
            return newNodes;
          } else if (direction === 'down' && i < nodes.length - 1) {
            const newNodes = [...nodes];
            [newNodes[i], newNodes[i + 1]] = [newNodes[i + 1], newNodes[i]];
            return newNodes;
          }
          return nodes;
        }
        
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

  const changeIndentation = (direction: 'indent' | 'unindent') => {
    if (!selectedNodeId) return;

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
      if (index === 0) return;
      
      const previousSibling = siblings[index - 1];
      if (previousSibling.type !== 'tag') return;

      if (previousSibling.content && previousSibling.content.trim() !== '') {
        showError('Cannot indent into a tag that already contains text');
        return;
      }

      const nodeToMove = siblings[index];
      
      if (!parent) {
        const newNodes = [...nodes];
        newNodes.splice(index, 1);
        const prevIndex = newNodes.findIndex(n => n.id === previousSibling.id);
        newNodes[prevIndex] = {
          ...newNodes[prevIndex],
          children: [...(newNodes[prevIndex].children || []), nodeToMove]
        };
        setNodes(newNodes);
        return;
      }
      
      const updateNodes = (nodes: XmlNode[]): XmlNode[] => {
        return nodes.map(node => {
          if (node.id === previousSibling.id) {
            return {
              ...node,
              children: [...(node.children || []), nodeToMove]
            };
          }
          if (node.children) {
            const hasChild = node.children.some(child => child.id === selectedNodeId);
            if (hasChild) {
              return {
                ...node,
                children: node.children.filter(child => child.id !== selectedNodeId).map(child => updateNodes([child])[0])
              };
            }
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
      if (!parent) return;

      const nodeToMove = siblings[index];
      
      const parentContext = findNodeContext(nodes, parent.id);
      if (!parentContext) return;

      const { parent: grandParent, index: parentIndex, siblings: parentSiblings } = parentContext;
      
      if (!grandParent) {
        showError('Cannot create multiple root tags');
        return;
      }
      
      const updateNodes = (nodes: XmlNode[]): XmlNode[] => {
        return nodes.map(node => {
          if (node.id === parent.id) {
            return {
              ...node,
              children: node.children!.filter(child => child.id !== selectedNodeId)
            };
          }
          if (node.children) {
            const hasParent = node.children.some(child => child.id === parent.id);
            if (hasParent) {
              const newChildren = [...node.children];
              const parentIdx = newChildren.findIndex(child => child.id === parent.id);
              newChildren.splice(parentIdx + 1, 0, nodeToMove);
              return {
                ...node,
                children: newChildren.map(child => {
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

  useShortcuts({
    onOpenTagDialog: () => {
      if (selectedNodeId) {
        const selectedNode = getSelectedNode();
        if (selectedNode?.content && selectedNode.content.trim() !== '') {
          showError('This tag already contains text');
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

  const generateId = () => `node-${Date.now()}-${Math.random()}`;

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

  const insertNode = (newNode: XmlNode) => {
    if (selectedNodeId === null) {
      setNodes([...nodes, newNode]);
    } else {
      const flatNodes = flattenNodes(nodes);
      const selectedNode = flatNodes.find(n => n.id === selectedNodeId);
      
      if (selectedNode?.type === 'content') {
        console.warn('Cannot add a child to a content node');
        return;
      }
      
      const updateNodes = (nodes: XmlNode[]): XmlNode[] => {
        return nodes.map(node => {
          if (node.id === selectedNodeId) {
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
    setCurrentTagName(tagName);
    setIsTagDialogOpen(false);
    setIsContentDialogOpen(true);
  };

  const handleInsertContent = (content: string) => {
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

  const getSelectedNode = (): XmlNode | null => {
    if (!selectedNodeId) return null;
    const flatNodes = flattenNodes(nodes);
    return flatNodes.find(n => n.id === selectedNodeId) || null;
  };

  const handleUpdateNode = (updatedNode: XmlNode) => {
    if (updatedNode.type === 'tag' && 
        updatedNode.content && 
        updatedNode.content.trim() !== '' &&
        updatedNode.children && 
        updatedNode.children.length > 0) {
      showError('This tag already contains child tags');
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
      {/* Header */}
      <header className="border-b bg-background px-6 py-4">
        <h1 className="text-2xl font-bold">Interactive XML Prompt Builder</h1>
      </header>

      {/* Main layout: Editor + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Editor */}
        <div className="w-1/2 p-4 border-r overflow-auto">
          <h2 className="text-xl font-semibold mb-4">XML Structure</h2>
          <Editor 
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />
        </div>

        {/* Right side - Preview */}
        <div className="w-1/2 p-4 overflow-hidden">
          <Preview nodes={nodes} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background px-6 py-3 flex items-center justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          Created by Cyrizon
          <a 
            href="https://github.com/cyrizon" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
            title="View my GitHub"
          >
            <svg 
              className="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </footer>

      {/* Floating help popup */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-muted/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm text-muted-foreground">
        Press <kbd className="px-2 py-1 bg-accent rounded text-xs mx-1">H</kbd> to show help
      </div>

      {/* Error toast */}
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