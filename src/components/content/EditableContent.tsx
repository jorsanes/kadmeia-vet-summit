import React, { useState, useEffect } from 'react';
import { getEditablePageContent } from '@/lib/editable-pages';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditableContentProps {
  pageKey: string;
  sectionKey: string;
  lang: string;
  fallbackContent: React.ReactNode;
  renderContent?: (content: any) => React.ReactNode;
  className?: string;
}

export const EditableContent: React.FC<EditableContentProps> = ({
  pageKey,
  sectionKey,
  lang,
  fallbackContent,
  renderContent,
  className = ""
}) => {
  const [editableContent, setEditableContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    const loadEditableContent = async () => {
      setIsLoading(true);
      try {
        const pageData = await getEditablePageContent(pageKey, lang);
        if (pageData && pageData.content && pageData.content[sectionKey]) {
          setEditableContent(pageData.content[sectionKey]);
        }
      } catch (error) {
        console.error('Error loading editable content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEditableContent();
  }, [pageKey, sectionKey, lang]);

  const hasEditableContent = editableContent && Object.keys(editableContent).length > 0;

  if (isLoading) {
    return <div className={className}>{fallbackContent}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Admin edit button */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
          >
            <Link to="/admin" className="gap-1">
              <Edit className="h-3 w-3" />
              Editar
            </Link>
          </Button>
        </div>
      )}

      {/* Render content */}
      {hasEditableContent && renderContent ? (
        renderContent(editableContent)
      ) : hasEditableContent ? (
        <EditableContentRenderer content={editableContent} />
      ) : (
        fallbackContent
      )}
    </div>
  );
};

interface EditableContentRendererProps {
  content: any;
}

const EditableContentRenderer: React.FC<EditableContentRendererProps> = ({ content }) => {
  return (
    <div>
      {content.title && (
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {content.title}
        </h1>
      )}
      {content.subtitle && (
        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl max-w-3xl mx-auto">
          {content.subtitle}
        </p>
      )}
      {content.content && (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      )}
    </div>
  );
};

// Hook for using editable content in components
export const useEditableContent = (pageKey: string, sectionKey: string, lang: string) => {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const pageData = await getEditablePageContent(pageKey, lang);
        if (pageData && pageData.content && pageData.content[sectionKey]) {
          setContent(pageData.content[sectionKey]);
        }
      } catch (error) {
        console.error('Error loading editable content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [pageKey, sectionKey, lang]);

  return { content, isLoading };
};