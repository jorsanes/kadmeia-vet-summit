import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Network, 
  Brain, 
  Workflow, 
  Building2, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle
} from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';
import { OrganizationJsonLd } from '@/components/seo/SeoJsonLd';
import { useLocale } from '@/i18n/LocaleProvider';
import heroImage from '@/assets/hero-kadmeia.jpg';
import logoLarge from '@/assets/kadmeia-logo-large.png';

const Home = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const getLocalizedHref = (path: string) => {
    return locale === 'en' ? `/en${path}` : path;
  };

  const seoTitle = locale === 'es' 
    ? 'KADMEIA - Consultoría y Tecnología Veterinaria' 
    : 'KADMEIA - Veterinary Consulting and Technology';
  
  const seoDescription = locale === 'es'
    ? 'Consultoría y tecnología veterinaria que une evidencia, claridad e impacto. Puenteamos ciencia, negocio y tecnología para clínicas y fabricantes.'
    : 'Veterinary consulting and technology that unites evidence, clarity and impact. We bridge science, business and technology for clinics and manufacturers.';

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

  return (
    <div className="min-h-screen">
      <PageSeo 
        title={seoTitle}
        description={seoDescription}
        ogType="website"
      />
      <OrganizationJsonLd />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="KADMEIA - Veterinary Consulting"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        {/* Large logo decoration */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 hidden xl:block">
          <img 
            src={logoLarge} 
            alt="" 
            className="w-80 h-80 object-contain"
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              variants={fadeInUp}
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p 
              className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div 
              className="mt-10 flex items-center justify-center gap-4 flex-wrap"
              variants={fadeInUp}
            >
              <Button 
                asChild 
                size="lg" 
                className="btn-primary text-lg px-8 py-4 h-auto"
              >
                <Link to="/contacto" className="gap-2">
                  {t('hero.cta_primary')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 h-auto border-2 hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/servicios">
                  {t('hero.cta_secondary')}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('whatWeDo.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('whatWeDo.subtitle')}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="card-premium h-full">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mb-6">
                    <Network className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {t('whatWeDo.bridge.title')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('whatWeDo.bridge.description')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="card-premium h-full">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mb-6">
                    <Brain className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {t('whatWeDo.ai.title')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('whatWeDo.ai.description')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="card-premium h-full">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mb-6">
                    <Workflow className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {t('whatWeDo.automation.title')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('whatWeDo.automation.description')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('sectors.title')}
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="text-center p-8 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
            >
              <Building2 className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {t('sectors.clinics')}
              </h3>
            </motion.div>

            <motion.div 
              className="text-center p-8 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
            >
              <TrendingUp className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {t('sectors.distributors')}
              </h3>
            </motion.div>

            <motion.div 
              className="text-center p-8 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
            >
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {t('sectors.corporate')}
              </h3>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="flex items-center justify-between mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t('cases.title')}
              </h2>
            </div>
            <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground">
              <Link to="/casos">{t('cases.viewAll')}</Link>
            </Button>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Placeholder Cases */}
            {[
              { title: "Optimización de flujos clínicos", metric: "40% reducción tiempo", sector: "Clínica veterinaria" },
              { title: "IA para diagnóstico por imagen", metric: "95% precisión", sector: "Red de clínicas" },
              { title: "Automatización de inventario", metric: "30% ahorro costes", sector: "Distribuidor" }
            ].map((caseItem, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="card-premium h-full hover:shadow-elegant transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="text-sm text-secondary font-medium mb-2">
                      {caseItem.sector}
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-4">
                      {caseItem.title}
                    </h3>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {caseItem.metric}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mr-2" />
                      Caso verificado
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('testimonials.title')}
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Placeholder Testimonials */}
            {[
              {
                quote: "KADMEIA transformó completamente nuestros procesos. Su enfoque científico combinado con soluciones prácticas nos dio resultados inmediatos.",
                author: "Dra. María González",
                position: "Directora Clínica VetPlus"
              },
              {
                quote: "La implementación de IA fue perfecta. El equipo entiende tanto la tecnología como las necesidades reales de las clínicas veterinarias.",
                author: "Carlos Ruiz",
                position: "CEO, Grupo Veterinario Mediterráneo"
              }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="card-premium h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.position}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="font-display text-3xl font-semibold tracking-tight sm:text-4xl mb-6"
              variants={fadeInUp}
            >
              {t('finalCta.title')}
            </motion.h2>
            <motion.p 
              className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {t('finalCta.subtitle')}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button 
                asChild 
                size="lg" 
                variant="secondary"
                className="btn-secondary text-lg px-8 py-4 h-auto"
              >
                <Link to="/contacto" className="gap-2">
                  {t('finalCta.cta')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;