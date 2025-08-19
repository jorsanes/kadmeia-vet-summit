import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Mail, 
  Clock, 
  ArrowRight,
  ChevronRight 
} from 'lucide-react';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const tableOfContents = [
    { id: 'informacion-general', title: '1. Información general' },
    { id: 'datos-recopilados', title: '2. Datos que recopilamos' },
    { id: 'uso-datos', title: '3. Cómo utilizamos sus datos' },
    { id: 'base-legal', title: '4. Base legal del tratamiento' },
    { id: 'conservacion', title: '5. Conservación de datos' },
    { id: 'derechos', title: '6. Sus derechos' },
    { id: 'seguridad', title: '7. Seguridad de los datos' },
    { id: 'contacto-datos', title: '8. Contacto para temas de privacidad' },
    { id: 'actualizaciones', title: '9. Actualizaciones de esta política' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

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
            <Shield className="h-8 w-8 text-secondary" />
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En KADMEIA respetamos su privacidad y nos comprometemos a proteger sus datos personales. 
            Esta política explica cómo recopilamos, utilizamos y protegemos su información.
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
          {/* 1. Información General */}
          <motion.section 
            id="informacion-general"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">1. Información general</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">KADMEIA SLU</strong> (en adelante, "KADMEIA", "nosotros" o "la empresa") 
                  es el responsable del tratamiento de sus datos personales de acuerdo con el Reglamento General de Protección de Datos (RGPD).
                </p>
                <div className="bg-muted/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-2">Datos de contacto del responsable:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>Razón social:</strong> KADMEIA SLU</li>
                    <li><strong>CIF:</strong> B821932926</li>
                    <li><strong>Dirección:</strong> Camino de los Malatones, 63 - J3, 28119 Algete (Madrid), España</li>
                    <li><strong>Email:</strong> info@kadmeia.com</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 2. Datos Recopilados */}
          <motion.section 
            id="datos-recopilados"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">2. Datos que recopilamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Datos de contacto y identificación:</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li>Nombre completo</li>
                      <li>Dirección de correo electrónico</li>
                      <li>Número de teléfono (opcional)</li>
                      <li>Empresa u organización</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Datos técnicos:</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li>Dirección IP</li>
                      <li>Información del navegador y dispositivo</li>
                      <li>Páginas visitadas y tiempo de permanencia</li>
                      <li>Referencia de origen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 3. Uso de Datos */}
          <motion.section 
            id="uso-datos"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">3. Cómo utilizamos sus datos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Gestión de consultas:</strong>
                      <span className="text-muted-foreground"> Responder a sus solicitudes de información y gestionar el proceso de consultoría.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Comunicación comercial:</strong>
                      <span className="text-muted-foreground"> Envío de información sobre nuestros servicios (solo con su consentimiento explícito).</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Mejora de servicios:</strong>
                      <span className="text-muted-foreground"> Análisis agregado para mejorar nuestra web y servicios.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-foreground">Cumplimiento legal:</strong>
                      <span className="text-muted-foreground"> Cumplir con obligaciones legales y fiscales.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 4. Base Legal */}
          <motion.section 
            id="base-legal"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">4. Base legal del tratamiento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  El tratamiento de sus datos personales se basa en:
                </p>
                <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                  <div>
                    <strong className="text-foreground">Consentimiento (Art. 6.1.a RGPD):</strong>
                    <span className="text-muted-foreground"> Para comunicaciones comerciales y newsletter.</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Ejecución contractual (Art. 6.1.b RGPD):</strong>
                    <span className="text-muted-foreground"> Para gestionar consultas y prestación de servicios.</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Interés legítimo (Art. 6.1.f RGPD):</strong>
                    <span className="text-muted-foreground"> Para análisis de uso y mejora de servicios.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 5. Conservación */}
          <motion.section 
            id="conservacion"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">5. Conservación de datos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Conservamos sus datos personales únicamente durante el tiempo necesario para las finalidades para las que fueron recogidos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2">Consultas comerciales</h4>
                    <p className="text-sm text-muted-foreground">2 años desde el último contacto</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2">Clientes activos</h4>
                    <p className="text-sm text-muted-foreground">Duración del servicio + 6 años</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2">Newsletter</h4>
                    <p className="text-sm text-muted-foreground">Hasta la baja voluntaria</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2">Datos técnicos</h4>
                    <p className="text-sm text-muted-foreground">12 meses máximo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 6. Derechos */}
          <motion.section 
            id="derechos"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">6. Sus derechos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Bajo el RGPD, usted tiene los siguientes derechos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { right: 'Acceso', desc: 'Conocer qué datos tenemos sobre usted' },
                    { right: 'Rectificación', desc: 'Corregir datos inexactos o incompletos' },
                    { right: 'Supresión', desc: 'Solicitar la eliminación de sus datos' },
                    { right: 'Limitación', desc: 'Restringir el tratamiento de sus datos' },
                    { right: 'Portabilidad', desc: 'Recibir sus datos en formato estructurado' },
                    { right: 'Oposición', desc: 'Oponerse al tratamiento de sus datos' }
                  ].map((item, index) => (
                    <div key={index} className="border-l-4 border-secondary pl-4">
                      <h4 className="font-semibold text-foreground">{item.right}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/5 p-4 rounded-xl mt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Para ejercer sus derechos:</strong> Envíe un email a{' '}
                    <a href="mailto:info@kadmeia.com" className="text-primary hover:text-primary-hover transition-colors">
                      info@kadmeia.com
                    </a>{' '}
                    con el asunto "Ejercicio de derechos RGPD" incluyendo copia de su documento de identidad.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 7. Seguridad */}
          <motion.section 
            id="seguridad"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">7. Seguridad de los datos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Cifrado SSL/TLS en todas las comunicaciones</li>
                  <li>Acceso restringido a datos personales</li>
                  <li>Copias de seguridad regulares y seguras</li>
                  <li>Auditorías de seguridad periódicas</li>
                  <li>Formación regular del personal en protección de datos</li>
                </ul>
              </CardContent>
            </Card>
          </motion.section>

          {/* 8. Contacto */}
          <motion.section 
            id="contacto-datos"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">8. Contacto para temas de privacidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-secondary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">¿Preguntas sobre privacidad?</h4>
                      <p className="text-muted-foreground mb-3">
                        Si tiene alguna pregunta sobre esta política de privacidad o el tratamiento de sus datos personales, 
                        no dude en contactarnos.
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Email:</strong> info@kadmeia.com</p>
                        <p><strong>Asunto:</strong> "Consulta Privacidad"</p>
                        <p><strong>Respuesta:</strong> Máximo 30 días naturales</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 9. Actualizaciones */}
          <motion.section 
            id="actualizaciones"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">9. Actualizaciones de esta política</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nos reservamos el derecho a modificar esta política de privacidad para adaptarla a cambios normativos 
                  o en nuestros servicios. Cualquier cambio será comunicado a través de esta página web con al menos 
                  30 días de antelación a su entrada en vigor.
                </p>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Back to top / Contact CTA */}
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
                ¿Necesita más información?
              </h3>
              <p className="text-muted-foreground mb-6">
                Estamos aquí para resolver cualquier duda sobre el tratamiento de sus datos personales.
              </p>
              <Button asChild className="btn-primary">
                <Link to="/contacto" className="gap-2">
                  Contactar con nosotros
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;