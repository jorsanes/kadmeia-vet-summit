import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Check, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/i18n/LocaleProvider';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterFooterProps {
  className?: string;
}

export const NewsletterFooter: React.FC<NewsletterFooterProps> = ({ className = '' }) => {
  const { locale } = useLocale();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: data.email,
          honeypot: '', // Anti-bot protection
        },
      });

      if (response.data && response.data.success) {
        toast({
          title: locale === 'es' ? '¡Suscripción exitosa!' : 'Subscription successful!',
          description: response.data.message || (locale === 'es' 
            ? 'Te has suscrito correctamente a nuestro newsletter.'
            : 'You have successfully subscribed to our newsletter.'),
        });
        setIsSubmitted(true);
        reset();
        
        // Reset submitted state after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        const errorMessage = response.error?.message || response.data?.error || (locale === 'es' 
          ? 'Ha ocurrido un error. Inténtalo de nuevo.'
          : 'An error occurred. Please try again.');
        toast({
          title: locale === 'es' ? 'Error' : 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: locale === 'es' ? 'Error' : 'Error',
        description: locale === 'es' 
          ? 'Hubo un problema al procesar su suscripción. Inténtelo de nuevo.'
          : 'There was a problem processing your subscription. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        className={`${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
          <div className="h-8 w-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-4 w-4 text-secondary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary-foreground">
              {locale === 'es' ? '¡Gracias!' : 'Thank you!'}
            </p>
            <p className="text-xs text-primary-foreground/70">
              {locale === 'es' ? 'Te has suscrito correctamente' : 'Successfully subscribed'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="email"
              placeholder={locale === 'es' ? 'tu@email.com' : 'your@email.com'}
              {...register('email')}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-secondary focus:ring-secondary/20"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <Button 
            type="submit" 
            variant="secondary"
            size="sm"
            className="px-4 flex-shrink-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-primary-foreground/60 leading-relaxed">
          {locale === 'es' ? (
            <>
              Al suscribirte, aceptas nuestra{' '}
              <a href="/privacy" className="text-secondary hover:underline">
                política de privacidad
              </a>.
            </>
          ) : (
            <>
              By subscribing, you accept our{' '}
              <a href="/privacy" className="text-secondary hover:underline">
                privacy policy
              </a>.
            </>
          )}
        </p>
      </form>
    </div>
  );
};