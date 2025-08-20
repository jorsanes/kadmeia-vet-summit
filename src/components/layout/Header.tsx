import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/i18n/LocaleProvider';
import SmartImage from '@/components/ui/SmartImage';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const { locale, switchLocale } = useLocale();

  const toggleLanguage = () => {
    const newLang = locale === 'es' ? 'en' : 'es';
    switchLocale(newLang);
  };

  const getLocalizedHref = (path: string) => {
    return locale === 'en' ? `/en${path}` : path;
  };

  const navigation = [
    { name: t('nav.home'), href: getLocalizedHref('/') },
    { 
      name: t('nav.services'), 
      href: getLocalizedHref(locale === 'en' ? '/services' : '/servicios') 
    },
    { 
      name: t('nav.cases'), 
      href: getLocalizedHref(locale === 'en' ? '/cases' : '/casos') 
    },
    { name: t('nav.blog'), href: getLocalizedHref('/blog') },
    { 
      name: t('nav.about'), 
      href: getLocalizedHref(locale === 'en' ? '/about' : '/sobre') 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav aria-label="Global" className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link 
              to="/" 
              className="-m-1.5 p-1.5 flex items-center gap-2"
              aria-label="KADMEIA — Inicio"
            >
              <SmartImage
                src="/assets/brand/logo-kad-mark-gold.png"
                alt=""
                width={24}
                height={24}
                priority
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
              />
              <span className="font-display text-2xl font-semibold text-primary">
                KADMEIA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
            </Button>
            <Button asChild className="btn-primary">
              <Link to={getLocalizedHref(locale === 'en' ? '/contact' : '/contacto')}>
                {t('nav.cta')}
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="-m-2.5 p-2.5"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border/50"
          >
            <div className="space-y-2 px-6 pb-6 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2 text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {locale.toUpperCase()}
                </Button>
                <Button asChild className="btn-primary flex-1">
                  <Link 
                    to={getLocalizedHref(locale === 'en' ? '/contact' : '/contacto')} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.cta')}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;