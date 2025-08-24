import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Send, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/i18n/LocaleProvider';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  rgpdConsent: z.boolean().refine(val => val === true, {
    message: 'Debe aceptar el tratamiento de datos'
  })
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterInlineProps {
  className?: string;
}

export const NewsletterInline: React.FC<NewsletterInlineProps> = ({ className = '' }) => {
  const { locale } = useLocale();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
      rgpdConsent: false
    }
  });

  const rgpdConsent = watch('rgpdConsent');

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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        className={`my-12 ${className}`}
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <Card className="card-premium bg-gradient-hero">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {locale === 'es' ? '¡Gracias por suscribirse!' : 'Thanks for subscribing!'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'es' 
                ? 'Pronto recibirá nuestros análisis más profundos.'
                : 'You will soon receive our most insightful analyses.'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`my-12 ${className}`}
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <Card className="card-premium bg-gradient-hero">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {locale === 'es' ? 'Análisis directo a su email' : 'Insights straight to your inbox'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'es' 
                  ? 'Solo contenido de valor, sin spam'
                  : 'Only valuable content, no spam'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                {locale === 'es' ? 'Email profesional' : 'Professional email'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={locale === 'es' ? 'ejemplo@clinica.com' : 'example@clinic.com'}
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="rgpd"
                checked={rgpdConsent}
                onCheckedChange={(checked) => setValue('rgpdConsent', checked as boolean)}
                disabled={isSubmitting}
                className="mt-1"
              />
              <Label 
                htmlFor="rgpd" 
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                {locale === 'es' ? (
                  <>
                    Acepto el tratamiento de mis datos según la{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      política de privacidad
                    </a>{' '}
                    para recibir análisis veterinarios de KADMEIA.
                  </>
                ) : (
                  <>
                    I accept the processing of my data according to the{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </a>{' '}
                    to receive veterinary insights from KADMEIA.
                  </>
                )}
              </Label>
            </div>
            {errors.rgpdConsent && (
              <p className="text-sm text-destructive">{errors.rgpdConsent.message}</p>
            )}

            <Button 
              type="submit" 
              className="w-full btn-secondary"
              disabled={isSubmitting || !rgpdConsent}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  {locale === 'es' ? 'Enviando...' : 'Sending...'}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {locale === 'es' ? 'Recibir análisis' : 'Get insights'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};