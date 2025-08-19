import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Cookie, 
  FileText, 
  Mail, 
  Clock, 
  ArrowRight,
  ChevronRight,
  Settings,
  Shield,
  BarChart3,
  Target
} from 'lucide-react';

const Cookies = () => {
  const [activeSection, setActiveSection] = useState('');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const tableOfContents = [
    { id: 'que-son-cookies', title: '1. ¿Qué son las cookies?' },
    { id: 'tipos-cookies', title: '2. Tipos de cookies que utilizamos' },
    { id: 'finalidades', title: '3. Finalidades de las cookies' },
    { id: 'gestion-cookies', title: '4. Gestión de cookies' },
    { id: 'cookies-terceros', title: '5. Cookies de terceros' },
    { id: 'desactivar-cookies', title: '6. Cómo desactivar las cookies' },
    { id: 'actualizacion-politica', title: '7. Actualización de la política' },
    { id: 'mas-informacion', title: '8. Más información' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const cookieTypes = [
    {
      icon: Shield,
      title: 'Cookies técnicas',
      badge: 'Necesarias',
      badgeVariant: 'success' as const,
      description: 'Imprescindibles para el funcionamiento del sitio web',
      examples: ['Sesión de usuario', 'Preferencias de idioma', 'Carrito de compra'],
      duration: 'Sesión o hasta 1 año',
      canDisable: false
    },
    {
      icon: BarChart3,
      title: 'Cookies analíticas',
      badge: 'Estadísticas',
      badgeVariant: 'secondary' as const,
      description: 'Recopilan información sobre cómo los usuarios utilizan el sitio web',
      examples: ['Google Analytics', 'Páginas visitadas', 'Tiempo de permanencia'],
      duration: 'Hasta 2 años',
      canDisable: true
    },
    {
      icon: Target,
      title: 'Cookies de marketing',
      badge: 'Publicitarias',
      badgeVariant: 'warning' as const,
      description: 'Se utilizan para ofrecer contenido publicitario personalizado',
      examples: ['Remarketing', 'Intereses del usuario', 'Historial de navegación'],
      duration: 'Hasta 1 año',
      canDisable: true
    },
    {
      icon: Settings,
      title: 'Cookies de personalización',
      badge: 'Funcionales',
      badgeVariant: 'outline' as const,
      description: 'Permiten recordar preferencias para mejorar la experiencia',
      examples: ['Tema oscuro/claro', 'Configuración regional', 'Preferencias de pantalla'],
      duration: 'Hasta 1 año',
      canDisable: true
    }
  ];

  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Cookie className="h-8 w-8 text-secondary" />
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Política de Cookies
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Información detallada sobre el uso de cookies en nuestro sitio web, sus finalidades 
            y cómo puede gestionar sus preferencias de privacidad.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Última actualización: 19 de diciembre de 2024</span>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div 
          className="mb-12"
          initial="initial"
          animate="animate" 
          variants={fadeInUp}
        >
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-secondary" />
                Índice de contenidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all hover:bg-muted/50 focus-ring-kadmeia ${
                      activeSection === item.id ? 'bg-muted text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <ChevronRight className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{item.title}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* 1. Qué son las cookies */}
          <motion.section 
            id="que-son-cookies"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">1. ¿Qué son las cookies?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet, 
                  smartphone) cuando visita un sitio web. Estas cookies permiten que el sitio web recuerde sus acciones 
                  y preferencias durante un período de tiempo.
                </p>
                <div className="bg-muted/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-2">Información que pueden almacenar:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-secondary rounded-full"></div>
                      <span>Preferencias de idioma</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-secondary rounded-full"></div>
                      <span>Configuraciones de pantalla</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-secondary rounded-full"></div>
                      <span>Información de inicio de sesión</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-secondary rounded-full"></div>
                      <span>Páginas visitadas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 2. Tipos de cookies */}
          <motion.section 
            id="tipos-cookies"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">2. Tipos de cookies que utilizamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  En KADMEIA utilizamos diferentes tipos de cookies según su finalidad y características:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cookieTypes.map((type, index) => (
                    <div key={index} className="bg-muted/30 p-6 rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
                            <type.icon className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{type.title}</h4>
                            <Badge variant={type.badgeVariant} size="sm">{type.badge}</Badge>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          type.canDisable 
                            ? 'bg-warning/20 text-warning-foreground' 
                            : 'bg-success/20 text-success-foreground'
                        }`}>
                          {type.canDisable ? 'Opcional' : 'Necesaria'}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-foreground">Ejemplos:</span>
                          <p className="text-xs text-muted-foreground">{type.examples.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-foreground">Duración:</span>
                          <p className="text-xs text-muted-foreground">{type.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 3. Finalidades */}
          <motion.section 
            id="finalidades"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">3. Finalidades de las cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Utilizamos cookies para las siguientes finalidades específicas:
                </p>
                
                <div className="space-y-4">
                  {[
                    {
                      title: 'Funcionamiento técnico',
                      desc: 'Garantizar el correcto funcionamiento del sitio web y sus características'
                    },
                    {
                      title: 'Experiencia de usuario',
                      desc: 'Recordar sus preferencias y mejorar la navegación personalizada'
                    },
                    {
                      title: 'Análisis y estadísticas',
                      desc: 'Entender cómo los usuarios interactúan con nuestro contenido'
                    },
                    {
                      title: 'Seguridad',
                      desc: 'Detectar y prevenir actividades fraudulentas o maliciosas'
                    },
                    {
                      title: 'Optimización',
                      desc: 'Mejorar el rendimiento y velocidad de carga del sitio web'
                    }
                  ].map((purpose, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-secondary/10 rounded-full text-xs font-semibold text-secondary flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{purpose.title}</h4>
                        <p className="text-sm text-muted-foreground">{purpose.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 4. Gestión de cookies */}
          <motion.section 
            id="gestion-cookies"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">4. Gestión de cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Puede gestionar sus preferencias de cookies de las siguientes maneras:
                </p>
                
                <div className="bg-primary/5 p-6 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-secondary" />
                    Panel de configuración de cookies
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Al visitar nuestro sitio web por primera vez, aparecerá un banner informativo sobre cookies. 
                    Puede aceptar todas las cookies o personalizar sus preferencias.
                  </p>
                  <Button size="sm" className="btn-secondary">
                    Configurar cookies
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Opciones disponibles:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { option: 'Aceptar todas', desc: 'Permite todas las cookies para una experiencia completa' },
                      { option: 'Solo necesarias', desc: 'Solo cookies técnicas imprescindibles' },
                      { option: 'Personalizar', desc: 'Elegir qué tipos de cookies permitir' },
                      { option: 'Rechazar todas', desc: 'Solo cookies técnicas básicas' }
                    ].map((item, index) => (
                      <div key={index} className="border-l-4 border-secondary/30 pl-3">
                        <h5 className="font-medium text-foreground text-sm">{item.option}</h5>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 5. Cookies de terceros */}
          <motion.section 
            id="cookies-terceros"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">5. Cookies de terceros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Utilizamos servicios de terceros que pueden instalar cookies en su dispositivo:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">Google Analytics</h4>
                      <Badge variant="secondary" size="sm">Analíticas</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Recopila información estadística sobre el uso del sitio web de forma anónima.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Política:</strong>{' '}
                      <a 
                        href="https://policies.google.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover transition-colors"
                      >
                        policies.google.com/privacy
                      </a>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">Redes sociales</h4>
                      <Badge variant="warning" size="sm">Marketing</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Botones de compartir y widgets que pueden instalar cookies propias.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Plataformas:</strong> LinkedIn, Twitter, Facebook (según disponibilidad)
                    </div>
                  </div>
                </div>

                <div className="bg-warning/10 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Importante:</strong> KADMEIA no controla las cookies de terceros. 
                    Consulte las políticas de privacidad de cada proveedor para más información sobre cómo gestionan sus datos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 6. Cómo desactivar cookies */}
          <motion.section 
            id="desactivar-cookies"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">6. Cómo desactivar las cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Puede desactivar las cookies desde la configuración de su navegador:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { browser: 'Chrome', steps: 'Configuración > Privacidad y seguridad > Cookies y otros datos' },
                    { browser: 'Firefox', steps: 'Preferencias > Privacidad y seguridad > Cookies y datos' },
                    { browser: 'Safari', steps: 'Safari > Preferencias > Privacidad > Gestionar cookies' },
                    { browser: 'Edge', steps: 'Configuración > Cookies y permisos de sitios > Cookies' }
                  ].map((item, index) => (
                    <div key={index} className="bg-muted/30 p-4 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-2">{item.browser}</h4>
                      <p className="text-xs text-muted-foreground">{item.steps}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-destructive/10 p-4 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-destructive" />
                    Importante
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Desactivar todas las cookies puede afectar al funcionamiento del sitio web y limitar ciertas 
                    funcionalidades. Las cookies técnicas son necesarias para el funcionamiento básico.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 7. Actualización */}
          <motion.section 
            id="actualizacion-politica"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">7. Actualización de la política</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Esta política de cookies puede ser modificada para cumplir con nuevos requisitos normativos 
                  o para reflejar cambios en nuestras prácticas de uso de cookies.
                </p>
                <div className="bg-primary/5 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Notificación de cambios:</strong> Los usuarios serán 
                    informados de cualquier cambio significativo mediante banner en el sitio web o por email 
                    si han proporcionado su dirección de correo electrónico.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 8. Más información */}
          <motion.section 
            id="mas-informacion"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">8. Más información</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-secondary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">¿Necesita ayuda con las cookies?</h4>
                      <p className="text-muted-foreground mb-3">
                        Si tiene alguna duda sobre nuestra política de cookies o necesita ayuda para configurar 
                        sus preferencias, estamos aquí para ayudarle.
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Email:</strong> info@kadmeia.com</p>
                        <p><strong>Asunto:</strong> "Consulta Cookies"</p>
                        <p><strong>Más información sobre protección de datos:</strong>{' '}
                          <Link 
                            to="/privacidad" 
                            className="text-primary hover:text-primary-hover transition-colors"
                          >
                            Política de Privacidad
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-12 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="card-outline">
            <CardContent className="p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                ¿Preguntas sobre cookies?
              </h3>
              <p className="text-muted-foreground mb-6">
                Estamos comprometidos con la transparencia. Contacte con nosotros para cualquier consulta.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  <Link to="/privacidad">
                    Ver Política de Privacidad
                  </Link>
                </Button>
                <Button asChild className="btn-primary">
                  <Link to="/contacto" className="gap-2">
                    Contactar con nosotros
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Cookies;