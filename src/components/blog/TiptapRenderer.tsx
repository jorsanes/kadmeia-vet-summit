
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

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
    ],
    content,
    editable: false,
  });

  if (!editor || !content) {
    return null;
  }

  return (
    <div className={`${className} [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:font-serif [&_h1]:text-foreground [&_h1]:mb-6 [&_h1]:leading-tight [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:font-serif [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:leading-snug [&_h3]:text-xl [&_h3]:font-medium [&_h3]:font-serif [&_h3]:text-foreground [&_h3]:mb-3 [&_h3]:leading-normal`}>
      <EditorContent editor={editor} />
    </div>
  );
};
