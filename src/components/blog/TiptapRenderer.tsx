
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
        bulletList: false, // Disable built-in to avoid conflicts
        orderedList: false, // Disable built-in to avoid conflicts
        listItem: false, // Disable built-in to avoid conflicts
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-6 space-y-1 my-2',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-6 space-y-1 my-2',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'leading-relaxed',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      TextStyle,
      Color,
      Underline,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full border border-border my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-border',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border bg-muted/50 px-4 py-2 text-left font-medium',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border px-4 py-2',
        },
      }),
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
