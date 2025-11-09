import React from 'react';
import { Card } from '@/components/ui/card';

export interface XmlNode {
  id: string;
  type: 'tag' | 'content';
  tagName?: string;
  content?: string;
  children?: XmlNode[];
}

interface EditorProps {
  nodes: XmlNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
}

export function Editor({ nodes, selectedNodeId, onSelectNode }: EditorProps) {
  const renderNode = (node: XmlNode, depth: number = 0): React.ReactNode => {
    const isSelected = selectedNodeId === node.id;
    const paddingLeft = `${depth * 1.5}rem`;

    if (node.type === 'content') {
      return (
        <div
          key={node.id}
          onClick={() => onSelectNode(node.id)}
          className={`
            px-4 py-2 cursor-not-allowed transition-colors opacity-70
            ${isSelected ? 'bg-muted border-l-2 border-muted-foreground' : 'hover:bg-muted/50'}
          `}
          style={{ paddingLeft }}
          title="Content nodes cannot have children"
        >
          <span className="text-muted-foreground italic">
            {node.content || '(empty content)'}
          </span>
        </div>
      );
    }

    return (
      <div key={node.id}>
        <div
          onClick={() => onSelectNode(node.id)}
          className={`
            px-4 py-2 cursor-pointer transition-colors
            ${isSelected ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-accent/50'}
          `}
          style={{ paddingLeft }}
        >
          <span className="text-blue-600 dark:text-blue-400">
            &lt;{node.tagName}&gt;
          </span>
          {node.content && (
            <span className="text-foreground ml-1">{node.content}</span>
          )}
          {node.content && (
            <span className="text-blue-600 dark:text-blue-400 ml-1">
              &lt;/{node.tagName}&gt;
            </span>
          )}
        </div>
        
        {node.children && node.children.length > 0 && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
        
        {!node.content && (
          <div
            className="px-4 py-1"
            style={{ paddingLeft }}
          >
            <span className="text-blue-600 dark:text-blue-400">
              &lt;/{node.tagName}&gt;
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full overflow-auto">
      <div className="p-2">
        {nodes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No elements</p>
            <p className="text-sm mt-2">Press <kbd className="px-2 py-1 bg-accent rounded">C</kbd> to create a tag</p>
          </div>
        ) : (
          nodes.map(node => renderNode(node, 0))
        )}
      </div>
    </Card>
  );
}
