
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

interface TiptapRendererProps {
  content: any;
  className?: string;
}

export const TiptapRenderer: React.FC<TiptapRendererProps> = ({ 
  content, 
  className = "prose prose-lg max-w-none" 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
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
    content,
    editable: false,
  });

  if (!editor || !content) {
    return null;
  }

  return (
    <div className={`${className} [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:font-serif [&_h1]:text-foreground [&_h1]:mb-6 [&_h1]:leading-tight [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:font-serif [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:leading-snug [&_h3]:text-xl [&_h3]:font-medium [&_h3]:font-serif [&_h3]:text-foreground [&_h3]:mb-3 [&_h3]:leading-normal [&_table]:my-4 [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold`}>
      <EditorContent editor={editor} />
    </div>
  );
};
