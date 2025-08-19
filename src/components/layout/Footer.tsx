import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-4">
              <span className="font-display text-2xl font-semibold">
                KADMEIA
              </span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div 
                  className="text-sm text-primary-foreground/80"
                  dangerouslySetInnerHTML={{ __html: t('footer.address') }}
                />
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary" />
                <a 
                  href={`mailto:${t('footer.email')}`}
                  className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
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
                <Link 
                  to="/servicios"
                  className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/casos"
                  className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  {t('nav.cases')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog"
                  className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/sobre"
                  className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">
              {t('footer.newsletter.title')}
            </h3>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full btn-secondary"
              >
                {t('footer.newsletter.cta')}
              </Button>
            </div>
            
            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a 
                href="#" 
                className="text-primary-foreground/60 hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-primary-foreground/60 hover:text-secondary transition-colors"
                aria-label="Twitter"
              >
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
              <Link 
                to="/privacidad"
                className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
              >
                {t('footer.links.privacy')}
              </Link>
              <Link 
                to="/aviso-legal"
                className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
              >
                {t('footer.links.legal')}
              </Link>
              <Link 
                to="/cookies"
                className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
              >
                {t('footer.links.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;