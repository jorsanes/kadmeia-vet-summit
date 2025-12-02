
import { supabase } from '@/integrations/supabase/client';

export interface EditablePage {
  id: string;
  page_key: string;
  lang: string;
  content: any;
  last_modified: string;
  created_at: string;
}

export interface EditableSection {
  id: string;
  content: any;
  type: 'hero' | 'section' | 'card' | 'text';
}

// Get editable content for a page
export async function getEditablePageContent(pageKey: string, lang: string = 'es'): Promise<EditablePage | null> {
  try {
    const { data, error } = await supabase
      .from('editable_pages')
      .select('*')
      .eq('page_key', pageKey)
      .eq('lang', lang)
      .maybeSingle();

    if (error) {
      console.error('Error fetching editable page:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching editable page:', error);
    return null;
  }
}

// Save editable content for a page
export async function saveEditablePageContent(
  pageKey: string, 
  lang: string, 
  content: any
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('editable_pages')
      .upsert({
        page_key: pageKey,
        lang: lang,
        content: content,
        last_modified: new Date().toISOString()
      }, {
        onConflict: 'page_key,lang'
      });

    if (error) {
      console.error('Error saving editable page:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving editable page:', error);
    return false;
  }
}

// Get all editable pages for admin
export async function getAllEditablePages(): Promise<EditablePage[]> {
  try {
    const { data, error } = await supabase
      .from('editable_pages')
      .select('*')
      .order('page_key', { ascending: true })
      .order('lang', { ascending: true });

    if (error) {
      console.error('Error fetching all editable pages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all editable pages:', error);
    return [];
  }
}

// Default content structure for different page types
export const getDefaultPageContent = (pageKey: string, lang: string = 'es') => {
  const isEnglish = lang === 'en';
  
  const defaults = {
    home: {
      hero: {
        type: 'hero',
        title: isEnglish ? 'Veterinary consulting and technology, frictionless.' : 'Consultoría y tecnología veterinaria, sin fricción.',
        subtitle: isEnglish ? 'We integrate AI, processes and business for measurable results.' : 'Integramos IA, procesos y negocio para resultados medibles.',
        cta_primary: isEnglish ? "Let's talk" : 'Hablemos',
        cta_secondary: isEnglish ? 'See services' : 'Ver servicios'
      },
      whatWeDo: {
        type: 'section',
        title: isEnglish ? 'What we do' : 'Qué hacemos',
        subtitle: isEnglish ? 'Specialized solutions that transform the veterinary sector' : 'Soluciones especializadas que transforman el sector veterinario',
        services: [
          {
            title: isEnglish ? 'Market Bridge' : 'Market bridge',
            description: isEnglish ? 'Market access, pricing, channel strategy, OEM/Distribution agreements.' : 'Acceso a mercado, pricing, estrategia de canal, acuerdos OEM/Distribución.'
          },
          {
            title: isEnglish ? 'AI & software for clinics' : 'IA & software para clínicas',
            description: isEnglish ? 'Distribution/implementation of clinical AI for diagnostic support, workflows, and report automation.' : 'Distribución/implantación de IA clínica para soporte diagnóstico, flujos de trabajo y automatización de informes.'
          },
          {
            title: isEnglish ? 'No-Code Automation' : 'Automatización No-Code',
            description: isEnglish ? 'Make/n8n workflow design, PIMS integrations, CRM, email, dashboards.' : 'Diseño de flujos Make/n8n, integraciones con PIMS, CRM, email, dashboards.'
          }
        ]
      },
      results: {
        type: 'section',
        title: isEnglish ? 'Results Achieved' : 'Resultados obtenidos',
        subtitle: isEnglish ? 'Real metrics from our consulting and technology implementation projects' : 'Métricas reales de nuestros proyectos de consultoría e implementación tecnológica',
        metrics: [
          {
            value: '99.7',
            unit: '%',
            title: isEnglish ? 'Success Rate' : 'Tasa de éxito',
            description: isEnglish ? 'In veterinary AI implementations' : 'En implementaciones de IA veterinaria'
          },
          {
            value: '6.5',
            unit: isEnglish ? ' weeks' : ' semanas',
            title: isEnglish ? 'Average Time' : 'Tiempo promedio',
            description: isEnglish ? 'From project to measurable results' : 'De proyecto a resultados medibles'
          },
          {
            value: '150',
            unit: '+',
            title: isEnglish ? 'Clinics Transformed' : 'Clínicas transformadas',
            description: isEnglish ? 'In Spain, Portugal and United Kingdom' : 'En España, Portugal y Reino Unido'
          }
        ]
      },
      cases: {
        type: 'section',
        title: isEnglish ? 'Success Cases' : 'Casos de éxito',
        cases: isEnglish ? [
          { title: "Clinical workflow optimization", metric: 40, unit: "% time reduction", sector: "Veterinary clinic" },
          { title: "Inventory automation", metric: 30, unit: "% cost savings", sector: "Distributor" }
        ] : [
          { title: "Optimización de flujos clínicos", metric: 40, unit: "% reducción tiempo", sector: "Clínica veterinaria" },
          { title: "Automatización de inventario", metric: 30, unit: "% ahorro costes", sector: "Distribuidor" }
        ]
      },
      testimonials: {
        type: 'section',
        title: isEnglish ? 'They trust us' : 'Confían en nosotros',
        testimonials: isEnglish ? [
          {
            quote: "KADMEIA completely transformed our processes. Their scientific approach combined with practical solutions gave us immediate results.",
            author: "Dr. María González",
            position: "Clinical Director VetPlus"
          },
          {
            quote: "The AI implementation was perfect. The team understands both technology and the real needs of veterinary clinics.",
            author: "Carlos Ruiz",
            position: "CEO, Mediterranean Veterinary Group"
          }
        ] : [
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
        ]
      }
    },
    services: {
      header: {
        type: 'hero',
        title: isEnglish ? 'Our Services' : 'Nuestros servicios',
        subtitle: isEnglish ? 'Specialized solutions that transform the veterinary sector through science, technology and practical innovation.' : 'Soluciones especializadas que transforman el sector veterinario a través de la ciencia, la tecnología y la innovación práctica.'
      },
      services: {
        type: 'section',
        title: isEnglish ? 'Complete Solutions' : 'Soluciones completas',
        services: isEnglish ? [
          {
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
        ]
      }
    },
    about: {
      header: {
        type: 'hero',
        title: isEnglish ? 'About KADMEIA' : 'Sobre KADMEIA',
        subtitle: isEnglish ? 'We were born to be the bridge between veterinary science, business opportunities and technological solutions that really work.' : 'Nacimos para ser el puente entre la ciencia veterinaria, las oportunidades de negocio y las soluciones tecnológicas que realmente funcionan.'
      },
      mission: {
        type: 'section',
        title: isEnglish ? 'Clear, rigorous and human' : 'Clara, rigurosa y humana',
        content: isEnglish ? 'The veterinary sector evolves rapidly, but the gap between technological innovation and its practical application remains enormous. At KADMEIA we close that gap with solid roots in veterinary science and a technological look towards the future.' : 'El sector veterinario evoluciona rápidamente, pero la brecha entre la innovación tecnológica y su aplicación práctica sigue siendo enorme. En KADMEIA cerramos esa brecha con raíces sólidas en la ciencia veterinaria y una mirada tecnológica hacia el futuro.'
      },
      values: {
        type: 'section',
        title: isEnglish ? 'Our values: the 5 C' : 'Nuestros valores: los 5 C',
        subtitle: isEnglish ? 'Principles that guide every project and relationship we build' : 'Principios que guían cada proyecto y relación que construimos',
        values: [
          {
            title: isEnglish ? "Clear" : "Clara",
            description: isEnglish ? "Direct communication, without unnecessary technicalities. Each project has measurable objectives and transparent results." : "Comunicación directa, sin tecnicismos innecesarios. Cada proyecto tiene objetivos medibles y resultados transparentes."
          },
          {
            title: isEnglish ? "Scientific" : "Científica",
            description: isEnglish ? "Evidence-based decisions. We combine scientific rigor with practical experience from the veterinary sector." : "Decisiones basadas en evidencia. Combinamos rigor científico con experiencia práctica del sector veterinario."
          },
          {
            title: isEnglish ? "Close" : "Cercana",
            description: isEnglish ? "We understand the real needs of clinics and manufacturers. Human solutions for human problems." : "Entendemos las necesidades reales de clínicas y fabricantes. Soluciones humanas para problemas humanos."
          },
          {
            title: isEnglish ? "Reliable" : "Confiable",
            description: isEnglish ? "Committed to excellence and confidentiality. Each project is a long-term trust relationship." : "Comprometidos con la excelencia y la confidencialidad. Cada proyecto es una relación de confianza a largo plazo."
          },
          {
            title: isEnglish ? "With purpose" : "Con propósito",
            description: isEnglish ? "We transform the veterinary sector to improve animal health and the welfare of those who care for it." : "Transformamos el sector veterinario para mejorar la salud animal y el bienestar de quienes la cuidan."
          }
        ]
      }
    }
  };

  return defaults[pageKey as keyof typeof defaults] || {};
};
