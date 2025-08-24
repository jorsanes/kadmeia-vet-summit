import { useTranslation } from 'react-i18next';
import { useLocale } from '@/i18n/LocaleProvider';
import { Mail, MapPin, Linkedin, Twitter } from 'lucide-react';
import { SmartImage } from '@/components/mdx';
import { NewsletterFooter } from '@/components/ui';
const Footer = () => {
  const {
    t
  } = useTranslation();
  const {
    locale
  } = useLocale();
  const getLocalizedHref = (path: string) => {
    return locale === 'en' ? `/en${path}` : path;
  };
  return <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <SmartImage src="/assets/brand/logo-kad-mark-gold.png" alt="" width={20} height={20} loading="lazy" decoding="async" className="w-5 h-5" />
              <div>
                <div className="font-display text-lg font-semibold text-primary-foreground">KADMEIA SLU — ES-B21932926</div>
                <div className="text-sm text-primary-foreground/80">
                  Camino de los Malatones, 63 - J3<br />
                  28119 Algete (Madrid), España
                </div>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary" />
                <a href={`mailto:${t('footer.email')}`} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  {t('footer.email')}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">
              Navegación
            </h3>
            <ul className="space-y-3">
              <li>
                <a href={getLocalizedHref(locale === 'en' ? '/services' : '/servicios')} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  {t('nav.services')}
                </a>
              </li>
              <li>
                <a href={getLocalizedHref(locale === 'en' ? '/cases' : '/casos')} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  {t('nav.cases')}
                </a>
              </li>
              <li>
                <a href={getLocalizedHref('/blog')} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  {t('nav.blog')}
                </a>
              </li>
              <li>
                <a href={getLocalizedHref(locale === 'en' ? '/about' : '/sobre')} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  {t('nav.about')}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">
              {t('footer.newsletter.title')}
            </h3>
            <NewsletterFooter />
            
            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2024 KADMEIA. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href={getLocalizedHref(locale === 'en' ? '/privacy' : '/privacidad')} className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                {t('footer.links.privacy')}
              </a>
              <a href={getLocalizedHref(locale === 'en' ? '/legal' : '/aviso-legal')} className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                {t('footer.links.legal')}
              </a>
              <a href={getLocalizedHref('/cookies')} className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                {t('footer.links.cookies')}
              </a>
              <a href="/rss.xml" target="_blank" rel="noopener" className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                RSS
              </a>
              <a href="/offline.html" className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                Offline
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;