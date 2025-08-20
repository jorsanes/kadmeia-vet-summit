import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocale } from '@/i18n/LocaleProvider';
import { getBlogPost } from '@/lib/mdx';
import { PageSeo } from '@/components/seo/PageSeo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import NotFound from './NotFound';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const navigate = useNavigate();

  if (!slug) {
    return <NotFound />;
  }

  const post = getBlogPost(slug, locale);

  if (!post) {
    return <NotFound />;
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo 
        title={`${post.title} - KADMEIA Blog`}
        description={post.excerpt}
        ogType="article"
      />

      <article className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Back button */}
          <motion.div 
            className="mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate(locale === 'es' ? '/blog' : '/en/blog')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {locale === 'es' ? 'Volver al blog' : 'Back to blog'}
            </Button>
          </motion.div>

          {/* Article header */}
          <motion.header 
            className="mb-12"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-display text-4xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                KADMEIA Team
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {locale === 'es' ? '8 min lectura' : '8 min read'}
              </div>
            </div>
          </motion.header>

          {/* Article content */}
          <motion.div 
            className="prose prose-lg max-w-none"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <post.Component />
          </motion.div>

          {/* Back to blog CTA */}
          <motion.div 
            className="mt-16 pt-8 border-t border-border text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <Button 
              onClick={() => navigate(locale === 'es' ? '/blog' : '/en/blog')}
              className="btn-primary"
            >
              {locale === 'es' ? 'Ver más artículos' : 'See more articles'}
            </Button>
          </motion.div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;