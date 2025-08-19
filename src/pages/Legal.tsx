import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  Mail, 
  Clock, 
  ArrowRight,
  ChevronRight,
  Building2
} from 'lucide-react';

const Legal = () => {
  const [activeSection, setActiveSection] = useState('');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const tableOfContents = [
    { id: 'identificacion', title: '1. Identificación de la empresa' },
    { id: 'condiciones-uso', title: '2. Condiciones de uso del sitio web' },
    { id: 'propiedad-intelectual', title: '3. Propiedad intelectual' },
    { id: 'responsabilidad', title: '4. Limitación de responsabilidad' },
    { id: 'enlaces-terceros', title: '5. Enlaces a sitios de terceros' },
    { id: 'duracion-terminacion', title: '6. Duración y terminación' },
    { id: 'legislacion', title: '7. Legislación aplicable y jurisdicción' },
    { id: 'modificaciones', title: '8. Modificaciones del aviso legal' },
    { id: 'contacto-legal', title: '9. Contacto' }
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
            <Scale className="h-8 w-8 text-secondary" />
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
              Aviso Legal
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Información legal sobre el uso de este sitio web, condiciones de acceso y normativa aplicable 
            conforme a la legislación española vigente.
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
          {/* 1. Identificación */}
          <motion.section 
            id="identificacion"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-secondary" />
                  1. Identificación de la empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad 
                  de la Información y de Comercio Electrónico, se informa a los usuarios de los datos identificativos 
                  de la empresa titular de este sitio web:
                </p>
                <div className="bg-muted/30 p-6 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground">Denominación social:</h4>
                        <p className="text-muted-foreground">KADMEIA SLU</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">CIF:</h4>
                        <p className="text-muted-foreground">B821932926</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Domicilio social:</h4>
                        <p className="text-muted-foreground">
                          Camino de los Malatones, 63 - J3<br />
                          28119 Algete, Madrid, España
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground">Email de contacto:</h4>
                        <p className="text-muted-foreground">info@kadmeia.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Actividad:</h4>
                        <p className="text-muted-foreground">
                          Consultoría y tecnología veterinaria, desarrollo de software especializado
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Sitio web:</h4>
                        <p className="text-muted-foreground">kadmeia.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 2. Condiciones de uso */}
          <motion.section 
            id="condiciones-uso"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">2. Condiciones de uso del sitio web</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  El acceso y uso de este sitio web atribuye la condición de usuario y conlleva la aceptación plena 
                  de todas las condiciones incluidas en este Aviso Legal.
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Uso permitido</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li>Consulta de información sobre nuestros servicios</li>
                      <li>Solicitud de información comercial</li>
                      <li>Descarga de documentos públicos cuando esté expresamente permitido</li>
                      <li>Navegación con fines informativos y comerciales lícitos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Uso prohibido</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li>Realizar acciones que dañen, inutilicen o sobrecarguen el sitio web</li>
                      <li>Introducir virus, malware o códigos maliciosos</li>
                      <li>Intentar acceder a áreas restringidas del sistema</li>
                      <li>Realizar actividades fraudulentas o ilícitas</li>
                      <li>Utilizar el contenido con fines no autorizados</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 3. Propiedad intelectual */}
          <motion.section 
            id="propiedad-intelectual"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">3. Propiedad intelectual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Todos los contenidos del sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos, 
                  tecnología, software, enlaces y demás contenidos audiovisuales o sonoros, así como su diseño gráfico 
                  y códigos fuente, son propiedad intelectual de KADMEIA.
                </p>
                <div className="bg-primary/5 p-4 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-2">Derechos reservados</h4>
                  <p className="text-muted-foreground text-sm">
                    Quedan expresamente prohibidas la reproducción, distribución, comunicación pública, 
                    transformación y, en general, cualquier otra forma de explotación de la totalidad o parte 
                    de los contenidos de este sitio web, por cualquier medio o procedimiento, sin la autorización 
                    expresa y por escrito de KADMEIA.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Uso autorizado</h4>
                  <p className="text-muted-foreground text-sm">
                    El usuario puede visualizar y obtener copias temporales de los contenidos únicamente para su uso 
                    personal y privado. Cualquier otro uso requerirá autorización previa y expresa de KADMEIA.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 4. Responsabilidad */}
          <motion.section 
            id="responsabilidad"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">4. Limitación de responsabilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  KADMEIA no se responsabiliza de los daños y perjuicios que pudieran derivarse de:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Disponibilidad', desc: 'Interrupciones del servicio, fallos técnicos o mantenimiento' },
                    { title: 'Contenido', desc: 'Errores u omisiones en los contenidos o información desactualizada' },
                    { title: 'Terceros', desc: 'Actuaciones de terceros o contenidos enlazados' },
                    { title: 'Uso indebido', desc: 'Uso inadecuado del sitio web por parte de los usuarios' }
                  ].map((item, index) => (
                    <div key={index} className="bg-muted/30 p-4 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Importante:</strong> KADMEIA se compromete a mantener la máxima 
                    calidad y actualización de la información, pero no garantiza la ausencia total de errores o la 
                    disponibilidad ininterrumpida del servicio.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 5. Enlaces terceros */}
          <motion.section 
            id="enlaces-terceros"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">5. Enlaces a sitios de terceros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Este sitio web puede contener enlaces a sitios web de terceros. KADMEIA no controla ni se 
                  responsabiliza del contenido, políticas de privacidad o prácticas de dichos sitios.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Los enlaces se proporcionan únicamente para conveniencia del usuario
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        El acceso a sitios enlazados es bajo la responsabilidad exclusiva del usuario
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        KADMEIA no avala ni garantiza el contenido de sitios web externos
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 6. Duración */}
          <motion.section 
            id="duracion-terminacion"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">6. Duración y terminación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Las presentes condiciones permanecerán en vigor mientras el usuario acceda o utilice el sitio web. 
                  KADMEIA se reserva el derecho de:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Suspender temporalmente el acceso para mantenimiento o mejoras técnicas</li>
                  <li>Denegar el acceso a usuarios que incumplan estas condiciones</li>
                  <li>Modificar o discontinuar el servicio con previo aviso</li>
                  <li>Actualizar las condiciones de uso cuando sea necesario</li>
                </ul>
              </CardContent>
            </Card>
          </motion.section>

          {/* 7. Legislación */}
          <motion.section 
            id="legislacion"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">7. Legislación aplicable y jurisdicción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier 
                  controversia que pudiera suscitarse con ocasión del acceso o uso de este sitio web, KADMEIA y 
                  el usuario se someten expresamente a la jurisdicción de los Juzgados y Tribunales de Madrid capital.
                </p>
                <div className="bg-muted/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-2">Normativa aplicable</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico</li>
                    <li>• Reglamento General de Protección de Datos (RGPD)</li>
                    <li>• Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales</li>
                    <li>• Código Civil español y normativa complementaria</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 8. Modificaciones */}
          <motion.section 
            id="modificaciones"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">8. Modificaciones del aviso legal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  KADMEIA se reserva el derecho a modificar el presente Aviso Legal con el fin de adaptarlo a 
                  posibles cambios normativos, jurisprudenciales o de prestación de servicios.
                </p>
                <div className="bg-primary/5 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Comunicación de cambios:</strong> Cualquier modificación 
                    será publicada en esta misma página web con indicación de la fecha de actualización. 
                    Se recomienda revisar periódicamente este aviso legal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 9. Contacto */}
          <motion.section 
            id="contacto-legal"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">9. Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-secondary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Consultas legales</h4>
                      <p className="text-muted-foreground mb-3">
                        Para cualquier duda o consulta relacionada con este aviso legal o las condiciones de uso, 
                        puede ponerse en contacto con nosotros:
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Email:</strong> info@kadmeia.com</p>
                        <p><strong>Asunto:</strong> "Consulta Legal - Aviso Legal"</p>
                        <p><strong>Dirección postal:</strong> Camino de los Malatones, 63 - J3, 28119 Algete, Madrid</p>
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
                ¿Preguntas sobre aspectos legales?
              </h3>
              <p className="text-muted-foreground mb-6">
                Estamos a su disposición para aclarar cualquier aspecto de nuestro aviso legal.
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

export default Legal;