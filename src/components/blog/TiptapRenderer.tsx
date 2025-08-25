
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
    content: typeof content === 'string' ? JSON.parse(content) : content,
    editable: false,
  });

  if (!editor || !content) {
    return null;
  }

  return (
    <div className={`prose prose-stone dark:prose-invert max-w-none ${className}
      [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:font-serif [&_h1]:text-foreground [&_h1]:mb-6 [&_h1]:leading-tight [&_h1]:mt-8 [&_h1]:first:mt-0
      [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:font-serif [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:leading-snug 
      [&_h3]:text-xl [&_h3]:font-medium [&_h3]:font-serif [&_h3]:text-foreground [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:leading-normal
      [&_h4]:text-lg [&_h4]:font-medium [&_h4]:text-foreground [&_h4]:mb-2 [&_h4]:mt-6
      [&_p]:text-foreground [&_p]:leading-7 [&_p]:mb-4
      [&_strong]:font-semibold [&_strong]:text-foreground
      [&_em]:italic [&_em]:text-foreground
      [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-6
      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:my-4 [&_ul]:text-foreground
      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:my-4 [&_ol]:text-foreground
      [&_li]:leading-relaxed [&_li]:text-foreground
      [&_a]:text-primary [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-primary/80
      [&_img]:rounded-lg [&_img]:my-6 [&_img]:shadow-sm
      [&_table]:my-6 [&_table]:border-collapse [&_table]:w-full
      [&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2 [&_td]:text-foreground
      [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-4 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-foreground
      [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-foreground [&_code]:font-mono
      [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
      [&_hr]:border-border [&_hr]:my-8`}>
      <EditorContent editor={editor} />
    </div>
  );
};
