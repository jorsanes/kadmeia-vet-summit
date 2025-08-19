import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  Target,
  Building2,
  Brain,
  Workflow
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Cases = () => {
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

  const cases = [
    {
      id: 1,
      title: "Optimización de flujos clínicos con IA",
      sector: "Clínica veterinaria",
      client: "VetLife Madrid",
      duration: "8 semanas",
      team: "3 clínicas",
      icon: Brain,
      challenge: "Los veterinarios perdían 2-3 horas diarias en tareas administrativas, afectando la calidad de atención y generando burnout en el equipo.",
      solution: "Implementamos un sistema de IA para automatizar historiales, recordatorios y seguimientos, integrándolo con su software existente.",
      results: [
        "40% reducción en tiempo administrativo",
        "25% más consultas por día",
        "95% satisfacción del equipo veterinario",
        "ROI recuperado en 4 meses"
      ],
      technologies: ["IA conversacional", "Integración API", "Dashboard personalizado"],
      testimonial: {
        text: "KADMEIA no solo nos dio tecnología, nos devolvió el tiempo para hacer lo que realmente amamos: cuidar animales.",
        author: "Dra. Carmen Ruiz",
        position: "Directora VetLife Madrid"
      }
    },
    {
      id: 2,
      title: "IA para diagnóstico por imagen",
      sector: "Red de clínicas",
      client: "Grupo Veterinario del Sur",
      duration: "12 semanas",
      team: "15 clínicas",
      icon: Target,
      challenge: "Diagnósticos inconsistentes entre clínicas y dependencia excesiva de especialistas externos para casos complejos.",
      solution: "Desarrollamos un sistema de IA especializado en radiografías y ecografías, con validación cruzada entre especialistas.",
      results: [
        "95% precisión en diagnósticos",
        "60% reducción en derivaciones",
        "30% mejora en tiempo de diagnóstico",
        "Estandarización entre 15 clínicas"
      ],
      technologies: ["Computer Vision", "Machine Learning", "Cloud deployment"],
      testimonial: {
        text: "La precisión diagnóstica mejoró notablemente. Nuestros veterinarios tienen más confianza y los propietarios más tranquilidad.",
        author: "Dr. Miguel Ángel Torres",
        position: "CEO Grupo Veterinario del Sur"
      }
    },
    {
      id: 3,
      title: "Automatización de cadena de suministro",
      sector: "Distribuidor farmacéutico",
      client: "VetSupply Iberia",
      duration: "10 semanas",
      team: "200+ clínicas",
      icon: Workflow,
      challenge: "Gestión manual de inventarios, pedidos descoordinados y ruptura de stock frecuente afectando a 200+ clínicas cliente.",
      solution: "Creamos un sistema automatizado con Make y n8n que conecta demanda real, stock y proveedores en tiempo real.",
      results: [
        "30% reducción costes de inventario",
        "85% menos roturas de stock",
        "50% mejora en tiempo de entrega",
        "Satisfacción cliente del 92%"
      ],
      technologies: ["Make.com", "n8n", "API REST", "Analytics dashboard"],
      testimonial: {
        text: "Pasamos de gestión reactiva a predictiva. Nuestras clínicas ahora confían en que tendremos lo que necesitan cuando lo necesiten.",
        author: "Ana Martínez",
        position: "Directora Operaciones VetSupply"
      }
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
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">
            Casos de éxito
          </h1>
          <p className="text-xl text-muted-foreground">
            Proyectos reales con resultados medibles. Descubra cómo hemos transformado negocios veterinarios con tecnología y estrategia.
          </p>
        </motion.div>

        {/* Cases */}
        <motion.div 
          className="space-y-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {cases.map((caseItem, index) => (
            <motion.div 
              key={caseItem.id}
              variants={fadeInUp}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Case Overview */}
              <div className="lg:col-span-4">
                <Card className="card-premium h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl">
                        <caseItem.icon className="h-6 w-6 text-secondary" />
                      </div>
                      <Badge variant="secondary">{caseItem.sector}</Badge>
                    </div>
                    <CardTitle className="font-display text-xl text-foreground">
                      {caseItem.title}
                    </CardTitle>
                    <p className="text-muted-foreground font-medium">
                      Cliente: {caseItem.client}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-secondary" />
                        {caseItem.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 text-secondary" />
                        {caseItem.team}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Tecnologías</h4>
                        <div className="flex flex-wrap gap-2">
                          {caseItem.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Case Details */}
              <div className="lg:col-span-8 space-y-6">
                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">
                        Desafío
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {caseItem.challenge}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">
                        Solución
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {caseItem.solution}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Results */}
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                      <TrendingUp className="h-5 w-5 text-success" />
                      Resultados obtenidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {caseItem.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground font-medium">{result}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonial */}
                <Card className="card-premium bg-gradient-subtle">
                  <CardContent className="p-8">
                    <blockquote className="text-muted-foreground text-lg italic mb-6">
                      "{caseItem.testimonial.text}"
                    </blockquote>
                    <div>
                      <div className="font-semibold text-foreground">
                        {caseItem.testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {caseItem.testimonial.position}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="mt-20 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="card-premium max-w-3xl mx-auto">
            <CardContent className="p-12">
              <Building2 className="h-12 w-12 text-secondary mx-auto mb-6" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                ¿Su proyecto será el próximo caso de éxito?
              </h3>
              <p className="text-muted-foreground mb-8">
                Cada caso comienza con una conversación. Hablemos sobre sus desafíos y diseñemos una solución que genere resultados medibles.
              </p>
              <Button asChild size="lg" className="btn-primary">
                <Link to="/contacto" className="gap-2">
                  Discutir mi proyecto
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

export default Cases;