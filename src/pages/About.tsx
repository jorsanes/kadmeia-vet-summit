import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Target, 
  Lightbulb, 
  Award, 
  Heart,
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/ui/Reveal';
import SmartImage from '@/components/media/SmartImage';

const About = () => {
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

  const values = [
    {
      icon: Target,
      title: "Clara",
      description: "Comunicación directa, sin tecnicismos innecesarios. Cada proyecto tiene objetivos medibles y resultados transparentes."
    },
    {
      icon: BookOpen,
      title: "Científica",
      description: "Decisiones basadas en evidencia. Combinamos rigor científico con experiencia práctica del sector veterinario."
    },
    {
      icon: Heart,
      title: "Cercana",
      description: "Entendemos las necesidades reales de clínicas y fabricantes. Soluciones humanas para problemas humanos."
    },
    {
      icon: Award,
      title: "Confiable",
      description: "Comprometidos con la excelencia y la confidencialidad. Cada proyecto es una relación de confianza a largo plazo."
    },
    {
      icon: Zap,
      title: "Con propósito",
      description: "Transformamos el sector veterinario para mejorar la salud animal y el bienestar de quienes la cuidan."
    }
  ];

  const credentials = [
    "Veterinaria con especialización en innovación",
    "15+ años en consultoría tecnológica",
    "Certificaciones en IA y automatización",
    "Red de partners tecnológicos especializados",
    "Experiencia en más de 50 proyectos veterinarios"
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
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">
            Sobre KADMEIA
          </h1>
          <p className="text-xl text-muted-foreground">
            Nacimos para ser el puente entre la ciencia veterinaria, las oportunidades de negocio y las soluciones tecnológicas que realmente funcionan.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.section 
          className="mb-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="card-premium">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge variant="secondary" className="mb-4">
                    Nuestra misión
                  </Badge>
                  <h2 className="font-display text-3xl font-semibold text-foreground mb-6">
                    Clara, rigurosa y humana
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    El sector veterinario evoluciona rápidamente, pero la brecha entre la innovación tecnológica y su aplicación práctica sigue siendo enorme.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    En KADMEIA cerramos esa brecha con <strong className="text-foreground">raíces sólidas</strong> en la ciencia veterinaria y una <strong className="text-foreground">mirada tecnológica</strong> hacia el futuro.
                  </p>
                </div>
                <div className="relative">
                  <div className="bg-gradient-subtle p-8 rounded-2xl">
                    <Lightbulb className="h-16 w-16 text-secondary mb-4" />
                    <blockquote className="text-lg italic text-muted-foreground">
                      "No vendemos tecnología por vender. Construimos soluciones que realmente transforman la práctica veterinaria."
                    </blockquote>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Values - Los 5 C */}
        <motion.section 
          className="mb-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
              Nuestros valores: los 5 C
            </h2>
            <p className="text-muted-foreground text-lg">
              Principios que guían cada proyecto y relación que construimos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={`card-premium h-full ${index === 4 ? 'md:col-span-2 lg:col-span-1 lg:mx-auto lg:max-w-sm' : ''}`}>
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mx-auto mb-6">
                      <value.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Method */}
        <motion.section 
          className="mb-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Badge variant="secondary" className="mb-4">
                Nuestro método
              </Badge>
              <h2 className="font-display text-3xl font-semibold text-foreground mb-6">
                Evidencia + Práctica + Tecnología
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                No partimos de soluciones predefinidas. Cada proyecto comienza con una comprensión profunda de:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">El contexto científico:</strong> ¿Qué dice la evidencia?
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">La realidad práctica:</strong> ¿Cómo trabajan realmente?
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Las oportunidades tecnológicas:</strong> ¿Qué es posible hoy?
                  </span>
                </li>
              </ul>
              
              <Reveal>
                <SmartImage
                  src="/images/illustrations/about-team.webp"
                  alt="Equipo colaborando en implementación clínica"
                  className="w-full max-w-3xl mx-auto my-8 rounded-2xl shadow"
                  width={1200}
                  height={800}
                />
              </Reveal>
            </div>

            <Card className="card-premium">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-secondary mb-6" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  Credenciales y experiencia
                </h3>
                <ul className="space-y-3">
                  {credentials.map((credential, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{credential}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 p-4 bg-muted/30 rounded-xl">
                  <p className="text-sm text-muted-foreground italic">
                    "Certificaciones y partners verificables. Transparencia total en nuestras capacidades y limitaciones."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="card-premium bg-gradient-hero">
            <CardContent className="p-12 text-center">
              <h3 className="font-display text-3xl font-semibold text-foreground mb-6">
                ¿Listo para transformar su proyecto veterinario?
              </h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Conversemos sobre cómo nuestro enfoque científico y tecnológico puede impulsar su negocio con claridad y resultados medibles.
              </p>
              <Button asChild size="lg" className="btn-primary">
                <Link to="/contacto" className="gap-2">
                  Iniciar conversación
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default About;