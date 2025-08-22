import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NewsletterInline } from '@/components/ui/NewsletterInline';
import { Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrackedLink } from '@/components/analytics/TrackedComponents';
import { UTMParams } from '@/lib/analytics';

interface BlogCTAProps {
  lang: string;
  type?: 'newsletter' | 'contact' | 'mixed';
  source?: string;
  utmParams?: UTMParams;
}

export const BlogCTA: React.FC<BlogCTAProps> = ({ 
  lang, 
  type = 'mixed',
  source = 'blog',
  utmParams
}) => {
  const isSpanish = lang === 'es';

  if (type === 'newsletter') {
    return (
      <Card className="my-12">
        <CardContent className="p-8 text-center">
          <NewsletterInline />
        </CardContent>
      </Card>
    );
  }

  if (type === 'contact') {
    return (
      <Card className="my-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-serif text-foreground mb-3">
              {isSpanish 
                ? '¿Necesitas ayuda con tu proyecto?' 
                : 'Need help with your project?'
              }
            </h3>
            <p className="text-muted-foreground mb-6">
              {isSpanish
                ? 'Hablemos sobre cómo podemos ayudarte a implementar estas soluciones en tu clínica.'
                : 'Let\'s discuss how we can help you implement these solutions in your clinic.'
              }
            </p>
            <TrackedLink
              href={isSpanish ? '/contacto' : '/en/contact'}
              eventName="CTA Click"
              eventProps={{ location: source, type: 'contact-cta' }}
              utmParams={utmParams}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium"
            >
              {isSpanish ? 'Hablemos' : 'Let\'s talk'}
            </TrackedLink>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mixed type - both newsletter and contact
  return (
    <div className="space-y-8 my-12">
      {/* Newsletter Section */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-serif text-foreground mb-2">
              {isSpanish 
                ? 'Mantente actualizado' 
                : 'Stay updated'
              }
            </h3>
            <p className="text-sm text-muted-foreground">
              {isSpanish
                ? 'Recibe los últimos artículos sobre tecnología veterinaria'
                : 'Get the latest articles on veterinary technology'
              }
            </p>
          </div>
          <NewsletterInline />
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-serif text-foreground mb-3">
              {isSpanish 
                ? '¿Listo para implementar?' 
                : 'Ready to implement?'
              }
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {isSpanish
                ? 'Consulta gratuita para evaluar tu caso específico'
                : 'Free consultation to evaluate your specific case'
              }
            </p>
            <TrackedLink
              href={isSpanish ? '/contacto' : '/en/contact'}
              eventName="CTA Click"
              eventProps={{ location: source, type: 'consultation-cta' }}
              utmParams={utmParams}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium"
            >
              {isSpanish ? 'Consulta gratuita' : 'Free consultation'}
            </TrackedLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};