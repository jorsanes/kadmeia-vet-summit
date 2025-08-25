
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Underline } from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { ListItem } from '@tiptap/extension-list-item';

interface TiptapRendererProps {
  content: any;
  className?: string;
}

export const TiptapRenderer: React.FC<TiptapRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false, // Disable the built-in link extension to avoid conflicts
        bulletList: false, // Disable built-in to avoid conflicts
        orderedList: false, // Disable built-in to avoid conflicts
        listItem: false, // Disable built-in to avoid conflicts
      }),
      BulletList,
      OrderedList,
      ListItem,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: (() => {
      try {
        if (!content) return null;
        if (typeof content === 'string') {
          return JSON.parse(content);
        }
        if (typeof content === 'object') {
          return content;
        }
        return null;
      } catch (error) {
        console.error('Error parsing Tiptap content:', error);
        return null;
      }
    })(),
    editable: false,
  });

  if (!editor || !content) {
    return null;
  }

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
};
