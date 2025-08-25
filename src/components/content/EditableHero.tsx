import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useLocale } from "@/i18n/LocaleProvider";
import { SmartImage } from "@/components/mdx";
import { useEditableContent } from './EditableContent';
import Reveal from "@/components/ui/Reveal";
import BrandWatermark from "@/components/brand/BrandWatermark";

import heroImage from "@/assets/hero-kadmeia.jpg";
import logoLarge from "@/assets/kadmeia-logo-large.png";

interface EditableHeroProps {
  defaultTitle: string;
  defaultSubtitle: string;
  defaultCtaPrimary: string;
  defaultCtaSecondary: string;
}

export const EditableHero: React.FC<EditableHeroProps> = ({
  defaultTitle,
  defaultSubtitle,
  defaultCtaPrimary,
  defaultCtaSecondary
}) => {
  const { locale } = useLocale();
  const { content: heroContent, isLoading } = useEditableContent('home', 'hero', locale);

  const getLocalizedHref = (path: string) => {
    return locale === 'en' ? `/en${path}` : path;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Use editable content if available, otherwise use defaults
  const title = heroContent?.title || defaultTitle;
  const subtitle = heroContent?.subtitle || defaultSubtitle;
  const ctaPrimary = heroContent?.cta_primary || defaultCtaPrimary;
  const ctaSecondary = heroContent?.cta_secondary || defaultCtaSecondary;

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0">
        <SmartImage
          src={heroImage}
          alt="KADMEIA - Veterinary Consulting"
          className="w-full h-full object-cover opacity-10"
          priority={true}
          width={1920}
          height={1080}
        />
      </div>
      
      {/* Large logo decoration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 hidden xl:block">
        <SmartImage 
          src={logoLarge} 
          alt="" 
          className="w-80 h-80 object-contain"
          width={320}
          height={320}
        />
      </div>
      
      {/* Brand Watermark */}
      <BrandWatermark className="top-16 left-8 -rotate-12" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <Reveal y={12}>
            <h1 
              className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p 
              className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl max-w-3xl mx-auto"
            >
              {subtitle}
            </p>
          </Reveal>
          <motion.div 
            className="mt-10 flex items-center justify-center gap-4 flex-wrap"
            variants={fadeInUp}
          >
            <Button 
              asChild 
              size="lg" 
              className="btn-primary text-lg px-8 py-4 h-auto"
            >
              <Link to={getLocalizedHref(locale === 'en' ? '/contact' : '/contacto')} className="gap-2">
                {ctaPrimary}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 h-auto border-2 hover:bg-primary hover:text-primary-foreground"
            >
              <Link to={getLocalizedHref(locale === 'en' ? '/services' : '/servicios')}>
                {ctaSecondary}
              </Link>
            </Button>
           </motion.div>
         </motion.div>
         
         <Reveal delay={0.1}>
           <SmartImage
             src="/images/illustrations/hero-vet-desk.webp"
             alt="Veterinaria trabajando con paneles de IA"
             className="w-full max-w-4xl mx-auto mt-8 shadow-lg rounded-2xl"
             width={1200}
             height={800}
             priority
           />
         </Reveal>
       </div>
    </section>
  );
};