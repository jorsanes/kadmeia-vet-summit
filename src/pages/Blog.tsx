import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Calendar,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  Brain,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
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

  const blogPosts = [
    {
      id: 1,
      title: "IA en veterinaria: más allá del hype, resultados reales",
      excerpt: "Análisis profundo de casos reales donde la inteligencia artificial está transformando la práctica veterinaria con resultados medibles, no promesas vacías.",
      author: "KADMEIA Team",
      date: "2024-03-15",
      readTime: "8 min",
      category: "Tecnología",
      tags: ["IA", "Casos reales", "Diagnóstico"],
      featured: true,
      icon: Brain
    },
    {
      id: 2,
      title: "5 errores fatales al implementar software en clínicas",
      excerpt: "De 50+ implementaciones, estos son los errores que garantizan el fracaso y cómo evitarlos. Guía práctica basada en experiencia real.",
      author: "KADMEIA Team",
      date: "2024-03-10",
      readTime: "6 min",
      category: "Gestión",
      tags: ["Implementación", "Software", "Errores comunes"],
      featured: false,
      icon: Lightbulb
    },
    {
      id: 3,
      title: "ROI en automatización veterinaria: números reales",
      excerpt: "Análisis detallado de 3 casos de automatización con números reales de inversión, ahorro y tiempo de recuperación. Sin marketing, solo datos.",
      author: "KADMEIA Team",
      date: "2024-03-05",
      readTime: "10 min",
      category: "Estrategia",
      tags: ["ROI", "Automatización", "Análisis financiero"],
      featured: false,
      icon: TrendingUp
    },
    {
      id: 4,
      title: "El futuro de la distribución veterinaria es predictivo",
      excerpt: "Cómo los distribuidores líderes están usando IA predictiva para optimizar inventarios y satisfacer demanda real, no estimada.",
      author: "KADMEIA Team",
      date: "2024-02-28",
      readTime: "7 min",
      category: "Distribución",
      tags: ["Predictivo", "Inventario", "Distribución"],
      featured: false,
      icon: TrendingUp
    },
    {
      id: 5,
      title: "Integración de sistemas: la pesadilla silenciosa",
      excerpt: "Por qué el 70% de integraciones fallan y cómo diseñar arquitecturas que realmente funcionen en el mundo real veterinario.",
      author: "KADMEIA Team",
      date: "2024-02-20",
      readTime: "9 min",
      category: "Tecnología",
      tags: ["Integración", "Arquitectura", "Sistemas"],
      featured: false,
      icon: Brain
    },
    {
      id: 6,
      title: "No-Code vs. Custom: cuándo elegir cada uno",
      excerpt: "Framework de decisión basado en 30+ proyectos: cuándo No-Code es suficiente y cuándo necesitas desarrollo custom. Con ejemplos reales.",
      author: "KADMEIA Team",
      date: "2024-02-15",
      readTime: "5 min",
      category: "Desarrollo",
      tags: ["No-Code", "Custom", "Framework de decisión"],
      featured: false,
      icon: Lightbulb
    }
  ];

  const categories = ["Todos", "Tecnología", "Gestión", "Estrategia", "Distribución", "Desarrollo"];

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
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Análisis profundos, casos reales y lecciones aprendidas del sector veterinario. Sin hype, solo experiencia práctica.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className={index === 0 ? "btn-primary" : "hover:bg-primary hover:text-primary-foreground"}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <motion.div
            key={post.id}
            className="mb-16"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <Card className="card-premium overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="bg-gradient-hero p-12 flex items-center justify-center">
                  <post.icon className="h-24 w-24 text-secondary" />
                </div>
                <div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary">{post.category}</Badge>
                      <Badge variant="outline">Destacado</Badge>
                    </div>
                    <CardTitle className="font-display text-2xl text-foreground leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="btn-primary">
                      Leer artículo completo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Other Posts */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {blogPosts.filter(post => !post.featured).map((post, index) => (
            <motion.div key={post.id} variants={fadeInUp}>
              <Card className="card-premium h-full group hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{post.category}</Badge>
                    <post.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="font-display text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-4 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto font-medium text-primary hover:bg-transparent">
                      Leer más
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div 
          className="mt-20 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="card-premium max-w-3xl mx-auto bg-gradient-hero">
            <CardContent className="p-12">
              <BookOpen className="h-12 w-12 text-secondary mx-auto mb-6" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                No se pierda nuestros análisis
              </h3>
              <p className="text-muted-foreground mb-8">
                Reciba nuestros artículos más profundos directamente en su email. Solo contenido de valor, sin spam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Su email profesional"
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button className="btn-secondary">
                  Suscribirse
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
