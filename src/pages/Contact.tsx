import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    consent: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Error",
        description: "Debe aceptar el tratamiento de datos personales",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto con usted en breve",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        consent: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al enviar el mensaje",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center mb-16"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            className="lg:col-span-1"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-display text-xl">
                  Información de contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground mb-1">Dirección</div>
                    <div className="text-sm text-muted-foreground">
                      Camino de los Malatones, 63 - J3<br />
                      28119 Algete, Madrid, España
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground mb-1">Email</div>
                    <div className="text-sm text-muted-foreground">
                      info@kadmeia.com
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground mb-1">Teléfono</div>
                    <div className="text-sm text-muted-foreground">
                      +34 XXX XXX XXX
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground mb-1">Horario</div>
                    <div className="text-sm text-muted-foreground">
                      Lunes - Viernes: 9:00 - 18:00<br />
                      Sábados: 10:00 - 14:00
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.name')} *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="focus-ring"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.email')} *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="focus-ring"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.company')}
                      </label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="focus-ring"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.phone')}
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="focus-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.form.message')} *
                    </label>
                    <Textarea
                      id="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="focus-ring"
                      placeholder="Cuéntenos sobre su proyecto o necesidades..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => handleChange('consent', checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                      {t('contact.form.consent')} *
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="btn-primary w-full md:w-auto px-8"
                    >
                      {isSubmitting ? 'Enviando...' : t('contact.form.submit')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;