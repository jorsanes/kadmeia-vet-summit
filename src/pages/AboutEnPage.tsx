import { motion } from 'framer-motion';
import { SmartImage } from '@/components/mdx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, Award } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import BrandWatermark from '@/components/brand/BrandWatermark';

const AboutEnPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen py-24 bg-background relative">
      {/* Brand Watermark */}
      <BrandWatermark className="top-8 right-8 rotate-12" />
      
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
              About KADMEIA
            </h1>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-xl text-muted-foreground">
              Veterinary consulting and technology that unites evidence, clarity and impact. We bridge science, business and technology for clinics and manufacturers.
            </p>
          </Reveal>
          
          <Reveal delay={0.1}>
            <SmartImage
              src="/images/illustrations/about-team.webp"
              alt="KADMEIA team - Veterinary consulting experts"
              className="w-full max-w-3xl mx-auto mt-8 rounded-2xl border"
              width={1200}
              height={800}
            />
          </Reveal>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <Reveal>
            <Card className="card-premium h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-secondary" />
                  <CardTitle className="font-display text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  We transform the veterinary sector by connecting scientific evidence with practical business and technological solutions. Our rigorous clinical approach combined with business focus delivers real measurable impact.
                </p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="card-premium h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-8 w-8 text-secondary" />
                  <CardTitle className="font-display text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To be the reference bridge between veterinary science and technology in Iberia and Europe, enabling clinics and manufacturers to make evidence-based decisions that improve patient outcomes and business performance.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* What Makes Us Different */}
        <Reveal>
          <div className="mb-20">
            <h2 className="font-display text-3xl font-semibold text-center mb-12">
              What Makes Us Different
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-premium text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">Clinical Rigor</h3>
                  <p className="text-muted-foreground">
                    Every recommendation is backed by scientific evidence and clinical expertise, ensuring decisions with real impact.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-premium text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">Business Focus</h3>
                  <p className="text-muted-foreground">
                    We understand that technology must translate into business value. Our solutions are designed for profitability and growth.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-premium text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">Frictionless Integration</h3>
                  <p className="text-muted-foreground">
                    From rapid pilot to scalable deployment. We provide training, materials, support and adoption metrics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Reveal>

        {/* Services Summary */}
        <Reveal>
          <div className="mb-20">
            <h2 className="font-display text-3xl font-semibold text-center mb-12">
              Our Service Pillars
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-premium">
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-3">Market Bridge</h3>
                  <p className="text-muted-foreground mb-4">
                    Market access, pricing, channel strategy, OEM/Distribution agreements for veterinary products.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Strategic market analysis</li>
                    <li>• Channel optimization</li>
                    <li>• Partnership development</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-3">AI & Software</h3>
                  <p className="text-muted-foreground mb-4">
                    Distribution and implementation of clinical AI for diagnostic support, workflows, and automated reporting.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Clinical AI solutions</li>
                    <li>• System integration</li>
                    <li>• Team training</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-3">No-Code Automation</h3>
                  <p className="text-muted-foreground mb-4">
                    Workflow design with Make/n8n, integrations with PIMS, CRM, email, dashboards.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Process automation</li>
                    <li>• System integrations</li>
                    <li>• Custom dashboards</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </Reveal>

        {/* Who We Serve */}
        <Reveal>
          <div className="mb-20">
            <h2 className="font-display text-3xl font-semibold text-center mb-8">
              Who We Serve
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Our solutions are designed for medical management, clinical innovation leaders, and business decision makers in the veterinary sector.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Small Animal Clinics</h3>
                <p className="text-muted-foreground">Independent clinics and veterinary groups</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Distributors & Manufacturers</h3>
                <p className="text-muted-foreground">Europe/Iberia market players</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Innovation Leaders</h3>
                <p className="text-muted-foreground">Medical management and innovation executives</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="card-premium max-w-3xl mx-auto">
            <CardContent className="p-12">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Ready to Bridge Science and Technology?
              </h3>
              <p className="text-muted-foreground mb-8">
                Let's talk about how we can help you achieve measurable results with evidence-based solutions.
              </p>
              <Button asChild size="lg" className="btn-primary">
                <Link to="/en/contact" className="gap-2">
                  Start the conversation
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

export default AboutEnPage;