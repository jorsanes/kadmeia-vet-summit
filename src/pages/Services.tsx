import { useTranslation } from 'react-i18next';
import { useLocale } from '@/i18n/LocaleProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Network, 
  Brain, 
  Workflow, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Target,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/ui/Reveal';
import { SmartImage } from '@/components/mdx';

const Services = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();

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

  const services = locale === 'en' ? [
    {
      icon: Network,
      title: "Strategic Consulting",
      subtitle: "Science-business-technology bridge",
      description: "We connect scientific evidence with business opportunities and practical technological solutions for the veterinary sector.",
      deliverables: [
        "Specialized market analysis",
        "Evidence-based product strategy",
        "Personalized technology roadmap",
        "Detailed implementation plan"
      ],
      process: [
        "Initial diagnosis and needs analysis",
        "Market research and benchmarking",
        "Strategy and roadmap development",
        "Results presentation and follow-up"
      ],
      duration: "4-8 weeks",
      target: "Manufacturers and distributors"
    },
    {
      icon: Brain,
      title: "AI and software for clinics",
      subtitle: "Distribution and implementation",
      description: "We implement and distribute artificial intelligence solutions that optimize clinical management and improve results.",
      deliverables: [
        "Personalized AI software",
        "Integration with existing systems",
        "Complete team training",
        "Ongoing technical support"
      ],
      process: [
        "Technical evaluation and requirements",
        "Customization and integration",
        "Testing and validation",
        "Training and deployment"
      ],
      duration: "6-12 weeks",
      target: "Clinics and veterinary groups"
    },
    {
      icon: Workflow,
      title: "No-Code Automation",
      subtitle: "Workflows with Make and n8n",
      description: "We create automated workflows that free up time for what really matters: quality veterinary care.",
      deliverables: [
        "Personalized automated workflows",
        "Cross-platform integration",
        "Monitoring dashboard",
        "Documentation and maintenance"
      ],
      process: [
        "Current process analysis",
        "Automation design",
        "Implementation and testing",
        "Optimization and training"
      ],
      duration: "3-6 weeks",
      target: "All types of organizations"
    }
  ] : [
    {
      icon: Network,
      title: "Consultoría estratégica",
      subtitle: "Puente ciencia-negocio-tecnología",
      description: "Conectamos evidencia científica con oportunidades de negocio y soluciones tecnológicas prácticas para el sector veterinario.",
      deliverables: [
        "Análisis de mercado especializado",
        "Estrategia de producto basada en evidencia",
        "Roadmap tecnológico personalizado",
        "Plan de implementación detallado"
      ],
      process: [
        "Diagnóstico inicial y análisis de necesidades",
        "Investigación de mercado y benchmarking",
        "Desarrollo de estrategia y roadmap",
        "Presentación de resultados y seguimiento"
      ],
      duration: "4-8 semanas",
      target: "Fabricantes y distribuidores"
    },
    {
      icon: Brain,
      title: "IA y software para clínicas",
      subtitle: "Distribución e implantación",
      description: "Implementamos y distribuimos soluciones de inteligencia artificial que optimizan la gestión clínica y mejoran los resultados.",
      deliverables: [
        "Software IA personalizado",
        "Integración con sistemas existentes",
        "Formación del equipo completa",
        "Soporte técnico continuado"
      ],
      process: [
        "Evaluación técnica y requisitos",
        "Customización e integración",
        "Testing y validación",
        "Formación y puesta en marcha"
      ],
      duration: "6-12 semanas",
      target: "Clínicas y grupos veterinarios"
    },
    {
      icon: Workflow,
      title: "Automatización No-Code",
      subtitle: "Flujos con Make y n8n",
      description: "Creamos flujos automatizados que liberan tiempo para lo que realmente importa: la atención veterinaria de calidad.",
      deliverables: [
        "Flujos automatizados personalizados",
        "Integración entre plataformas",
        "Dashboard de monitorización",
        "Documentación y mantenimiento"
      ],
      process: [
        "Análisis de procesos actuales",
        "Diseño de automatizaciones",
        "Implementación y testing",
        "Optimización y formación"
      ],
      duration: "3-6 semanas",
      target: "Todo tipo de organizaciones"
    }
  ];

  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mx-auto max-w-3xl text-center mb-20"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Reveal y={12}>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">
              {locale === 'en' ? 'Our Services' : 'Nuestros servicios'}
            </h1>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-xl text-muted-foreground">
              {locale === 'en' 
                ? 'Specialized solutions that transform the veterinary sector through science, technology and practical innovation.'
                : 'Soluciones especializadas que transforman el sector veterinario a través de la ciencia, la tecnología y la innovación práctica.'
              }
            </p>
          </Reveal>
          
          <Reveal delay={0.1}>
            <SmartImage
              src="/images/illustrations/services-flow.webp"
              alt="Flujo de automatización No-Code para clínica"
              className="w-full max-w-3xl mx-auto mt-8 rounded-2xl border"
              width={1200}
              height={800}
            />
          </Reveal>
        </motion.div>

        {/* Services */}
        <Reveal>
          <div className="space-y-20">
            {services.map((service, index) => (
              <Reveal 
                key={index}
                delay={index * 0.1}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
              >
                {/* Service Info */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Card className="card-premium h-full">
                    <CardHeader className="pb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl">
                          <service.icon className="h-6 w-6 text-secondary" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {service.target}
                        </Badge>
                      </div>
                      <CardTitle className="font-display text-2xl text-foreground">
                        {service.title}
                      </CardTitle>
                      <p className="text-secondary font-medium">
                        {service.subtitle}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-secondary" />
                          {service.duration}
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-secondary" />
                          {locale === 'en' ? 'Measurable results' : 'Resultados medibles'}
                        </div>
                      </div>

                      <Button asChild className="btn-primary">
                        <Link to={locale === 'en' ? '/en/contact' : '/contacto'} className="gap-2">
                          {locale === 'en' ? 'Consult project' : 'Consultar proyecto'}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Deliverables & Process */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {/* Deliverables */}
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        {locale === 'en' ? 'Deliverables' : 'Entregables'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {service.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Process */}
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-secondary" />
                        {locale === 'en' ? 'Process' : 'Proceso'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {service.process.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-secondary/10 rounded-full text-xs font-semibold text-secondary flex-shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <span className="text-sm text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="card-premium max-w-3xl mx-auto">
            <CardContent className="p-12">
              <Users className="h-12 w-12 text-secondary mx-auto mb-6" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                {locale === 'en' ? "Can't find what you're looking for?" : '¿No encuentra lo que busca?'}
              </h3>
              <p className="text-muted-foreground mb-8">
                {locale === 'en' 
                  ? "Every project is unique. Let's talk about your specific needs and design a custom solution."
                  : 'Cada proyecto es único. Hablemos sobre sus necesidades específicas y diseñemos una solución a medida.'
                }
              </p>
              <Button asChild size="lg" className="btn-primary">
                <Link to={locale === 'en' ? '/en/contact' : '/contacto'} className="gap-2">
                  {locale === 'en' ? 'Personalized consultation' : 'Consulta personalizada'}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;