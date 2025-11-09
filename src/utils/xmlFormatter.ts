import format from 'xml-formatter';
import { type XmlNode } from '@/components/Editor';

/**
 * Convertit l'arbre de noeuds XML en une chaîne XML formatée
 */
export const formatXml = (nodes: XmlNode[]): string => {
  const buildXmlString = (nodes: XmlNode[]): string => {
    return nodes.map(node => {
      if (node.type === 'content') {
        return node.content || '';
      }
      
      if (node.type === 'tag') {
        const tagName = node.tagName || 'tag';
        const hasChildren = node.children && node.children.length > 0;
        const hasContent = node.content && node.content.trim() !== '';
        
        if (!hasChildren && !hasContent) {
          // Balise auto-fermante
          return `<${tagName} />`;
        }
        
        let content = '';
        
        // Ajouter le contenu direct de la balise
        if (hasContent) {
          content += node.content;
        }
        
        // Ajouter les enfants
        if (hasChildren) {
          content += buildXmlString(node.children!);
        }
        
        return `<${tagName}>${content}</${tagName}>`;
      }
      
      return '';
    }).join('');
  };
  
  const xmlString = buildXmlString(nodes);
  
  try {
    return format(xmlString, {
      indentation: '  ',
      collapseContent: true,
      lineSeparator: '\n'
    });
  } catch (error) {
    console.error('Error formatting XML:', error);
    return xmlString;
  }
};
